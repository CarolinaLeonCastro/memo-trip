import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../config/logger.config.js';
import env from '../config/dotenv.config.js';

// Fonction utilitaire pour générer un token JWT
const generateToken = (userId) => {
	return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
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
		const token = generateToken(user._id);

		// Retourner les données de l'utilisateur (sans le mot de passe) et le token
		const userResponse = {
			id: user._id,
			email: user.email,
			name: user.name,
			avatar: user.avatar,
			created_at: user.created_at
		};

		logger.info('User registered successfully', { userId: user._id, email: user.email });

		res.status(201).json({
			message: 'Utilisateur créé avec succès',
			user: userResponse,
			token
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

		// Générer le token JWT
		const token = generateToken(user._id);

		// Retourner les données de l'utilisateur (sans le mot de passe) et le token
		const userResponse = {
			id: user._id,
			email: user.email,
			name: user.name,
			avatar: user.avatar,
			created_at: user.created_at
		};

		logger.info('User logged in successfully', { userId: user._id, email: user.email });

		res.json({
			message: 'Connexion réussie',
			user: userResponse,
			token
		});
	} catch (err) {
		logger.error('Error during user login', { error: err.message });
		next(err);
	}
}

// POST /api/auth/logout
export function logout(req, res, next) {
	try {
		// Avec JWT, le logout côté serveur consiste simplement à confirmer la déconnexion
		// Le client devra supprimer le token de son côté
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
			avatar: req.user.avatar,
			created_at: req.user.created_at
		};

		res.json({ user: userResponse });
	} catch (err) {
		logger.error('Error getting current user', { error: err.message });
		next(err);
	}
}
