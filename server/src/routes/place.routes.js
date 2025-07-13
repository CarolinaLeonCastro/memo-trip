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

const router = express.Router();

// CRUD pour les lieux
router.post('/', validatePlaceCreate, placeCtrl.createPlace);
router.get('/', placeCtrl.getPlaces);

// Routes spécifiques AVANT les routes avec :id
router.get('/nearby', validateNearbyQuery, placeCtrl.getNearbyPlaces);

// Gestion des photos avec upload (AVANT /:id)
router.post(
	'/:id/photos',
	validatePlaceParams,
	validatePlacePhotos,
	uploadLimiter,
	uploadImages.array('photos', 5),
	handleUploadError,
	placeCtrl.addPhotoToPlace
);
router.get('/:id/photos', validatePlaceParams, placeCtrl.getPlacePhotos);
router.delete('/:id/photos/:photoId', validatePlaceParams, placeCtrl.removePhotoFromPlace);

// Routes avec :id (À LA FIN pour éviter les conflits)
router.get('/:id', validatePlaceParams, placeCtrl.getPlaceById);
router.put('/:id', validatePlaceParams, validatePlaceUpdate, placeCtrl.updatePlace);
router.delete('/:id', validatePlaceParams, placeCtrl.deletePlace);

export default router;
