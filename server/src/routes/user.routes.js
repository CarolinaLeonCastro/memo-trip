import express from 'express';
import * as userCtrl from '../controllers/user.controller.js';
import { uploadImages, handleUploadError } from '../config/multer.config.js';
import { uploadLimiter } from '../config/security.config.js';

const router = express.Router();

// CRUD pour les utilisateurs
router.post('/', userCtrl.createUser);
router.get('/', userCtrl.getUsers);
router.get('/:id', userCtrl.getUserById);
router.put('/:id', userCtrl.updateUser);
router.delete('/:id', userCtrl.deleteUser);

// Gestion de l'avatar
router.put('/:id/avatar', uploadLimiter, uploadImages.single('avatar'), handleUploadError, userCtrl.updateUserAvatar);
router.delete('/:id/avatar', userCtrl.removeUserAvatar);

export default router;
