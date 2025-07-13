import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration du stockage
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const uploadPath = path.join(__dirname, '../../uploads');
		cb(null, uploadPath);
	},
	filename: function (req, file, cb) {
		// Générer un nom unique avec timestamp
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		const extension = path.extname(file.originalname);
		const basename = path.basename(file.originalname, extension);
		const sanitizedBasename = basename.replace(/[^a-zA-Z0-9]/g, '_');

		const filename = `${sanitizedBasename}-${uniqueSuffix}${extension}`;
		cb(null, filename);
	}
});

// Filtre pour les types de fichiers autorisés
const fileFilter = (req, file, cb) => {
	// Types MIME autorisés
	const allowedTypes = [
		'image/jpeg',
		'image/jpg',
		'image/png',
		'image/gif',
		'image/webp',
		'application/pdf',
		'text/plain',
		'text/csv',
		'application/vnd.ms-excel',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	];

	// Extensions autorisées
	const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.txt', '.csv', '.xls', '.xlsx'];
	const fileExtension = path.extname(file.originalname).toLowerCase();

	if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
		logger.info(`File upload accepted: ${file.originalname}`, {
			originalname: file.originalname,
			mimetype: file.mimetype,
			size: file.size
		});
		cb(null, true);
	} else {
		logger.warn(`File upload rejected: ${file.originalname}`, {
			originalname: file.originalname,
			mimetype: file.mimetype,
			reason: 'Invalid file type'
		});
		cb(new Error(`Type de fichier non autorisé. Extensions autorisées: ${allowedExtensions.join(', ')}`), false);
	}
};

// Configuration principale pour les images
const uploadImages = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
		const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
		const fileExtension = path.extname(file.originalname).toLowerCase();

		if (imageTypes.includes(file.mimetype) && imageExtensions.includes(fileExtension)) {
			cb(null, true);
		} else {
			cb(new Error('Seules les images sont autorisées (JPG, JPEG, PNG, GIF, WebP)'), false);
		}
	},
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB
		files: 5 // Maximum 5 fichiers
	}
});

// Configuration pour les documents
const uploadDocuments = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		const docTypes = ['application/pdf', 'text/plain', 'text/csv'];
		const docExtensions = ['.pdf', '.txt', '.csv'];
		const fileExtension = path.extname(file.originalname).toLowerCase();

		if (docTypes.includes(file.mimetype) && docExtensions.includes(fileExtension)) {
			cb(null, true);
		} else {
			cb(new Error('Seuls les documents PDF, TXT et CSV sont autorisés'), false);
		}
	},
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB
		files: 3 // Maximum 3 fichiers
	}
});

// Configuration générale (tous types autorisés)
const uploadGeneral = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB
		files: 5 // Maximum 5 fichiers
	}
});

// Middleware pour gérer les erreurs d'upload
const handleUploadError = (error, req, res, next) => {
	if (error instanceof multer.MulterError) {
		let message = "Erreur lors de l'upload du fichier";

		switch (error.code) {
			case 'LIMIT_FILE_SIZE':
				message = 'Le fichier est trop volumineux';
				break;
			case 'LIMIT_FILE_COUNT':
				message = 'Trop de fichiers uploadés';
				break;
			case 'LIMIT_UNEXPECTED_FILE':
				message = 'Champ de fichier inattendu';
				break;
			case 'LIMIT_PART_COUNT':
				message = 'Trop de parties dans la requête';
				break;
			case 'LIMIT_FIELD_KEY':
				message = 'Nom de champ trop long';
				break;
			case 'LIMIT_FIELD_VALUE':
				message = 'Valeur de champ trop longue';
				break;
			case 'LIMIT_FIELD_COUNT':
				message = 'Trop de champs';
				break;
			default:
				message = error.message;
		}

		logger.error('Multer upload error', {
			error: error.code,
			message: error.message,
			field: error.field
		});

		return res.status(400).json({
			error: message,
			code: error.code
		});
	}

	if (error) {
		logger.error('File upload error', {
			error: error.message,
			stack: error.stack
		});
		return res.status(400).json({
			error: error.message
		});
	}

	next();
};

export { uploadImages, uploadDocuments, uploadGeneral, handleUploadError };
