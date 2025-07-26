import express from 'express';
import * as authCtrl from '../controllers/auth.controller.js';
import { validateLogin, validateRegister } from '../validation/middleware.js';
import { strictLimiter } from '../config/security.config.js';

const router = express.Router();

// Routes d'authentification
router.post('/register', strictLimiter, validateRegister, authCtrl.register);
router.post('/login', strictLimiter, validateLogin, authCtrl.login);
router.post('/logout', authCtrl.logout);
router.get('/me', authCtrl.getCurrentUser);

export default router;
