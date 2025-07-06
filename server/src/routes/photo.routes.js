import express from 'express';
import * as photoCtrl from '../controllers/photo.controller.js';

const router = express.Router();

// CRUD pour les photos
router.post('/', photoCtrl.createPhoto);
router.get('/', photoCtrl.getPhotos);
router.get('/:id', photoCtrl.getPhotoById);
router.put('/:id', photoCtrl.updatePhoto);
router.delete('/:id', photoCtrl.deletePhoto);

export default router;
