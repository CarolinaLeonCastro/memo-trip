import Journal from '../models/Journal.js';
import Place from '../models/Place.js';
import { uploadImage, deleteImage, generateImageVariants } from '../config/cloudinary.config.js';
import fs from 'fs';
import logger from '../config/logger.config.js';

// POST /api/journals
export async function createJournal(req, res, next) {
	try {
		const journalData = {
			...req.body,
			user_id: req.user.id
		};
		const journal = await Journal.create(journalData);
		res.status(201).json(journal);
	} catch (err) {
		next(err);
	}
}

// GET /api/journals?limit=10&page=1&search=title&status=published&tags=vacation
export async function getJournals(req, res, next) {
	try {
		const {
			page = 1,
			limit = 20,
			search,
			user_id,
			status,
			tags,
			sort_by = 'start_date',
			sort_order = 'desc'
		} = req.query;

		const filter = { user_id: req.user.id }; // Toujours filtrer par l'utilisateur authentifié
		if (status) filter.status = status;
		if (tags) filter.tags = { $in: tags.split(',') };
		if (search) {
			filter.$or = [
				{ title: new RegExp(search, 'i') },
				{ description: new RegExp(search, 'i') },
				{ tags: new RegExp(search, 'i') }
			];
		}

		const sortOption = {};
		sortOption[sort_by] = sort_order === 'desc' ? -1 : 1;

		const journals = await Journal.find(filter)
			.populate('user_id', 'name email')
			.populate({
				path: 'places',
				select: 'name description location date_visited photos rating',
				options: { sort: { date_visited: 1 } }
			})
			.skip((page - 1) * limit)
			.limit(Number(limit))
			.sort(sortOption)
			.exec();

		const total = await Journal.countDocuments(filter);

		// Calculer les statistiques pour chaque journal
		const journalsWithStats = journals.map((journal) => {
			const journalObj = journal.toObject();
			journalObj.stats = {
				total_places: journal.places.length,
				total_photos: journal.places.reduce((acc, place) => acc + (place.photos?.length || 0), 0),
				total_days: Math.ceil((new Date(journal.end_date) - new Date(journal.start_date)) / (1000 * 60 * 60 * 24)) + 1
			};
			return journalObj;
		});

		res.json({
			data: journalsWithStats,
			meta: { total, page: Number(page), limit: Number(limit) },
			filters: { search, status, tags, sort_by, sort_order }
		});
	} catch (err) {
		next(err);
	}
}

// GET /api/journals/:id
export async function getJournalById(req, res, next) {
	try {
		const journal = await Journal.findOne({
			_id: req.params.id,
			user_id: req.user.id
		})
			.populate('user_id', 'name email')
			.populate('places');

		if (!journal) return res.status(404).json({ message: 'Journal not found or not authorized' });
		res.json(journal);
	} catch (err) {
		next(err);
	}
}

// PUT /api/journals/:id
export async function updateJournal(req, res, next) {
	try {
		const journal = await Journal.findOneAndUpdate({ _id: req.params.id, user_id: req.user.id }, req.body, {
			new: true,
			runValidators: true
		})
			.populate('user_id', 'name email')
			.populate('places');

		if (!journal) return res.status(404).json({ message: 'Journal not found or not authorized' });
		res.json(journal);
	} catch (err) {
		next(err);
	}
}

// DELETE /api/journals/:id
export async function deleteJournal(req, res, next) {
	try {
		// Vérifier que le journal appartient à l'utilisateur
		const journal = await Journal.findOne({ _id: req.params.id, user_id: req.user.id });
		if (!journal) return res.status(404).json({ message: 'Journal not found or not authorized' });

		// Supprimer aussi tous les lieux associés
		await Place.deleteMany({ journal_id: req.params.id });

		const result = await Journal.deleteOne({ _id: req.params.id, user_id: req.user.id });
		if (result.deletedCount === 0) return res.status(404).json({ message: 'Journal not found' });
		res.status(204).end();
	} catch (err) {
		next(err);
	}
}

// PATCH /api/journals/:id/toggle-public
export async function togglePublic(req, res, next) {
	try {
		const { is_public, visibility } = req.body;

		const journal = await Journal.findOneAndUpdate(
			{ _id: req.params.id, user_id: req.user.id },
			{
				is_public: is_public
				// Le slug sera généré automatiquement par le middleware pre-save si is_public devient true
			},
			{
				new: true,
				runValidators: true
			}
		)
			.populate('user_id', 'name email')
			.populate('places');

		if (!journal) return res.status(404).json({ message: 'Journal not found or not authorized' });

		res.json({
			message: `Journal ${is_public ? 'publié' : 'rendu privé'} avec succès`,
			journal: journal,
			public_url: journal.is_public && journal.slug ? `/public/journals/${journal.slug}` : null
		});
	} catch (err) {
		next(err);
	}
}

// POST /api/journals/:id/cover-image - Upload d'image de couverture vers Cloudinary
export const uploadCoverImage = async (req, res, next) => {
	try {
		const { id } = req.params;

		if (!req.file) {
			return res.status(400).json({ message: 'Aucune image de couverture uploadée' });
		}

		// Vérifier que le journal appartient à l'utilisateur
		const journal = await Journal.findOne({
			_id: id,
			user_id: req.user.id
		});

		if (!journal) {
			return res.status(404).json({ message: 'Journal not found or not authorized' });
		}

		try {
			// Supprimer l'ancienne image de couverture de Cloudinary si elle existe
			if (journal.cover_image_public_id) {
				try {
					await deleteImage(journal.cover_image_public_id);
					logger.info('Previous cover image deleted from Cloudinary', {
						journalId: id,
						old_public_id: journal.cover_image_public_id
					});
				} catch (deleteError) {
					logger.warn('Error deleting previous cover image from Cloudinary', {
						journalId: id,
						old_public_id: journal.cover_image_public_id,
						error: deleteError.message
					});
				}
			}

			// Upload vers Cloudinary
			const cloudinaryResult = await uploadImage(
				req.file.path,
				`memo-trip/journals/${id}`,
				`cover_${id}_${Date.now()}`
			);

			// Générer les variantes d'images
			const variants = generateImageVariants(cloudinaryResult.public_id);

			// Mettre à jour le journal avec la nouvelle image
			const updatedJournal = await Journal.findByIdAndUpdate(
				id,
				{
					cover_image: cloudinaryResult.url,
					cover_image_public_id: cloudinaryResult.public_id,
					cover_image_variants: variants
				},
				{ new: true }
			).populate('user_id', 'name email');

			// Supprimer le fichier temporaire local
			fs.unlink(req.file.path, (unlinkErr) => {
				if (unlinkErr) {
					logger.warn('Error deleting temporary cover image file', {
						path: req.file.path,
						error: unlinkErr.message
					});
				}
			});

			logger.info('Cover image uploaded to Cloudinary', {
				journalId: id,
				public_id: cloudinaryResult.public_id,
				url: cloudinaryResult.url
			});

			res.status(200).json({
				message: 'Image de couverture mise à jour avec succès',
				journal: {
					id: updatedJournal._id,
					title: updatedJournal.title,
					cover_image: updatedJournal.cover_image,
					cover_image_variants: updatedJournal.cover_image_variants
				},
				cloudinary: {
					public_id: cloudinaryResult.public_id,
					url: cloudinaryResult.url,
					width: cloudinaryResult.width,
					height: cloudinaryResult.height,
					format: cloudinaryResult.format,
					variants
				}
			});
		} catch (cloudinaryError) {
			// Supprimer le fichier temporaire en cas d'erreur
			if (req.file) {
				fs.unlink(req.file.path, (unlinkErr) => {
					if (unlinkErr) {
						logger.warn('Error deleting temporary file during cleanup', {
							path: req.file.path,
							error: unlinkErr.message
						});
					}
				});
			}
			throw cloudinaryError;
		}
	} catch (err) {
		next(err);
	}
};

// DELETE /api/journals/:id/cover-image - Supprimer l'image de couverture
export const removeCoverImage = async (req, res, next) => {
	try {
		const { id } = req.params;

		// Vérifier que le journal appartient à l'utilisateur
		const journal = await Journal.findOne({
			_id: id,
			user_id: req.user.id
		});

		if (!journal) {
			return res.status(404).json({ message: 'Journal not found or not authorized' });
		}

		if (!journal.cover_image_public_id && !journal.cover_image) {
			return res.status(404).json({ message: 'Aucune image de couverture à supprimer' });
		}

		try {
			// Supprimer l'image de Cloudinary si elle existe
			if (journal.cover_image_public_id) {
				await deleteImage(journal.cover_image_public_id);
				logger.info('Cover image deleted from Cloudinary', {
					journalId: id,
					public_id: journal.cover_image_public_id
				});
			}

			// Mettre à jour le journal pour supprimer les références à l'image
			await Journal.findByIdAndUpdate(id, {
				$unset: {
					cover_image: 1,
					cover_image_public_id: 1,
					cover_image_variants: 1
				}
			});

			logger.info('Cover image removed from journal', {
				journalId: id
			});

			res.json({
				message: 'Image de couverture supprimée avec succès'
			});
		} catch (cloudinaryError) {
			logger.error('Error deleting cover image from Cloudinary', {
				public_id: journal.cover_image_public_id,
				error: cloudinaryError.message,
				journalId: id
			});

			// Continuer avec la suppression de la base de données même si Cloudinary échoue
			await Journal.findByIdAndUpdate(id, {
				$unset: {
					cover_image: 1,
					cover_image_public_id: 1,
					cover_image_variants: 1
				}
			});

			res.status(207).json({
				message: 'Image supprimée de la base de données, mais erreur avec Cloudinary',
				warning: cloudinaryError.message
			});
		}
	} catch (err) {
		next(err);
	}
};
