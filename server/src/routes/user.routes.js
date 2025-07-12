import express from 'express';
import * as userCtrl from '../controllers/user.controller.js';

const router = express.Router();

// CRUD pour les utilisateurs
router.post('/', userCtrl.createUser);
router.get('/', userCtrl.getUsers);
router.get('/:id', userCtrl.getUserById);
router.put('/:id', userCtrl.updateUser);
router.delete('/:id', userCtrl.deleteUser);

export default router;
