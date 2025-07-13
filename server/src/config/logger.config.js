import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Création du dossier logs s'il n'existe pas
const logsDir = path.join(__dirname, '../../logs');

// Configuration des formats
const logFormat = winston.format.combine(
	winston.format.timestamp({
		format: 'YYYY-MM-DD HH:mm:ss'
	}),
	winston.format.errors({ stack: true }),
	winston.format.json()
);

const consoleFormat = winston.format.combine(
	winston.format.colorize(),
	winston.format.timestamp({
		format: 'HH:mm:ss'
	}),
	winston.format.printf(({ timestamp, level, message, stack }) => {
		return `${timestamp} [${level}]: ${stack || message}`;
	})
);

// Configuration du logger
const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'info',
	format: logFormat,
	defaultMeta: { service: 'memo-trip-api' },
	transports: [
		// Logs d'erreurs
		new winston.transports.File({
			filename: path.join(logsDir, 'error.log'),
			level: 'error',
			maxsize: 5242880, // 5MB
			maxFiles: 5
		}),
		// Logs combinés
		new winston.transports.File({
			filename: path.join(logsDir, 'combined.log'),
			maxsize: 5242880, // 5MB
			maxFiles: 5
		}),
		// Logs d'accès HTTP
		new winston.transports.File({
			filename: path.join(logsDir, 'access.log'),
			level: 'http',
			maxsize: 5242880, // 5MB
			maxFiles: 5
		})
	]
});

// En développement, ajouter la console
if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new winston.transports.Console({
			format: consoleFormat
		})
	);
}

// Fonction helper pour logger les requêtes HTTP
export const logHTTP = (req, res, next) => {
	const start = Date.now();

	res.on('finish', () => {
		const duration = Date.now() - start;
		logger.http(`${req.method} ${req.originalUrl}`, {
			method: req.method,
			url: req.originalUrl,
			status: res.statusCode,
			contentLength: res.get('Content-Length'),
			userAgent: req.get('User-Agent'),
			ip: req.ip,
			duration: `${duration}ms`
		});
	});

	next();
};

export default logger;
