import express from 'express';
import { createFirstAdmin, checkAdminExists } from '../controllers/setup.controller.js';
import { getRateLimitInfo, resetRateLimits } from '../utils/resetRateLimit.js';

const router = express.Router();

// Route pour vérifier s'il y a des administrateurs
router.get('/check-admin', checkAdminExists);

// Route pour créer le premier administrateur (accessible uniquement s'il n'y en a pas)
router.post('/create-admin', createFirstAdmin);

// Routes de debug pour les rate limits (développement uniquement)
router.get('/rate-limit-info', (req, res) => {
	const info = getRateLimitInfo();
	res.json(info);
});

router.post('/reset-rate-limits', (req, res) => {
	const success = resetRateLimits();
	if (success) {
		res.json({
			message: 'Rate limits reset requested (server restart needed for full effect)',
			environment: process.env.NODE_ENV
		});
	} else {
		res.status(403).json({
			error: 'Rate limit reset only available in development mode'
		});
	}
});

export default router;
