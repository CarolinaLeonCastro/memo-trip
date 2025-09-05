import Place from '../models/Place.js';
import Journal from '../models/Journal.js';
import logger from '../config/logger.config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ajouter des photos à un lieu (avec upload)
export const addPhotoToPlace = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { captions } = req.body; // Array de captions pour chaque photo

		if (!req.files || req.files.length === 0) {
			return res.status(400).json({ message: 'Aucune photo uploadée' });
		}

		const place = await Place.findById(id);
		if (!place) {
			return res.status(404).json({ message: 'Place not found' });
		}

		// Traiter chaque fichier uploadé
		const newPhotos = req.files.map((file, index) => ({
			url: `/uploads/${file.filename}`,
			filename: file.filename,
			caption: captions && captions[index] ? captions[index] : '',
			uploadedAt: new Date(),
			size: file.size,
			mimetype: file.mimetype
		}));

		// Ajouter les photos au lieu
		place.photos.push(...newPhotos);
		await place.save();

		logger.info('Photos added to place', {
			placeId: id,
			photoCount: newPhotos.length,
			filenames: newPhotos.map((p) => p.filename)
		});

		res.status(201).json({
			message: 'Photos ajoutées avec succès',
			photos: newPhotos,
			total_photos: place.photos.length
		});
	} catch (err) {
		// En cas d'erreur, supprimer les fichiers uploadés
		if (req.files) {
			req.files.forEach((file) => {
				const filePath = path.join(__dirname, '../../uploads', file.filename);
				fs.unlink(filePath, (unlinkErr) => {
					if (unlinkErr) {
						logger.error('Error deleting uploaded file', {
							filename: file.filename,
							error: unlinkErr.message
						});
					}
				});
			});
		}
		next(err);
	}
};

// Supprimer une photo d'un lieu
export const removePhotoFromPlace = async (req, res, next) => {
	try {
		const { id, photoId } = req.params;

		const place = await Place.findById(id);
		if (!place) {
			return res.status(404).json({ message: 'Place not found' });
		}

		// Trouver la photo à supprimer pour récupérer le nom du fichier
		const photoToRemove = place.photos.find((photo) => photo._id.toString() === photoId);

		if (!photoToRemove) {
			return res.status(404).json({ message: 'Photo not found' });
		}

		// Supprimer le fichier physique
		if (photoToRemove.filename) {
			const filePath = path.join(__dirname, '../../uploads', photoToRemove.filename);
			fs.unlink(filePath, (unlinkErr) => {
				if (unlinkErr) {
					logger.error('Error deleting photo file', {
						filename: photoToRemove.filename,
						error: unlinkErr.message
					});
				} else {
					logger.info('Photo file deleted successfully', {
						filename: photoToRemove.filename,
						placeId: id
					});
				}
			});
		}

		// Supprimer la photo de la base de données
		place.photos = place.photos.filter((photo) => photo._id.toString() !== photoId);
		await place.save();

		res.json({
			message: 'Photo supprimée avec succès',
			total_photos: place.photos.length
		});
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
		const placeData = {
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

		// S'assurer que start_date et end_date sont définies
		if (!placeData.start_date) {
			placeData.start_date = placeData.date_visited;
		}
		if (!placeData.end_date) {
			placeData.end_date = placeData.date_visited;
		}

		// Debug: Log des données finales avant création
		logger.info('Final place data before creation:', {
			placeData,
			location: placeData.location,
			dates: {
				date_visited: placeData.date_visited,
				start_date: placeData.start_date,
				end_date: placeData.end_date
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
			userId: req.user.id
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
		});

		if (!existingPlace) {
			return res.status(404).json({
				message: 'Place not found or not authorized'
			});
		}

		// Vérifier que le journal appartient à l'utilisateur si journal_id est modifié
		if (req.body.journal_id && req.body.journal_id !== existingPlace.journal_id.toString()) {
			const journal = await Journal.findOne({
				_id: req.body.journal_id,
				user_id: req.user.id
			});

			if (!journal) {
				return res.status(404).json({
					message: 'Journal not found or not authorized'
				});
			}
		}

		// S'assurer que start_date et end_date sont cohérentes
		const updateData = { ...req.body };
		if (updateData.date_visited && !updateData.start_date) {
			updateData.start_date = updateData.date_visited;
		}
		if (updateData.date_visited && !updateData.end_date) {
			updateData.end_date = updateData.date_visited;
		}

		// Debug: Log des données de mise à jour
		logger.info('Updating place', {
			placeId: req.params.id,
			userId: req.user.id,
			updateData,
			timestamp: new Date().toISOString()
		});

		// Effectuer la mise à jour
		const place = await Place.findByIdAndUpdate(req.params.id, updateData, {
			new: true,
			runValidators: true
		}).populate('user_id', 'name email');

		logger.info('Place updated successfully', {
			placeId: place._id,
			userId: req.user.id
		});

		res.json(place);
	} catch (err) {
		next(err);
	}
};

// DELETE /api/places/:id
export const deletePlace = async (req, res, next) => {
	try {
		// Trouver la place avant de la supprimer pour récupérer le journal_id
		const place = await Place.findOne({ 
			_id: req.params.id, 
			user_id: req.user.id 
		});
		
		if (!place) {
			return res.status(404).json({ 
				message: 'Place not found or not authorized' 
			});
		}

		// Supprimer la place du journal
		await Journal.findByIdAndUpdate(
			place.journal_id,
			{ $pull: { places: place._id } }
		);

		// Supprimer la place
		const result = await Place.deleteOne({ 
			_id: req.params.id, 
			user_id: req.user.id 
		});
		
		if (result.deletedCount === 0) {
			return res.status(404).json({ message: 'Place not found' });
		}

		logger.info('Place deleted and removed from journal', {
			placeId: req.params.id,
			journalId: place.journal_id,
			userId: req.user.id
		});

		res.status(204).end();
	} catch (err) {
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
