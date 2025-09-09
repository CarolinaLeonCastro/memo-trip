import express from 'express';
import * as placeCtrl from '../controllers/place.controller.js';
import { uploadImages, handleUploadError } from '../config/multer.config.js';
import { uploadLimiter } from '../config/security.config.js';
import {
	validatePlaceCreate,
	validatePlaceUpdate,
	validatePlaceParams,
	validatePlacePhotos,
	validateNearbyQuery
} from '../validation/middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// CRUD pour les lieux (routes protégées)
router.post('/', authenticateToken, validatePlaceCreate, placeCtrl.createPlace);
router.get('/', authenticateToken, placeCtrl.getPlaces);

// Routes spécifiques AVANT les routes avec :id
router.get('/nearby', authenticateToken, validateNearbyQuery, placeCtrl.getNearbyPlaces);

// Gestion des photos avec upload (AVANT /:id)
router.post(
	'/:id/photos',
	authenticateToken,
	validatePlaceParams,
	uploadLimiter,
	uploadImages.array('photos', 5),
	handleUploadError,
	validatePlacePhotos, // ✅ Validation APRÈS Multer
	placeCtrl.addPhotoToPlace
);
router.get('/:id/photos', authenticateToken, validatePlaceParams, placeCtrl.getPlacePhotos);
router.delete('/:id/photos/:photoId', authenticateToken, validatePlaceParams, placeCtrl.removePhotoFromPlace);

// Routes avec :id (À LA FIN pour éviter les conflits)
router.get('/:id', authenticateToken, validatePlaceParams, placeCtrl.getPlaceById);
router.put('/:id', authenticateToken, validatePlaceParams, validatePlaceUpdate, placeCtrl.updatePlace);
router.delete('/:id', authenticateToken, validatePlaceParams, placeCtrl.deletePlace);

export default router;
