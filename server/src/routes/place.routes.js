import express from 'express';
import * as placeCtrl from '../controllers/place.controller.js';

const router = express.Router();

// CRUD pour les lieux
router.post('/', placeCtrl.createPlace);
router.get('/', placeCtrl.getPlaces);
router.get('/nearby', placeCtrl.getNearbyPlaces);
router.get('/:id', placeCtrl.getPlaceById);
router.put('/:id', placeCtrl.updatePlace);
router.delete('/:id', placeCtrl.deletePlace);

// Gestion des photos
router.post('/:id/photos', placeCtrl.addPhotoToPlace);
router.get('/:id/photos', placeCtrl.getPlacePhotos);
router.delete('/:id/photos/:photoId', placeCtrl.removePhotoFromPlace);

export default router;
