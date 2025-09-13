import Place from '../models/Place.js';
import Journal from '../models/Journal.js';
import logger from '../config/logger.config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadImage, deleteImage, generateImageVariants } from '../config/cloudinary.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ajouter des photos à un lieu (avec upload vers Cloudinary)
export const addPhotoToPlace = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { captions } = req.body; // Array de captions pour chaque photo

		// Debug: Logs détaillés de ce qui est reçu
		logger.info('📸 Upload de photos - Données reçues:', {
			placeId: id,
			filesCount: req.files ? req.files.length : 0,
			bodyKeys: Object.keys(req.body),
			body: req.body,
			filesInfo: req.files
				? req.files.map((f) => ({
						fieldname: f.fieldname,
						originalname: f.originalname,
						mimetype: f.mimetype,
						size: f.size
					}))
				: []
		});

		if (!req.files || req.files.length === 0) {
			logger.warn("❌ Aucun fichier reçu pour l'upload de photos", {
				placeId: id,
				body: req.body
			});
			return res.status(400).json({ message: 'Aucune photo uploadée' });
		}

		// Vérifier que la place existe et appartient à l'utilisateur
		const place = await Place.findOne({
			_id: id,
			user_id: req.user.id
		});

		if (!place) {
			return res.status(404).json({ message: 'Place not found or not authorized' });
		}

		const newPhotos = [];
		const uploadedFiles = []; // Pour nettoyer en cas d'erreur

		try {
			// Traiter chaque fichier uploadé vers Cloudinary
			for (let i = 0; i < req.files.length; i++) {
				const file = req.files[i];

				// Upload vers Cloudinary
				const cloudinaryResult = await uploadImage(
					file.path,
					`memo-trip/places/${place._id}`,
					`${place._id}_${Date.now()}_${i}`
				);

				uploadedFiles.push(cloudinaryResult.public_id);

				// Créer l'objet photo avec les URLs transformées
				const photoData = {
					url: cloudinaryResult.url,
					public_id: cloudinaryResult.public_id,
					caption: captions && captions[i] ? captions[i] : '',
					uploadedAt: new Date(),
					size: cloudinaryResult.size,
					width: cloudinaryResult.width,
					height: cloudinaryResult.height,
					format: cloudinaryResult.format,
					// Générer les variantes d'images
					variants: generateImageVariants(cloudinaryResult.public_id)
				};

				newPhotos.push(photoData);

				// Supprimer le fichier temporaire local
				fs.unlink(file.path, (unlinkErr) => {
					if (unlinkErr) {
						logger.warn('Error deleting temporary file', {
							path: file.path,
							error: unlinkErr.message
						});
					}
				});
			}

			// Ajouter les photos au lieu
			place.photos.push(...newPhotos);
			await place.save();

			logger.info('Photos added to place via Cloudinary', {
				placeId: id,
				photoCount: newPhotos.length,
				cloudinaryIds: newPhotos.map((p) => p.public_id)
			});

			res.status(201).json({
				message: 'Photos ajoutées avec succès',
				photos: newPhotos,
				total_photos: place.photos.length
			});
		} catch (cloudinaryError) {
			// En cas d'erreur, supprimer les images déjà uploadées sur Cloudinary
			for (const publicId of uploadedFiles) {
				try {
					await deleteImage(publicId);
				} catch (deleteError) {
					logger.error('Error deleting Cloudinary image during cleanup', {
						public_id: publicId,
						error: deleteError.message
					});
				}
			}
			throw cloudinaryError;
		}
	} catch (err) {
		// Nettoyer les fichiers temporaires locaux
		if (req.files) {
			req.files.forEach((file) => {
				fs.unlink(file.path, (unlinkErr) => {
					if (unlinkErr) {
						logger.warn('Error deleting temporary file during cleanup', {
							path: file.path,
							error: unlinkErr.message
						});
					}
				});
			});
		}
		next(err);
	}
};

// Supprimer une photo d'un lieu (depuis Cloudinary)
export const removePhotoFromPlace = async (req, res, next) => {
	try {
		const { id, photoId } = req.params;

		// Vérifier que la place appartient à l'utilisateur
		const place = await Place.findOne({
			_id: id,
			user_id: req.user.id
		});

		if (!place) {
			return res.status(404).json({ message: 'Place not found or not authorized' });
		}

		// Trouver la photo à supprimer
		const photoToRemove = place.photos.find((photo) => photo._id.toString() === photoId);

		if (!photoToRemove) {
			return res.status(404).json({ message: 'Photo not found' });
		}

		try {
			// Supprimer l'image de Cloudinary si elle a un public_id
			if (photoToRemove.public_id) {
				await deleteImage(photoToRemove.public_id);

				logger.info('Photo deleted from Cloudinary', {
					public_id: photoToRemove.public_id,
					placeId: id,
					photoId
				});
			} else if (photoToRemove.filename) {
				// Fallback : supprimer le fichier local pour les anciennes données
				const filePath = path.join(__dirname, '../../uploads', photoToRemove.filename);
				fs.unlink(filePath, (unlinkErr) => {
					if (unlinkErr) {
						logger.warn('Error deleting legacy photo file', {
							filename: photoToRemove.filename,
							error: unlinkErr.message
						});
					} else {
						logger.info('Legacy photo file deleted', {
							filename: photoToRemove.filename,
							placeId: id
						});
					}
				});
			}

			// Supprimer la photo de la base de données
			place.photos = place.photos.filter((photo) => photo._id.toString() !== photoId);
			await place.save();

			logger.info('Photo removed from place', {
				placeId: id,
				photoId,
				totalPhotosRemaining: place.photos.length
			});

			res.json({
				message: 'Photo supprimée avec succès',
				total_photos: place.photos.length
			});
		} catch (cloudinaryError) {
			logger.error('Error deleting photo from Cloudinary', {
				public_id: photoToRemove.public_id,
				error: cloudinaryError.message,
				placeId: id,
				photoId
			});

			// Continuer avec la suppression de la base de données même si Cloudinary échoue
			place.photos = place.photos.filter((photo) => photo._id.toString() !== photoId);
			await place.save();

			res.status(207).json({
				message: 'Photo supprimée de la base de données, mais erreur avec Cloudinary',
				warning: cloudinaryError.message,
				total_photos: place.photos.length
			});
		}
	} catch (err) {
		next(err);
	}
};

// Obtenir toutes les photos d'un lieu
export const getPlacePhotos = async (req, res, next) => {
	try {
		const { id } = req.params;
		const place = await Place.findById(id).select('photos name');

		if (!place) {
			return res.status(404).json({ message: 'Place not found' });
		}

		res.json({
			place_name: place.name,
			photos: place.photos,
			total: place.photos.length
		});
	} catch (err) {
		next(err);
	}
};

// GET /api/places?limit=10&page=2&search=Paris&user_id=123&journal_id=456&sort_by=date_visited
export const getPlaces = async (req, res, next) => {
	try {
		const {
			page = 1,
			limit = 10,
			search,
			user_id,
			journal_id,
			city,
			country,
			rating_min,
			rating_max,
			sort_by = 'date_visited',
			sort_order = 'desc'
		} = req.query;

		const filter = {};

		if (user_id) filter.user_id = user_id;
		if (journal_id) filter.journal_id = journal_id;
		if (city) filter['location.city'] = new RegExp(city, 'i');
		if (country) filter['location.country'] = new RegExp(country, 'i');
		if (rating_min || rating_max) {
			filter.rating = {};
			if (rating_min) filter.rating.$gte = Number(rating_min);
			if (rating_max) filter.rating.$lte = Number(rating_max);
		}

		if (search) {
			filter.$or = [
				{ name: new RegExp(search, 'i') },
				{ description: new RegExp(search, 'i') },
				{ 'location.address': new RegExp(search, 'i') },
				{ 'location.city': new RegExp(search, 'i') },
				{ 'location.country': new RegExp(search, 'i') },
				{ tags: new RegExp(search, 'i') }
			];
		}

		const sortOption = {};
		sortOption[sort_by] = sort_order === 'desc' ? -1 : 1;

		const places = await Place.find(filter)
			.populate('user_id', 'name email')
			.populate('journal_id', 'title')
			.skip((page - 1) * limit)
			.limit(Number(limit))
			.sort(sortOption)
			.exec();

		const total = await Place.countDocuments(filter);
		res.json({
			data: places,
			meta: { total, page: Number(page), limit: Number(limit) },
			filters: { search, user_id, journal_id, city, country, rating_min, rating_max, sort_by, sort_order }
		});
	} catch (err) {
		next(err);
	}
};

// GET /api/places/:id
export const getPlaceById = async (req, res, next) => {
	try {
		const { id } = req.params;

		// Validation simple de l'ObjectId
		if (!id.match(/^[0-9a-fA-F]{24}$/)) {
			return res.status(400).json({
				message: 'Invalid place ID format',
				error: 'Place ID must be a valid MongoDB ObjectId'
			});
		}

		const place = await Place.findById(id).populate('user_id', 'name email').populate('journal_id', 'title');
		if (!place) return res.status(404).json({ message: 'Place not found' });
		res.json(place);
	} catch (err) {
		next(err);
	}
};

// POST /api/places
export const createPlace = async (req, res, next) => {
	try {
		// Debug: Log des données reçues
		logger.info('Creating place - received data:', {
			body: req.body,
			userId: req.user?.id,
			timestamp: new Date().toISOString()
		});

		// Ajouter l'ID de l'utilisateur authentifié
		let placeData = {
			...req.body,
			user_id: req.user.id
		};

		// Vérifier que le journal appartient à l'utilisateur
		const journal = await Journal.findOne({
			_id: placeData.journal_id,
			user_id: req.user.id
		});

		if (!journal) {
			return res.status(404).json({
				message: 'Journal not found or not authorized'
			});
		}

		// === LOGIQUE MÉTIER : DÉTERMINER LE STATUT SELON L'ÉTAT TEMPOREL DU JOURNAL ===
		const now = new Date();
		const journalStart = new Date(journal.start_date);
		const journalEnd = new Date(journal.end_date);

		// Déterminer l'état temporel du journal
		const isJournalFuture = journalStart > now;
		const isJournalCurrent = journalStart <= now && now <= journalEnd;
		const isJournalPast = journalEnd < now;

		logger.info('Journal temporal state:', {
			journalId: journal._id,
			journalDates: { start: journalStart, end: journalEnd },
			now,
			isFuture: isJournalFuture,
			isCurrent: isJournalCurrent,
			isPast: isJournalPast
		});

		// === ADAPTER LES DONNÉES SELON L'ÉTAT TEMPOREL ===
		if (isJournalFuture) {
			// Journal futur → UNIQUEMENT statut 'planned'
			placeData = {
				...placeData,
				status: 'planned',
				// Utiliser les dates planifiées
				plannedStart: placeData.start_date || placeData.date_visited || placeData.plannedStart,
				plannedEnd: placeData.end_date || placeData.date_visited || placeData.plannedEnd,
				// Nettoyer les champs "visited" (non autorisés pour planned)
				date_visited: null,
				start_date: null,
				end_date: null,
				visitedAt: null,
				rating: null, // Pas de note pour un lieu non visité
				weather: null, // Pas de météo avant la visite
				visit_duration: null // Pas de durée avant la visite
			};
			logger.info('Future journal - forcing planned status', { placeData });
		} else {
			// Journal en cours ou passé → statut 'visited' autorisé (défaut)
			if (!placeData.status) placeData.status = 'visited';

			if (placeData.status === 'visited') {
				// S'assurer que les dates obligatoires sont présentes
				if (!placeData.start_date) placeData.start_date = placeData.date_visited;
				if (!placeData.end_date) placeData.end_date = placeData.date_visited;
				if (!placeData.date_visited) placeData.date_visited = placeData.start_date;

				// Nettoyer les champs "planned" (non utilisés pour visited)
				placeData.plannedStart = null;
				placeData.plannedEnd = null;
			}
			logger.info('Current/past journal - allowing visited status', { placeData });
		}

		// Debug: Log des données finales avant création
		logger.info('Final place data before creation:', {
			placeData,
			location: placeData.location,
			status: placeData.status,
			dates: {
				// Visited fields
				date_visited: placeData.date_visited,
				start_date: placeData.start_date,
				end_date: placeData.end_date,
				visitedAt: placeData.visitedAt,
				// Planned fields
				plannedStart: placeData.plannedStart,
				plannedEnd: placeData.plannedEnd
			}
		});

		const place = new Place(placeData);
		await place.save();
		await place.populate('user_id', 'name email');

		// Ajouter la place au journal si elle n'y est pas déjà
		if (!journal.places.includes(place._id)) {
			journal.places.push(place._id);
			await journal.save();
		}

		logger.info('Place created and added to journal', {
			placeId: place._id,
			journalId: journal._id,
			userId: req.user.id,
			status: place.status
		});

		res.status(201).json(place);
	} catch (err) {
		next(err);
	}
};

// PUT /api/places/:id
export const updatePlace = async (req, res, next) => {
	try {
		// Vérifier que la place existe et appartient à l'utilisateur
		const existingPlace = await Place.findOne({
			_id: req.params.id,
			user_id: req.user.id
		}).populate('journal_id');

		if (!existingPlace) {
			return res.status(404).json({
				message: 'Place not found or not authorized'
			});
		}

		// Récupérer le journal (existant ou nouveau si modifié)
		let journal = existingPlace.journal_id;
		if (req.body.journal_id && req.body.journal_id !== existingPlace.journal_id._id.toString()) {
			// Vérifier que le nouveau journal appartient à l'utilisateur
			journal = await Journal.findOne({
				_id: req.body.journal_id,
				user_id: req.user.id
			});

			if (!journal) {
				return res.status(404).json({
					message: 'Journal not found or not authorized'
				});
			}
		}

		// === LOGIQUE MÉTIER : ADAPTER SELON L'ÉTAT TEMPOREL DU JOURNAL ===
		const now = new Date();
		const journalStart = new Date(journal.start_date);
		const journalEnd = new Date(journal.end_date);

		// Déterminer l'état temporel du journal
		const isJournalFuture = journalStart > now;
		const isJournalCurrent = journalStart <= now && now <= journalEnd;
		const isJournalPast = journalEnd < now;

		logger.info('Journal temporal state for update:', {
			journalId: journal._id,
			journalDates: { start: journalStart, end: journalEnd },
			now,
			isFuture: isJournalFuture,
			isCurrent: isJournalCurrent,
			isPast: isJournalPast
		});

		// Adapter les données selon les règles métier
		let updateData = { ...req.body };

		if (isJournalFuture) {
			// Journal futur → FORCER statut 'planned' et bloquer les données "visited"
			updateData = {
				...updateData,
				status: 'planned',
				// Mapper les dates vers les champs planifiés
				plannedStart: updateData.start_date || updateData.date_visited || updateData.plannedStart,
				plannedEnd: updateData.end_date || updateData.date_visited || updateData.plannedEnd,
				// Nettoyer les champs "visited" (interdits pour planned)
				date_visited: null,
				start_date: null,
				end_date: null,
				visitedAt: null,
				rating: null, // Pas de note pour un lieu non visité
				weather: null, // Pas de météo avant la visite
				visit_duration: null // Pas de durée avant la visite
			};
			logger.info('Future journal - forcing planned status for update', { updateData });
		} else {
			// Journal en cours/passé → Autoriser 'visited' (défaut) et valider les transitions
			if (!updateData.status) {
				// Si pas de statut spécifié, garder l'existant ou défaut à 'visited'
				updateData.status = existingPlace.status || 'visited';
			}

			// Valider la transition de statut
			if (existingPlace.status === 'planned' && updateData.status === 'visited') {
				// Transition planned → visited : mapper les dates
				if (existingPlace.plannedStart && !updateData.start_date) {
					updateData.start_date = existingPlace.plannedStart;
				}
				if (existingPlace.plannedEnd && !updateData.end_date) {
					updateData.end_date = existingPlace.plannedEnd;
				}
				if (!updateData.date_visited) {
					updateData.date_visited = updateData.start_date || existingPlace.plannedStart;
				}
				// Nettoyer les champs planned
				updateData.plannedStart = null;
				updateData.plannedEnd = null;
			}

			if (updateData.status === 'visited') {
				// S'assurer que les dates obligatoires sont présentes pour visited
				if (updateData.date_visited && !updateData.start_date) {
					updateData.start_date = updateData.date_visited;
				}
				if (updateData.date_visited && !updateData.end_date) {
					updateData.end_date = updateData.date_visited;
				}
				if (!updateData.date_visited && updateData.start_date) {
					updateData.date_visited = updateData.start_date;
				}
			}

			logger.info('Current/past journal - processing update', {
				existingStatus: existingPlace.status,
				newStatus: updateData.status,
				updateData
			});
		}

		// Debug: Log des données finales avant mise à jour
		logger.info('Final update data:', {
			placeId: req.params.id,
			userId: req.user.id,
			updateData,
			status: updateData.status,
			dates: {
				// Visited fields
				date_visited: updateData.date_visited,
				start_date: updateData.start_date,
				end_date: updateData.end_date,
				visitedAt: updateData.visitedAt,
				// Planned fields
				plannedStart: updateData.plannedStart,
				plannedEnd: updateData.plannedEnd
			},
			timestamp: new Date().toISOString()
		});

		// Effectuer la mise à jour
		const place = await Place.findByIdAndUpdate(req.params.id, updateData, {
			new: true,
			runValidators: true
		}).populate('user_id', 'name email');

		logger.info('Place updated successfully', {
			placeId: place._id,
			userId: req.user.id,
			status: place.status
		});

		res.json(place);
	} catch (err) {
		next(err);
	}
};

// DELETE /api/places/:id
export const deletePlace = async (req, res, next) => {
	try {
		// Trouver la place avant de la supprimer pour récupérer le journal_id et les photos
		const place = await Place.findOne({
			_id: req.params.id,
			user_id: req.user.id
		});

		if (!place) {
			return res.status(404).json({
				message: 'Place not found or not authorized'
			});
		}

		logger.info('🗑️ Suppression du lieu avec photos Cloudinary', {
			placeId: req.params.id,
			photosCount: place.photos ? place.photos.length : 0,
			photos: place.photos
				? place.photos.map((p) => ({
						public_id: p.public_id,
						url: p.url
					}))
				: []
		});

		// 🌩️ ÉTAPE 1: Supprimer toutes les images de Cloudinary
		if (place.photos && place.photos.length > 0) {
			const deletionErrors = [];

			for (const photo of place.photos) {
				try {
					if (photo.public_id) {
						// Supprimer l'image de Cloudinary
						await deleteImage(photo.public_id);
						logger.info('✅ Image Cloudinary supprimée', {
							public_id: photo.public_id,
							placeId: req.params.id
						});
					} else if (photo.filename) {
						// Fallback : supprimer fichier local legacy
						const filePath = path.join(__dirname, '../../uploads', photo.filename);
						fs.unlink(filePath, (unlinkErr) => {
							if (unlinkErr) {
								logger.warn('Erreur suppression fichier legacy', {
									filename: photo.filename,
									error: unlinkErr.message
								});
							}
						});
					}
				} catch (cloudinaryError) {
					// Logger l'erreur mais ne pas faire échouer la suppression
					logger.error('❌ Erreur suppression image Cloudinary', {
						public_id: photo.public_id,
						error: cloudinaryError.message,
						placeId: req.params.id
					});
					deletionErrors.push({
						public_id: photo.public_id,
						error: cloudinaryError.message
					});
				}
			}

			if (deletionErrors.length > 0) {
				logger.warn("⚠️ Certaines images n'ont pas pu être supprimées de Cloudinary", {
					placeId: req.params.id,
					errors: deletionErrors
				});
			}
		}

		// 🗄️ ÉTAPE 2: Supprimer la place du journal
		await Journal.findByIdAndUpdate(place.journal_id, {
			$pull: { places: place._id }
		});

		// 🗄️ ÉTAPE 3: Supprimer la place de la base de données
		const result = await Place.deleteOne({
			_id: req.params.id,
			user_id: req.user.id
		});

		if (result.deletedCount === 0) {
			return res.status(404).json({ message: 'Place not found' });
		}

		logger.info('✅ Lieu supprimé complètement (DB + Cloudinary)', {
			placeId: req.params.id,
			journalId: place.journal_id,
			userId: req.user.id,
			photosDeleted: place.photos ? place.photos.length : 0
		});

		res.status(204).end();
	} catch (err) {
		logger.error('❌ Erreur lors de la suppression du lieu', {
			placeId: req.params.id,
			error: err.message,
			stack: err.stack
		});
		next(err);
	}
};

// GET /api/places/nearby?lat=48.8566&lng=2.3522&maxDistance=1000
export const getNearbyPlaces = async (req, res, next) => {
	try {
		const { lat, lng, maxDistance = 1000 } = req.query;

		if (!lat || !lng) {
			return res.status(400).json({ message: 'Latitude and longitude are required' });
		}

		const places = await Place.find({
			location: {
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: [parseFloat(lng), parseFloat(lat)]
					},
					$maxDistance: parseInt(maxDistance)
				}
			}
		}).populate('user_id', 'name email');

		res.json({ data: places });
	} catch (err) {
		next(err);
	}
};
