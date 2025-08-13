import express from 'express';
import Journal from '../models/Journal.js';
import Place from '../models/Place.js';
import logger from '../config/logger.config.js';

const router = express.Router();

// Route pour récupérer les journaux publics (accessible aux visiteurs)
export const getPublicJournals = async (req, res) => {
	try {
		const { page = 1, limit = 10, search } = req.query;
		const skip = (page - 1) * limit;

		const filter = {
			is_public: true,
			status: 'published',
			moderation_status: 'approved'
		};

		if (search) {
			filter.$or = [
				{ title: { $regex: search, $options: 'i' } },
				{ description: { $regex: search, $options: 'i' } },
				{ tags: { $in: [new RegExp(search, 'i')] } }
			];
		}

		const journals = await Journal.find(filter)
			.populate('user_id', 'name avatar')
			.select('-moderation_status -moderated_by -rejection_reason')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit));

		const total = await Journal.countDocuments(filter);

		res.json({
			success: true,
			data: {
				journals,
				pagination: {
					page: parseInt(page),
					limit: parseInt(limit),
					total,
					pages: Math.ceil(total / limit)
				}
			}
		});
	} catch (error) {
		logger.error('Error fetching public journals:', error);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la récupération des journaux publics'
		});
	}
};

// Route pour récupérer un journal public par ID
export const getPublicJournalById = async (req, res) => {
	try {
		const { id } = req.params;

		const journal = await Journal.findOne({
			_id: id,
			is_public: true,
			status: 'published',
			moderation_status: 'approved'
		})
			.populate('user_id', 'name avatar')
			.populate({
				path: 'places',
				match: { moderation_status: 'approved' },
				select: '-moderation_status -moderated_by -rejection_reason'
			})
			.select('-moderation_status -moderated_by -rejection_reason');

		if (!journal) {
			return res.status(404).json({
				success: false,
				message: 'Journal public non trouvé'
			});
		}

		res.json({
			success: true,
			data: journal
		});
	} catch (error) {
		logger.error('Error fetching public journal:', error);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la récupération du journal'
		});
	}
};

// Route pour récupérer les statistiques publiques
export const getPublicStats = async (req, res) => {
	try {
		const totalPublicJournals = await Journal.countDocuments({
			is_public: true,
			status: 'published',
			moderation_status: 'approved'
		});

		const totalPublicPlaces = await Place.countDocuments({
			moderation_status: 'approved'
		});

		// Journaux les plus récents
		const recentJournals = await Journal.find({
			is_public: true,
			status: 'published',
			moderation_status: 'approved'
		})
			.populate('user_id', 'name avatar')
			.select('title description cover_image createdAt user_id stats')
			.sort({ createdAt: -1 })
			.limit(5);

		res.json({
			success: true,
			data: {
				stats: {
					totalJournals: totalPublicJournals,
					totalPlaces: totalPublicPlaces
				},
				recentJournals
			}
		});
	} catch (error) {
		logger.error('Error fetching public stats:', error);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la récupération des statistiques publiques'
		});
	}
};

// Configuration des routes publiques
router.get('/journals', getPublicJournals);
router.get('/journals/:id', getPublicJournalById);
router.get('/stats', getPublicStats);

export default router;
