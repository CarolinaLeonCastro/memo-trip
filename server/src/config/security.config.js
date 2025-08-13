import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import logger from './logger.config.js';
import env from './dotenv.config.js';

// Configuration CORS
const corsOptions = {
	origin: function (origin, callback) {
		// Liste des domaines autorisés
		const allowedOrigins = [
			'http://localhost:3000',
			'http://localhost:5173', // Vite dev server
			'https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--3000--96435430.local-credentialless.webcontainer-api.io',
			...(env.FRONTEND_URLS ? env.FRONTEND_URLS.split(',') : [])
		].filter(Boolean);

		// Autoriser les URLs WebContainer dynamiques (pattern plus flexible)
		const webContainerPatterns = [
			/^https:\/\/[a-z0-9]+-[a-z0-9]+-[a-z0-9]+--\d+--[a-z0-9]+\.local-credentialless\.webcontainer-api\.io$/,
			/^https:\/\/[a-z0-9]+--\d+--[a-z0-9]+\.local-credentialless\.webcontainer-api\.io$/,
			/^https:\/\/.*\.webcontainer-api\.io$/,
			/^https:\/\/.*\.local-credentialless\.webcontainer-api\.io$/
		];

		// Autoriser les requêtes sans origine (mobile apps, Postman)
		if (!origin) return callback(null, true);

		const isWebContainer = webContainerPatterns.some(pattern => pattern.test(origin));
		
		if (allowedOrigins.indexOf(origin) !== -1 || isWebContainer) {
			logger.info(`CORS: Origin ${origin} allowed`);
			callback(null, true);
		} else {
			logger.warn(`CORS: Origin ${origin} not allowed`);
			// En mode développement, autoriser toutes les origines WebContainer
			if (process.env.NODE_ENV === 'development' && origin && origin.includes('webcontainer-api.io')) {
				logger.info(`CORS: Development mode - allowing WebContainer origin ${origin}`);
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		}
	},
	credentials: true,
	optionsSuccessStatus: 200,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Cache-Control']
};

// Configuration Helmet pour la sécurité
const helmetOptions = {
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			styleSrc: ["'self'", "'unsafe-inline'"],
			scriptSrc: ["'self'"],
			imgSrc: ["'self'", 'data:', 'https:'],
			connectSrc: ["'self'"],
			fontSrc: ["'self'"],
			objectSrc: ["'none'"],
			mediaSrc: ["'self'"],
			frameSrc: ["'none'"]
		}
	},
	crossOriginEmbedderPolicy: false // Pour éviter les problèmes avec les uploads
};

// Configuration Rate Limiter général
const generalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // 100 requêtes par IP
	message: {
		error: 'Trop de requêtes depuis cette IP, réessayez dans 15 minutes.'
	},
	standardHeaders: true,
	legacyHeaders: false,
	handler: (req, res) => {
		logger.warn(`Rate limit exceeded for IP: ${req.ip}`, {
			ip: req.ip,
			userAgent: req.get('User-Agent'),
			url: req.originalUrl
		});
		res.status(429).json({
			error: 'Trop de requêtes depuis cette IP, réessayez dans 15 minutes.'
		});
	}
});

// Rate limiter strict pour les routes sensibles (auth, uploads)
const strictLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 20, // 20 requêtes par IP
	message: {
		error: 'Trop de tentatives, réessayez dans 15 minutes.'
	},
	standardHeaders: true,
	legacyHeaders: false,
	handler: (req, res) => {
		logger.warn(`Strict rate limit exceeded for IP: ${req.ip}`, {
			ip: req.ip,
			userAgent: req.get('User-Agent'),
			url: req.originalUrl
		});
		res.status(429).json({
			error: 'Trop de tentatives, réessayez dans 15 minutes.'
		});
	}
});

// Rate limiter pour les uploads
const uploadLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // 10 uploads par IP
	message: {
		error: "Trop d'uploads depuis cette IP, réessayez dans 15 minutes."
	},
	standardHeaders: true,
	legacyHeaders: false,
	handler: (req, res) => {
		logger.warn(`Upload rate limit exceeded for IP: ${req.ip}`, {
			ip: req.ip,
			userAgent: req.get('User-Agent'),
			url: req.originalUrl
		});
		res.status(429).json({
			error: "Trop d'uploads depuis cette IP, réessayez dans 15 minutes."
		});
	}
});

// Middleware de sécurité MongoDB
const mongoSanitizeConfig = mongoSanitize({
	onSanitize: ({ req, key }) => {
		logger.warn(`Sanitized request data`, {
			ip: req.ip,
			sanitizedKey: key,
			url: req.originalUrl
		});
	}
});

// Middleware protection contre la pollution des paramètres HTTP
const hppConfig = hpp({
	whitelist: [
		// Paramètres autorisés à avoir plusieurs valeurs
		'tags',
		'categories',
		'sort'
	]
});

export { corsOptions, helmetOptions, generalLimiter, strictLimiter, uploadLimiter, mongoSanitizeConfig, hppConfig };
