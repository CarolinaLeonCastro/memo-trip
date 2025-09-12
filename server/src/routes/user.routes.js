import express from 'express';
import * as userCtrl from '../controllers/user.controller.js';
import { uploadImages, handleUploadError } from '../config/multer.config.js';
import { uploadLimiter } from '../config/security.config.js';
import {
	validateUserCreate,
	validateUserUpdate,
	validateUserParams,
	validateUserSettings
} from '../validation/middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Routes spécifiques AVANT les routes paramétrées
// Routes pour les paramètres utilisateur
router.get('/settings', authenticateToken, userCtrl.getUserSettings);
router.put('/settings', authenticateToken, validateUserSettings, userCtrl.updateUserSettings);

// Route pour l'activité récente de l'utilisateur
router.get('/activity', authenticateToken, userCtrl.getUserActivity);

// CRUD pour les utilisateurs (routes protégées)
router.post('/', authenticateToken, validateUserCreate, userCtrl.createUser);
router.get('/', authenticateToken, userCtrl.getUsers);
router.get('/:id', authenticateToken, validateUserParams, userCtrl.getUserById);
router.put('/:id', authenticateToken, validateUserParams, validateUserUpdate, userCtrl.updateUser);
router.delete('/:id', authenticateToken, validateUserParams, userCtrl.deleteUser);

// Gestion de l'avatar (routes protégées)
router.put(
	'/:id/avatar',
	authenticateToken,
	validateUserParams,
	uploadLimiter,
	uploadImages.single('avatar'),
	handleUploadError,
	userCtrl.updateUserAvatar
);
router.delete('/:id/avatar', authenticateToken, validateUserParams, userCtrl.removeUserAvatar);

export default router;
