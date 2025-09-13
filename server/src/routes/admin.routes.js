import express from 'express';
import { authenticateToken, requireRoles } from '../middleware/auth.middleware.js';
import {
	getAdminStats,
	getAllUsers,
	exportUsers,
	updateUserRole,
	updateUserStatus,
	getPendingContent,
	moderatePlace,
	getSystemSettings,
	updateSystemSettings
} from '../controllers/admin.controller.js';

const router = express.Router();

// Middleware d'authentification et vérification du rôle admin pour toutes les routes
router.use(authenticateToken);
router.use(requireRoles('admin'));

// Routes statistiques
router.get('/stats', getAdminStats);

// Routes gestion des utilisateurs
router.get('/users', getAllUsers);
router.get('/users/export', exportUsers);
router.patch('/users/:userId/role', updateUserRole);
router.patch('/users/:userId/status', updateUserStatus);

// Routes modération du contenu
router.get('/moderation/pending', getPendingContent);
router.patch('/moderation/places/:placeId', moderatePlace);

// Routes paramètres système
router.get('/settings', getSystemSettings);
router.patch('/settings', updateSystemSettings);

export default router;
