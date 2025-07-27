import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import database from './database.config.js';
import logger, { logHTTP } from './logger.config.js';
import { corsOptions, helmetOptions, generalLimiter } from './security.config.js';

const app = express();

// Middleware de sécurité
app.use(helmet(helmetOptions));
app.use(cors(corsOptions));

// Protection contre les injections NoSQL et la pollution des paramètres
// app.use(mongoSanitizeConfig);
// app.use(hppConfig);

// Rate limiting global
app.use(generalLimiter);

// Middleware de logging
app.use(logHTTP);

// Middleware pour le parsing des requêtes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques (uploads)
app.use('/uploads', express.static('uploads'));

// Trust proxy pour obtenir la vraie IP derrière un reverse proxy
app.set('trust proxy', 1);

database
	.then(() => {
		logger.info('Connected to database');
	})
	.catch((err) => {
		logger.error('Error connecting to database', { error: err.message, stack: err.stack });
	});

export default app;
