import express from 'express';
import * as authCtrl from '../controllers/auth.controller.js';
import { validateLogin, validateRegister } from '../validation/middleware.js';
import { strictLimiter } from '../config/security.config.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Route de test simple
router.get('/test', (req, res) => {
	res.json({ message: 'Auth routes working!' });
});

// Routes d'authentification
router.post('/register', strictLimiter, validateRegister, authCtrl.register);
router.post('/login', strictLimiter, validateLogin, authCtrl.login);
router.post('/logout', authCtrl.logout);
router.get('/me', authenticateToken, authCtrl.getCurrentUser);

export default router;
