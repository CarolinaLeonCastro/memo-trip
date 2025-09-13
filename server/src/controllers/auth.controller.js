import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../config/logger.config.js';
import env from '../config/dotenv.config.js';

// Fonction utilitaire pour générer un token JWT
const generateToken = (user) => {
	const payload = {
		userId: user._id,
		email: user.email,
		role: user.role,
		status: user.status,
		name: user.name
	};
	return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
};

// Fonction utilitaire pour les options de cookies sécurisés
const getCookieOptions = () => {
	const isProduction = process.env.NODE_ENV === 'production';
	const isRender = process.env.RENDER || process.env.PORT; // Détection Render

	return {
		httpOnly: true,
		secure: isRender || isProduction, // HTTPS sur Render et production
		sameSite: isRender || isProduction ? 'none' : 'lax', // 'none' pour cross-domain HTTPS
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours en millisecondes
		path: '/'
		// Pas de domaine spécifique pour permettre le cross-domain avec sameSite: 'none'
	};
};

// POST /api/auth/register
export async function register(req, res, next) {
	try {
		const { email, password, name } = req.body;

		// Vérifier si l'utilisateur existe déjà
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
		}

		// Hasher le mot de passe
		const saltRounds = 12;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Créer l'utilisateur
		const user = await User.create({
			email,
			password: hashedPassword,
			name
		});

		// Générer le token JWT
		const token = generateToken(user);

		// Retourner les données de l'utilisateur (sans le mot de passe) et le token
		const userResponse = {
			id: user._id,
			email: user.email,
			name: user.name,
			role: user.role,
			status: user.status,
			avatar: user.avatar,
			created_at: user.created_at,
			last_login: user.last_login
		};

		logger.info('User registered successfully', { userId: user._id, email: user.email });

		// Définir le cookie HTTPOnly sécurisé
		res.cookie('auth-token', token, getCookieOptions());

		res.status(201).json({
			message: 'Utilisateur créé avec succès',
			user: userResponse
		});
	} catch (err) {
		logger.error('Error during user registration', { error: err.message });
		next(err);
	}
}

// POST /api/auth/login
export async function login(req, res, next) {
	try {
		const { email, password } = req.body;

		// Chercher l'utilisateur par email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
		}

		// Vérifier le mot de passe
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
		}

		// Mettre à jour la date de dernière connexion
		user.last_login = new Date();
		await user.save();

		// Générer le token JWT
		const token = generateToken(user);

		// Retourner les données de l'utilisateur (sans le mot de passe) et le token
		const userResponse = {
			id: user._id,
			email: user.email,
			name: user.name,
			role: user.role,
			status: user.status,
			avatar: user.avatar,
			created_at: user.created_at,
			last_login: user.last_login
		};

		logger.info('User logged in successfully', { userId: user._id, email: user.email });

		// Définir le cookie HTTPOnly sécurisé
		const cookieOptions = getCookieOptions();
		logger.info('Setting auth cookie', {
			options: cookieOptions,
			origin: req.get('Origin'),
			userAgent: req.get('User-Agent')?.substring(0, 100)
		});
		res.cookie('auth-token', token, cookieOptions);

		res.json({
			message: 'Connexion réussie',
			user: userResponse
		});
	} catch (err) {
		logger.error('Error during user login', { error: err.message });
		next(err);
	}
}

// POST /api/auth/logout
export function logout(req, res, next) {
	try {
		// Supprimer le cookie d'authentification
		res.clearCookie('auth-token', getCookieOptions());

		logger.info('User logged out successfully', {
			userId: req.user?._id,
			email: req.user?.email
		});

		res.json({ message: 'Déconnexion réussie' });
	} catch (err) {
		logger.error('Error during logout', { error: err.message });
		next(err);
	}
}

// GET /api/auth/me
export function getCurrentUser(req, res, next) {
	try {
		// L'utilisateur est déjà disponible via le middleware authenticateToken
		const userResponse = {
			id: req.user._id,
			email: req.user.email,
			name: req.user.name,
			role: req.user.role,
			status: req.user.status,
			avatar: req.user.avatar,
			created_at: req.user.created_at,
			last_login: req.user.last_login
		};

		res.json({ user: userResponse });
	} catch (err) {
		logger.error('Error getting current user', { error: err.message });
		next(err);
	}
}
