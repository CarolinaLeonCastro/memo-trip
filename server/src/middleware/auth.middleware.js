import jwt from 'jsonwebtoken';
import env from '../config/dotenv.config.js';
import User from '../models/User.js';
import logger from '../config/logger.config.js';

// Middleware pour vérifier l'authentification JWT
export const authenticateToken = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Token d'authentification requis"
			});
		}

		// Vérifier et décoder le token
		const decoded = jwt.verify(token, env.JWT_SECRET);

		// Récupérer l'utilisateur depuis la base de données
		const user = await User.findById(decoded.userId).select('-password');

		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Token invalide - utilisateur non trouvé'
			});
		}

		// Ajouter l'utilisateur à la requête
		req.user = user;
		next();
	} catch (error) {
		logger.warn('Authentication failed', {
			error: error.message,
			ip: req.ip,
			userAgent: req.get('User-Agent')
		});

		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({
				success: false,
				message: 'Token expiré'
			});
		}

		if (error.name === 'JsonWebTokenError') {
			return res.status(401).json({
				success: false,
				message: 'Token invalide'
			});
		}

		return res.status(403).json({
			success: false,
			message: "Erreur d'authentification"
		});
	}
};

// Middleware pour vérifier les rôles (optionnel pour plus tard)
export const requireRoles = (...roles) => {
	return (req, res, next) => {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				message: 'Authentification requise'
			});
		}

		// Si aucun rôle spécifié, juste vérifier que l'utilisateur est authentifié
		if (roles.length === 0) {
			return next();
		}

		// Si l'utilisateur a un champ role, vérifier les permissions
		if (req.user.role && !roles.includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				message: 'Permissions insuffisantes'
			});
		}

		next();
	};
};

// Middleware optionnel pour les routes qui peuvent être publiques ou authentifiées
export const optionalAuth = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader && authHeader.split(' ')[1];

		if (token) {
			const decoded = jwt.verify(token, env.JWT_SECRET);
			const user = await User.findById(decoded.userId).select('-password');
			if (user) {
				req.user = user;
			}
		}

		next();
	} catch {
		// En cas d'erreur, on continue sans utilisateur authentifié
		next();
	}
};
