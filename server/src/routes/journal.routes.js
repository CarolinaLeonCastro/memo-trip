import express from 'express';
import {
	createJournal,
	getJournals,
	getJournalById,
	updateJournal,
	deleteJournal,
	exportJournalPDF
} from '../controllers/journal.controller.js';

const router = express.Router();

router.post('/', createJournal);
router.get('/', getJournals);
router.get('/:id', getJournalById);
router.put('/:id', updateJournal);
router.delete('/:id', deleteJournal);
router.get('/:id/export-pdf', exportJournalPDF);

export default router;
