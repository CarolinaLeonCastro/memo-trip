import express from 'express';
import { getRecentPlaces, getDashboardStats, getMapPlaces } from '../controllers/dashboard.controller.js';

const router = express.Router();

// Routes spécifiques pour le dashboard du front-end
router.get('/recent-places', getRecentPlaces);
router.get('/stats', getDashboardStats);
router.get('/map-places', getMapPlaces);

export default router;
