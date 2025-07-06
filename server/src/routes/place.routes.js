import express from 'express';
import * as placeCtrl from '../controllers/place.controller.js';

const router = express.Router();

// CRUD pour les places
router.post('/', placeCtrl.createPlace);
router.get('/', placeCtrl.getPlaces);
router.get('/nearby', placeCtrl.getNearbyPlaces);
router.get('/:id', placeCtrl.getPlaceById);
router.put('/:id', placeCtrl.updatePlace);
router.delete('/:id', placeCtrl.deletePlace);

export default router;
