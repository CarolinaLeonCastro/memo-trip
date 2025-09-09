// Script utilitaire pour réinitialiser les rate limits en développement
import rateLimit from 'express-rate-limit';
import logger from '../config/logger.config.js';

/**
 * Fonction pour vider les stores de rate limiting
 * Utile pendant le développement pour débloquer rapidement
 */
export const resetRateLimits = () => {
	if (process.env.NODE_ENV !== 'development') {
		logger.warn('Rate limit reset attempted in non-development environment');
		return false;
	}

	// Note: Cette fonction est plus un placeholder
	// Les stores de express-rate-limit se réinitialisent automatiquement
	// après le redémarrage du serveur

	logger.info('Rate limits reset requested (development mode)');
	return true;
};

/**
 * Endpoint de debug pour vérifier les limites actuelles
 */
export const getRateLimitInfo = () => {
	return {
		environment: process.env.NODE_ENV,
		limits: {
			general: process.env.NODE_ENV === 'development' ? '500/15min' : '100/15min',
			strict: process.env.NODE_ENV === 'development' ? '100/15min' : '20/15min',
			upload: process.env.NODE_ENV === 'development' ? '200/15min' : '10/15min'
		},
		message:
			process.env.NODE_ENV === 'development'
				? 'Limites permissives pour le développement'
				: 'Limites restrictives pour la production'
	};
};
