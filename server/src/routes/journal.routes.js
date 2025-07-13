import express from 'express';
import {
	createJournal,
	getJournals,
	getJournalById,
	updateJournal,
	deleteJournal,
	exportJournalPDF
} from '../controllers/journal.controller.js';
import { validateJournalCreate, validateJournalUpdate, validateJournalParams } from '../validation/middleware.js';

const router = express.Router();

router.post('/', validateJournalCreate, createJournal);
router.get('/', getJournals);
router.get('/:id', validateJournalParams, getJournalById);
router.put('/:id', validateJournalParams, validateJournalUpdate, updateJournal);
router.delete('/:id', validateJournalParams, deleteJournal);
router.get('/:id/export-pdf', validateJournalParams, exportJournalPDF);

export default router;
