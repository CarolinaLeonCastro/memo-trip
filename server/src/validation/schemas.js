import Joi from 'joi';

// Validation pour les ObjectIds MongoDB
const objectIdSchema = Joi.string()
	.regex(/^[0-9a-fA-F]{24}$/)
	.message('Invalid ObjectId format');

// Schéma de validation pour l'authentification
export const authValidation = {
	// Inscription
	register: Joi.object({
		name: Joi.string().trim().min(2).max(50).required().messages({
			'string.min': 'Le nom doit contenir au moins 2 caractères',
			'string.max': 'Le nom ne peut pas dépasser 50 caractères',
			'any.required': 'Le nom est obligatoire'
		}),
		email: Joi.string().email().lowercase().required().messages({
			'string.email': "Format d'email invalide",
			'any.required': "L'email est obligatoire"
		}),
		password: Joi.string().min(6).max(100).required().messages({
			'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
			'string.max': 'Le mot de passe ne peut pas dépasser 100 caractères',
			'any.required': 'Le mot de passe est obligatoire'
		}),
		confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
			'any.only': 'Les mots de passe ne correspondent pas',
			'any.required': 'La confirmation du mot de passe est obligatoire'
		})
	}),

	// Connexion
	login: Joi.object({
		email: Joi.string().email().required().messages({
			'string.email': "Format d'email invalide",
			'any.required': "L'email est obligatoire"
		}),
		password: Joi.string().required().messages({
			'any.required': 'Le mot de passe est obligatoire'
		})
	})
};

// Schéma de validation pour User
export const userValidation = {
	// Création d'un utilisateur
	create: Joi.object({
		name: Joi.string().trim().min(2).max(50).required().messages({
			'string.min': 'Le nom doit contenir au moins 2 caractères',
			'string.max': 'Le nom ne peut pas dépasser 50 caractères',
			'any.required': 'Le nom est obligatoire'
		}),
		email: Joi.string().email().lowercase().required().messages({
			'string.email': "Format d'email invalide",
			'any.required': "L'email est obligatoire"
		}),
		password: Joi.string().min(6).max(100).required().messages({
			'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
			'string.max': 'Le mot de passe ne peut pas dépasser 100 caractères',
			'any.required': 'Le mot de passe est obligatoire'
		})
	}),

	// Mise à jour d'un utilisateur
	update: Joi.object({
		name: Joi.string().trim().min(2).max(50).messages({
			'string.min': 'Le nom doit contenir au moins 2 caractères',
			'string.max': 'Le nom ne peut pas dépasser 50 caractères'
		}),
		email: Joi.string().email().lowercase().messages({
			'string.email': "Format d'email invalide"
		}),
		password: Joi.string().min(6).max(100).messages({
			'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
			'string.max': 'Le mot de passe ne peut pas dépasser 100 caractères'
		})
	})
		.min(1)
		.message('Au moins un champ doit être fourni pour la mise à jour'),

	// Validation des paramètres
	params: Joi.object({
		id: objectIdSchema.required()
	})
};

// Schéma de validation pour Journal
export const journalValidation = {
	// Création d'un journal
	create: Joi.object({
		title: Joi.string().trim().min(3).max(100).required().messages({
			'string.min': 'Le titre doit contenir au moins 3 caractères',
			'string.max': 'Le titre ne peut pas dépasser 100 caractères',
			'any.required': 'Le titre est obligatoire'
		}),
		description: Joi.string().trim().max(500).allow('').messages({
			'string.max': 'La description ne peut pas dépasser 500 caractères'
		}),
		personal_notes: Joi.string().trim().max(2000).allow('').messages({
			'string.max': 'Les notes personnelles ne peuvent pas dépasser 2000 caractères'
		}),
		start_date: Joi.date().required().messages({
			'any.required': 'La date de début est obligatoire',
			'date.base': 'Format de date invalide'
		}),
		end_date: Joi.date().min(Joi.ref('start_date')).required().messages({
			'any.required': 'La date de fin est obligatoire',
			'date.min': 'La date de fin doit être postérieure à la date de début',
			'date.base': 'Format de date invalide'
		}),
		cover_image: Joi.string().uri().allow('').messages({
			'string.uri': "L'URL de l'image de couverture doit être valide"
		}),
		status: Joi.string().valid('draft', 'published', 'archived').default('draft').messages({
			'any.only': 'Le statut doit être draft, published ou archived'
		}),
		tags: Joi.array().items(Joi.string().trim().min(1).max(30)).max(10).messages({
			'array.max': 'Maximum 10 tags autorisés',
			'string.min': 'Un tag ne peut pas être vide',
			'string.max': 'Un tag ne peut pas dépasser 30 caractères'
		}),
		user_id: objectIdSchema.required()
	}),

	// Mise à jour d'un journal
	update: Joi.object({
		title: Joi.string().trim().min(3).max(100).messages({
			'string.min': 'Le titre doit contenir au moins 3 caractères',
			'string.max': 'Le titre ne peut pas dépasser 100 caractères'
		}),
		description: Joi.string().trim().max(500).allow('').messages({
			'string.max': 'La description ne peut pas dépasser 500 caractères'
		}),
		personal_notes: Joi.string().trim().max(2000).allow('').messages({
			'string.max': 'Les notes personnelles ne peuvent pas dépasser 2000 caractères'
		}),
		start_date: Joi.date().messages({
			'date.base': 'Format de date invalide'
		}),
		end_date: Joi.date().min(Joi.ref('start_date')).messages({
			'date.min': 'La date de fin doit être postérieure à la date de début',
			'date.base': 'Format de date invalide'
		}),
		cover_image: Joi.string().uri().allow('').messages({
			'string.uri': "L'URL de l'image de couverture doit être valide"
		}),
		status: Joi.string().valid('draft', 'published', 'archived').messages({
			'any.only': 'Le statut doit être draft, published ou archived'
		}),
		tags: Joi.array().items(Joi.string().trim().min(1).max(30)).max(10).messages({
			'array.max': 'Maximum 10 tags autorisés',
			'string.min': 'Un tag ne peut pas être vide',
			'string.max': 'Un tag ne peut pas dépasser 30 caractères'
		})
	})
		.min(1)
		.message('Au moins un champ doit être fourni pour la mise à jour'),

	// Validation des paramètres
	params: Joi.object({
		id: objectIdSchema.required()
	})
};

// Schéma de validation pour Place
export const placeValidation = {
	// Création d'un lieu
	create: Joi.object({
		name: Joi.string().trim().min(2).max(100).required().messages({
			'string.min': 'Le nom du lieu doit contenir au moins 2 caractères',
			'string.max': 'Le nom du lieu ne peut pas dépasser 100 caractères',
			'any.required': 'Le nom du lieu est obligatoire'
		}),
		description: Joi.string().trim().max(1000).allow('').messages({
			'string.max': 'La description ne peut pas dépasser 1000 caractères'
		}),
		location: Joi.object({
			type: Joi.string().valid('Point').default('Point'),
			coordinates: Joi.array().items(Joi.number().min(-180).max(180)).length(2).default([2.3488, 48.8534]).messages({
				'array.length': 'Les coordonnées doivent contenir exactement 2 valeurs [longitude, latitude]',
				'number.min': 'Les coordonnées doivent être entre -180 et 180',
				'number.max': 'Les coordonnées doivent être entre -180 et 180'
			}),
			address: Joi.string().trim().max(200).allow('').messages({
				'string.max': "L'adresse ne peut pas dépasser 200 caractères"
			}),
			city: Joi.string().trim().max(100).allow('').messages({
				'string.max': 'La ville ne peut pas dépasser 100 caractères'
			}),
			country: Joi.string().trim().max(100).allow('').messages({
				'string.max': 'Le pays ne peut pas dépasser 100 caractères'
			})
		}).required(),
		date_visited: Joi.date().required().messages({
			'any.required': 'La date de visite est obligatoire',
			'date.base': 'Format de date invalide'
		}),
		start_date: Joi.date().required().messages({
			'any.required': 'La date de début de visite est obligatoire',
			'date.base': 'Format de date invalide'
		}),
		end_date: Joi.date().min(Joi.ref('start_date')).required().messages({
			'any.required': 'La date de fin de visite est obligatoire',
			'date.min': 'La date de fin doit être postérieure ou égale à la date de début',
			'date.base': 'Format de date invalide'
		}),
		rating: Joi.number().integer().min(1).max(5).allow(null).messages({
			'number.min': 'La note doit être entre 1 et 5',
			'number.max': 'La note doit être entre 1 et 5',
			'number.integer': 'La note doit être un nombre entier'
		}),
		weather: Joi.string().trim().max(50).allow('', null).messages({
			'string.max': 'La météo ne peut pas dépasser 50 caractères'
		}),
		budget: Joi.number().min(0).allow(null).messages({
			'number.min': 'Le budget ne peut pas être négatif'
		}),
		tags: Joi.array().items(Joi.string().trim().min(1).max(30)).max(10).default([]).messages({
			'array.max': 'Maximum 10 tags autorisés',
			'string.min': 'Un tag ne peut pas être vide',
			'string.max': 'Un tag ne peut pas dépasser 30 caractères'
		}),
		is_favorite: Joi.boolean().default(false),
		visit_duration: Joi.number().integer().min(1).allow(null).messages({
			'number.min': "La durée de visite doit être d'au moins 1 minute",
			'number.integer': 'La durée de visite doit être un nombre entier'
		}),
		notes: Joi.string().trim().max(2000).allow('', null).messages({
			'string.max': 'Les notes ne peuvent pas dépasser 2000 caractères'
		}),
		user_id: objectIdSchema, // Optionnel car ajouté par le contrôleur depuis req.user.id
		journal_id: objectIdSchema.required()
	}),

	// Mise à jour d'un lieu
	update: Joi.object({
		name: Joi.string().trim().min(2).max(100).messages({
			'string.min': 'Le nom du lieu doit contenir au moins 2 caractères',
			'string.max': 'Le nom du lieu ne peut pas dépasser 100 caractères'
		}),
		description: Joi.string().trim().max(1000).allow('').messages({
			'string.max': 'La description ne peut pas dépasser 1000 caractères'
		}),
		location: Joi.object({
			type: Joi.string().valid('Point').default('Point'),
			coordinates: Joi.array().items(Joi.number().min(-180).max(180)).length(2).messages({
				'array.length': 'Les coordonnées doivent contenir exactement 2 valeurs [longitude, latitude]',
				'number.min': 'Les coordonnées doivent être entre -180 et 180',
				'number.max': 'Les coordonnées doivent être entre -180 et 180'
			}),
			address: Joi.string().trim().max(200).allow('').messages({
				'string.max': "L'adresse ne peut pas dépasser 200 caractères"
			}),
			city: Joi.string().trim().max(100).allow('').messages({
				'string.max': 'La ville ne peut pas dépasser 100 caractères'
			}),
			country: Joi.string().trim().max(100).allow('').messages({
				'string.max': 'Le pays ne peut pas dépasser 100 caractères'
			})
		}),
		date_visited: Joi.date().messages({
			'date.base': 'Format de date invalide'
		}),
		start_date: Joi.date().messages({
			'date.base': 'Format de date invalide'
		}),
		end_date: Joi.date().min(Joi.ref('start_date')).messages({
			'date.min': 'La date de fin doit être postérieure ou égale à la date de début',
			'date.base': 'Format de date invalide'
		}),
		rating: Joi.number().integer().min(1).max(5).messages({
			'number.min': 'La note doit être entre 1 et 5',
			'number.max': 'La note doit être entre 1 et 5',
			'number.integer': 'La note doit être un nombre entier'
		}),
		weather: Joi.string().trim().max(50).allow('').messages({
			'string.max': 'La météo ne peut pas dépasser 50 caractères'
		}),
		budget: Joi.number().min(0).messages({
			'number.min': 'Le budget ne peut pas être négatif'
		}),
		tags: Joi.array().items(Joi.string().trim().min(1).max(30)).max(10).messages({
			'array.max': 'Maximum 10 tags autorisés',
			'string.min': 'Un tag ne peut pas être vide',
			'string.max': 'Un tag ne peut pas dépasser 30 caractères'
		}),
		is_favorite: Joi.boolean(),
		visit_duration: Joi.number().integer().min(1).messages({
			'number.min': "La durée de visite doit être d'au moins 1 minute",
			'number.integer': 'La durée de visite doit être un nombre entier'
		}),
		notes: Joi.string().trim().max(2000).allow('').messages({
			'string.max': 'Les notes ne peuvent pas dépasser 2000 caractères'
		})
	})
		.min(1)
		.message('Au moins un champ doit être fourni pour la mise à jour'),

	// Validation des paramètres
	params: Joi.object({
		id: objectIdSchema.required()
	}),

	// Validation pour l'ajout de photos
	addPhotos: Joi.object({
		captions: Joi.array().items(Joi.string().trim().max(200).allow('')).max(5).messages({
			'array.max': 'Maximum 5 captions autorisées',
			'string.max': 'Une caption ne peut pas dépasser 200 caractères'
		})
	})
};

// Validation pour les requêtes de géolocalisation
export const geoValidation = {
	nearby: Joi.object({
		lat: Joi.number().min(-90).max(90).required().messages({
			'number.min': 'La latitude doit être entre -90 et 90',
			'number.max': 'La latitude doit être entre -90 et 90',
			'any.required': 'La latitude est obligatoire'
		}),
		lng: Joi.number().min(-180).max(180).required().messages({
			'number.min': 'La longitude doit être entre -180 et 180',
			'number.max': 'La longitude doit être entre -180 et 180',
			'any.required': 'La longitude est obligatoire'
		}),
		maxDistance: Joi.number().integer().min(100).max(50000).default(1000).messages({
			'number.min': 'La distance minimale est de 100 mètres',
			'number.max': 'La distance maximale est de 50km',
			'number.integer': 'La distance doit être un nombre entier'
		})
	})
};
