import jwt from 'jsonwebtoken';
import env from '../config/dotenv.config.js';
import User from '../models/User.js';
import logger from '../config/logger.config.js';

// Middleware pour vérifier l'authentification JWT (via cookies HTTPOnly)
export const authenticateToken = async (req, res, next) => {
	try {
		// Priorité 1: Cookie HTTPOnly sécurisé (recommandé)
		let token = req.cookies['auth-token'];

		// Priorité 2: Header Authorization (fallback pour API tools comme Postman)
		if (!token) {
			const authHeader = req.headers.authorization;
			token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
		}

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Token d'authentification requis (cookie ou header)"
			});
		}

		// Vérifier et décoder le token
		const decoded = jwt.verify(token, env.JWT_SECRET);

		// Vérification de sécurité: s'assurer que l'utilisateur existe toujours
		// (optionnel - pour des cas comme suppression de compte, changement de statut)
		const userExists = await User.findById(decoded.userId, 'status');

		if (!userExists || userExists.status !== 'active') {
			return res.status(401).json({
				success: false,
				message: 'Token invalide - utilisateur non trouvé ou inactif'
			});
		}

		// Utiliser les données du payload JWT (plus rapide)
		req.user = {
			_id: decoded.userId,
			id: decoded.userId,
			email: decoded.email,
			name: decoded.name,
			role: decoded.role,
			status: decoded.status
		};

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
		// Priorité 1: Cookie HTTPOnly
		let token = req.cookies['auth-token'];

		// Priorité 2: Header Authorization (fallback)
		if (!token) {
			const authHeader = req.headers.authorization;
			token = authHeader && authHeader.split(' ')[1];
		}

		if (token) {
			const decoded = jwt.verify(token, env.JWT_SECRET);
			const userExists = await User.findById(decoded.userId, 'status');

			if (userExists && userExists.status === 'active') {
				// Utiliser les données du payload JWT
				req.user = {
					_id: decoded.userId,
					id: decoded.userId,
					email: decoded.email,
					name: decoded.name,
					role: decoded.role,
					status: decoded.status
				};
			}
		}

		next();
	} catch {
		// En cas d'erreur, on continue sans utilisateur authentifié
		next();
	}
};
