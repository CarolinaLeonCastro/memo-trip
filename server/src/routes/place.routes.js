import express from 'express';
import * as placeCtrl from '../controllers/place.controller.js';
import { uploadImages, handleUploadError } from '../config/multer.config.js';
import { uploadLimiter } from '../config/security.config.js';

const router = express.Router();

// CRUD pour les lieux
router.post('/', placeCtrl.createPlace);
router.get('/', placeCtrl.getPlaces);

// Routes spécifiques AVANT les routes avec :id
router.get('/nearby', placeCtrl.getNearbyPlaces);

// Gestion des photos avec upload (AVANT /:id)
router.post(
	'/:id/photos',
	uploadLimiter,
	uploadImages.array('photos', 5),
	handleUploadError,
	placeCtrl.addPhotoToPlace
);
router.get('/:id/photos', placeCtrl.getPlacePhotos);
router.delete('/:id/photos/:photoId', placeCtrl.removePhotoFromPlace);

// Routes avec :id (À LA FIN pour éviter les conflits)
router.get('/:id', placeCtrl.getPlaceById);
router.put('/:id', placeCtrl.updatePlace);
router.delete('/:id', placeCtrl.deletePlace);

export default router;
