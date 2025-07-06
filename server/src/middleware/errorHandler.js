// Middleware de gestion d'erreurs
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
	console.error(err.stack);

	// Erreur de validation Mongoose
	if (err.name === 'ValidationError') {
		const errors = Object.values(err.errors).map((val) => val.message);
		return res.status(400).json({
			message: 'Validation Error',
			errors: errors
		});
	}

	// Erreur de cast (ObjectId invalide)
	if (err.name === 'CastError') {
		return res.status(400).json({
			message: 'Invalid ID format'
		});
	}

	// Erreur de clé dupliquée
	if (err.code === 11000) {
		const field = Object.keys(err.keyValue)[0];
		return res.status(400).json({
			message: `Duplicate ${field}. ${field} already exists.`
		});
	}

	// Erreur par défaut
	res.status(err.statusCode || 500).json({
		message: err.message || 'Internal Server Error'
	});
};

export default errorHandler;
