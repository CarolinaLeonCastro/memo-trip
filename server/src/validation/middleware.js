import { userValidation, journalValidation, placeValidation, geoValidation, authValidation } from './schemas.js';
import logger from '../config/logger.config.js';

// Middleware générique pour valider les données
export const validate = (schema, source = 'body') => {
	return (req, res, next) => {
		let dataToValidate;

		switch (source) {
			case 'body':
				dataToValidate = req.body;
				break;
			case 'params':
				dataToValidate = req.params;
				break;
			case 'query':
				dataToValidate = req.query;
				break;
			default:
				dataToValidate = req.body;
		}

	const { error, value } = schema.validate(dataToValidate, {
		abortEarly: false, // Retourner toutes les erreurs
		stripUnknown: true, // Supprimer les champs non définis dans le schéma
		convert: true // Convertir automatiquement les types (string vers number, etc.)
	});

	if (error) {
		// Logger l'erreur de validation
		logger.warn('Validation error', {
			source,
			errors: error.details.map((detail) => ({
				field: detail.path.join('.'),
				message: detail.message,
				value: detail.context?.value
			})),
			originalData: dataToValidate
		});

			return res.status(400).json({
				message: 'Erreur de validation',
				errors: error.details.map((detail) => ({
					field: detail.path.join('.'),
					message: detail.message
				}))
			});
		}

		// Remplacer les données originales par les données validées et nettoyées
		switch (source) {
			case 'body':
				req.body = value;
				break;
			case 'params':
				// Ne pas écraser req.params car c'est géré par Express
				Object.assign(req.params, value);
				break;
			case 'query':
				// Ne pas écraser req.query car c'est en lecture seule
				Object.assign(req.query, value);
				break;
		}

		next();
	};
};

// Middlewares spécifiques pour chaque modèle

// Auth validation
export const validateRegister = validate(authValidation.register);
export const validateLogin = validate(authValidation.login);

// User validation
export const validateUserCreate = validate(userValidation.create);
export const validateUserUpdate = validate(userValidation.update);
export const validateUserParams = validate(userValidation.params, 'params');
export const validateUserSettings = validate(userValidation.settings);

// Journal validation
export const validateJournalCreate = validate(journalValidation.create);
export const validateJournalUpdate = validate(journalValidation.update);
export const validateJournalParams = validate(journalValidation.params, 'params');

// Place validation
export const validatePlaceCreate = validate(placeValidation.create);
export const validatePlaceUpdate = validate(placeValidation.update);
export const validatePlaceParams = validate(placeValidation.params, 'params');
export const validatePlacePhotos = validate(placeValidation.addPhotos);

// Geo validation
export const validateNearbyQuery = validate(geoValidation.nearby, 'query');

// Middleware pour valider les ObjectIds dans les paramètres
export const validateObjectId = (paramName = 'id') => {
	return (req, res, next) => {
		const id = req.params[paramName];

		if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
			logger.warn('Invalid ObjectId', {
				paramName,
				value: id,
				url: req.originalUrl
			});

			return res.status(400).json({
				message: 'Invalid ID format',
				error: `Parameter '${paramName}' must be a valid MongoDB ObjectId`
			});
		}

		next();
	};
};
