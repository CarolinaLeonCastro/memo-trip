import express from 'express';
import * as dashboardCtrl from '../controllers/dashboard.controller.js';

const router = express.Router();

// Statistiques générales
router.get('/stats', dashboardCtrl.getDashboardStats);

// Statistiques des utilisateurs
router.get('/users/stats', dashboardCtrl.getUserStats);

// Statistiques des lieux
router.get('/places/stats', dashboardCtrl.getPlaceStats);

// Statistiques du contenu (notes + photos)
router.get('/content/stats', dashboardCtrl.getContentStats);

export default router;
