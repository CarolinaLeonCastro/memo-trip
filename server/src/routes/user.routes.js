import express from 'express';
import * as userCtrl from '../controllers/user.controller.js';
import { uploadImages, handleUploadError } from '../config/multer.config.js';
import { uploadLimiter } from '../config/security.config.js';
import { validateUserCreate, validateUserUpdate, validateUserParams } from '../validation/middleware.js';

const router = express.Router();

// CRUD pour les utilisateurs
router.post('/', validateUserCreate, userCtrl.createUser);
router.get('/', userCtrl.getUsers);
router.get('/:id', validateUserParams, userCtrl.getUserById);
router.put('/:id', validateUserParams, validateUserUpdate, userCtrl.updateUser);
router.delete('/:id', validateUserParams, userCtrl.deleteUser);

// Gestion de l'avatar
router.put(
	'/:id/avatar',
	validateUserParams,
	uploadLimiter,
	uploadImages.single('avatar'),
	handleUploadError,
	userCtrl.updateUserAvatar
);
router.delete('/:id/avatar', validateUserParams, userCtrl.removeUserAvatar);

export default router;
