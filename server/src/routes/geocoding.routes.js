import express from 'express';
import * as geocodingCtrl from '../controllers/geocoding.controller.js';

const router = express.Router();

// GET /api/geocoding/search?q=Paris&limit=5&country=fr
router.get('/search', geocodingCtrl.searchPlaces);

// GET /api/geocoding/reverse?lat=48.8566&lon=2.3522
router.get('/reverse', geocodingCtrl.reverseGeocode);

export default router;
