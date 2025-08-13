import User from '../models/User.js';
import Journal from '../models/Journal.js';
import Place from '../models/Place.js';
import logger from '../config/logger.config.js';

// Statistiques de l'administration
export const getAdminStats = async (req, res) => {
	try {
		const totalUsers = await User.countDocuments();
		const activeUsers = await User.countDocuments({ status: 'active' });
		const blockedUsers = await User.countDocuments({ status: 'blocked' });
		const pendingUsers = await User.countDocuments({ status: 'pending' });

		const totalJournals = await Journal.countDocuments();
		const publishedJournals = await Journal.countDocuments({ status: 'published' });
		const pendingJournals = await Journal.countDocuments({ moderation_status: 'pending' });
		const publicJournals = await Journal.countDocuments({ is_public: true });

		const totalPlaces = await Place.countDocuments();
		const pendingPlaces = await Place.countDocuments({ moderation_status: 'pending' });

		// Statistiques par mois (derniers 6 mois)
		const sixMonthsAgo = new Date();
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

		const newUsersThisMonth = await User.countDocuments({
			created_at: { $gte: new Date(new Date().setDate(1)) }
		});

		const newJournalsThisMonth = await Journal.countDocuments({
			createdAt: { $gte: new Date(new Date().setDate(1)) }
		});

		res.json({
			success: true,
			data: {
				users: {
					total: totalUsers,
					active: activeUsers,
					blocked: blockedUsers,
					pending: pendingUsers,
					newThisMonth: newUsersThisMonth
				},
				journals: {
					total: totalJournals,
					published: publishedJournals,
					pending: pendingJournals,
					public: publicJournals,
					newThisMonth: newJournalsThisMonth
				},
				places: {
					total: totalPlaces,
					pending: pendingPlaces
				}
			}
		});
	} catch (error) {
		logger.error('Error fetching admin stats:', error);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la récupération des statistiques'
		});
	}
};

// Gestion des utilisateurs
export const getAllUsers = async (req, res) => {
	try {
		const { page = 1, limit = 10, status, role, search } = req.query;
		const skip = (page - 1) * limit;

		const filter = {};
		if (status) filter.status = status;
		if (role) filter.role = role;
		if (search) {
			filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
		}

		const users = await User.find(filter)
			.select('-password')
			.sort({ created_at: -1 })
			.skip(skip)
			.limit(parseInt(limit));

		const total = await User.countDocuments(filter);

		res.json({
			success: true,
			data: {
				users,
				pagination: {
					page: parseInt(page),
					limit: parseInt(limit),
					total,
					pages: Math.ceil(total / limit)
				}
			}
		});
	} catch (error) {
		logger.error('Error fetching users:', error);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la récupération des utilisateurs'
		});
	}
};

export const updateUserRole = async (req, res) => {
	try {
		const { userId } = req.params;
		const { role } = req.body;

		if (!['user', 'admin'].includes(role)) {
			return res.status(400).json({
				success: false,
				message: 'Rôle invalide'
			});
		}

		const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'Utilisateur non trouvé'
			});
		}

		logger.info(`User role updated: ${user.email} -> ${role}`, {
			adminId: req.user._id,
			userId: user._id
		});

		res.json({
			success: true,
			data: user,
			message: 'Rôle utilisateur mis à jour avec succès'
		});
	} catch (error) {
		logger.error('Error updating user role:', error);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la mise à jour du rôle'
		});
	}
};

export const updateUserStatus = async (req, res) => {
	try {
		const { userId } = req.params;
		const { status } = req.body;

		if (!['active', 'blocked', 'pending'].includes(status)) {
			return res.status(400).json({
				success: false,
				message: 'Statut invalide'
			});
		}

		const user = await User.findByIdAndUpdate(userId, { status }, { new: true }).select('-password');

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'Utilisateur non trouvé'
			});
		}

		logger.info(`User status updated: ${user.email} -> ${status}`, {
			adminId: req.user._id,
			userId: user._id
		});

		res.json({
			success: true,
			data: user,
			message: 'Statut utilisateur mis à jour avec succès'
		});
	} catch (error) {
		logger.error('Error updating user status:', error);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la mise à jour du statut'
		});
	}
};

// Modération du contenu
export const getPendingContent = async (req, res) => {
	try {
		const { type = 'all' } = req.query;

		let pendingJournals = [];
		let pendingPlaces = [];

		if (type === 'all' || type === 'journals') {
			pendingJournals = await Journal.find({ moderation_status: 'pending' })
				.populate('user_id', 'name email')
				.sort({ createdAt: -1 })
				.limit(20);
		}

		if (type === 'all' || type === 'places') {
			pendingPlaces = await Place.find({ moderation_status: 'pending' })
				.populate('user_id', 'name email')
				.populate('journal_id', 'title')
				.sort({ createdAt: -1 })
				.limit(20);
		}

		res.json({
			success: true,
			data: {
				journals: pendingJournals,
				places: pendingPlaces
			}
		});
	} catch (error) {
		logger.error('Error fetching pending content:', error);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la récupération du contenu en attente'
		});
	}
};

export const moderateJournal = async (req, res) => {
	try {
		const { journalId } = req.params;
		const { action, reason } = req.body; // action: 'approve' ou 'reject'

		if (!['approve', 'reject'].includes(action)) {
			return res.status(400).json({
				success: false,
				message: 'Action invalide'
			});
		}

		const updateData = {
			moderation_status: action === 'approve' ? 'approved' : 'rejected',
			moderated_by: req.user._id,
			moderated_at: new Date()
		};

		if (action === 'reject' && reason) {
			updateData.rejection_reason = reason;
		}

		const journal = await Journal.findByIdAndUpdate(journalId, updateData, { new: true }).populate(
			'user_id',
			'name email'
		);

		if (!journal) {
			return res.status(404).json({
				success: false,
				message: 'Journal non trouvé'
			});
		}

		logger.info(`Journal moderated: ${journal.title} -> ${action}`, {
			adminId: req.user._id,
			journalId: journal._id,
			reason
		});

		res.json({
			success: true,
			data: journal,
			message: `Journal ${action === 'approve' ? 'approuvé' : 'rejeté'} avec succès`
		});
	} catch (error) {
		logger.error('Error moderating journal:', error);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la modération du journal'
		});
	}
};

export const moderatePlace = async (req, res) => {
	try {
		const { placeId } = req.params;
		const { action, reason } = req.body;

		if (!['approve', 'reject'].includes(action)) {
			return res.status(400).json({
				success: false,
				message: 'Action invalide'
			});
		}

		const updateData = {
			moderation_status: action === 'approve' ? 'approved' : 'rejected',
			moderated_by: req.user._id,
			moderated_at: new Date()
		};

		if (action === 'reject' && reason) {
			updateData.rejection_reason = reason;
		}

		const place = await Place.findByIdAndUpdate(placeId, updateData, { new: true }).populate('user_id', 'name email');

		if (!place) {
			return res.status(404).json({
				success: false,
				message: 'Lieu non trouvé'
			});
		}

		logger.info(`Place moderated: ${place.name} -> ${action}`, {
			adminId: req.user._id,
			placeId: place._id,
			reason
		});

		res.json({
			success: true,
			data: place,
			message: `Lieu ${action === 'approve' ? 'approuvé' : 'rejeté'} avec succès`
		});
	} catch (error) {
		logger.error('Error moderating place:', error);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la modération du lieu'
		});
	}
};

// Paramètres système
export const getSystemSettings = async (req, res) => {
	try {
		// Pour l'instant, on retourne des paramètres par défaut
		// Plus tard, on pourrait créer un modèle Settings
		const settings = {
			app: {
				name: 'MemoTrip',
				version: '1.0.0',
				description: 'Your travel memories'
			},
			moderation: {
				autoApprove: false,
				requireApprovalForPublic: true
			},
			limits: {
				maxPlacesPerJournal: 50,
				maxPhotosPerPlace: 5,
				maxFileSize: 5 * 1024 * 1024 // 5MB
			},
			features: {
				publicJournals: true,
				userRegistration: true,
				guestAccess: true
			}
		};

		res.json({
			success: true,
			data: settings
		});
	} catch (error) {
		logger.error('Error fetching system settings:', error);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la récupération des paramètres'
		});
	}
};

export const updateSystemSettings = async (req, res) => {
	try {
		const { settings } = req.body;

		// Pour l'instant, on simule la mise à jour
		// Plus tard, on sauvegarderait dans un modèle Settings
		logger.info('System settings updated', {
			adminId: req.user._id,
			settings
		});

		res.json({
			success: true,
			data: settings,
			message: 'Paramètres système mis à jour avec succès'
		});
	} catch (error) {
		logger.error('Error updating system settings:', error);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la mise à jour des paramètres'
		});
	}
};
