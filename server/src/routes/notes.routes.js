// routes/note.routes.js
import express from 'express';
import * as noteCtrl from '../controllers/note.controller.js';

const router = express.Router();

// CRUD pour les notes
router.post('/', noteCtrl.createNote);
router.get('/', noteCtrl.getNotes);
router.get('/:id', noteCtrl.getNoteById);
router.put('/:id', noteCtrl.updateNote);
router.delete('/:id', noteCtrl.deleteNote);

export default router;
