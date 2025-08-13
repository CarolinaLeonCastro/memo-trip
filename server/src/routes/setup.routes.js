import express from 'express';
import { createFirstAdmin, checkAdminExists } from '../controllers/setup.controller.js';

const router = express.Router();

// Route pour vérifier s'il y a des administrateurs
router.get('/check-admin', checkAdminExists);

// Route pour créer le premier administrateur (accessible uniquement s'il n'y en a pas)
router.post('/create-admin', createFirstAdmin);

export default router;
