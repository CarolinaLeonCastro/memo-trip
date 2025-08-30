import express from 'express';
import {
	createJournal,
	getJournals,
	getJournalById,
	updateJournal,
	deleteJournal,
	togglePublic
} from '../controllers/journal.controller.js';
import { validateJournalCreate, validateJournalUpdate, validateJournalParams } from '../validation/middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Toutes les routes de journaux nécessitent une authentification
router.post('/', authenticateToken, validateJournalCreate, createJournal);
router.get('/', authenticateToken, getJournals);
router.get('/:id', authenticateToken, validateJournalParams, getJournalById);
router.put('/:id', authenticateToken, validateJournalParams, validateJournalUpdate, updateJournal);
router.delete('/:id', authenticateToken, validateJournalParams, deleteJournal);
router.patch('/:id/toggle-public', authenticateToken, validateJournalParams, togglePublic);

export default router;
