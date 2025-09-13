import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import logger from '../config/logger.config.js';

// Route temporaire pour créer le premier administrateur
export const createFirstAdmin = async (req, res) => {
	try {
		// Vérifier s'il y a déjà des administrateurs
		const existingAdmin = await User.findOne({ role: 'admin' });
		if (existingAdmin) {
			return res.status(400).json({
				success: false,
				message: 'Un administrateur existe déjà dans le système'
			});
		}

		const { email, password, name } = req.body;

		// Validation basique
		if (!email || !password || !name) {
			return res.status(400).json({
				success: false,
				message: 'Email, mot de passe et nom sont requis'
			});
		}

		if (password.length < 6) {
			return res.status(400).json({
				success: false,
				message: 'Le mot de passe doit contenir au moins 6 caractères'
			});
		}

		// Vérifier si l'email est déjà utilisé
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: 'Un utilisateur avec cet email existe déjà'
			});
		}

		// Hasher le mot de passe
		const saltRounds = 12;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Créer l'administrateur
		const admin = await User.create({
			email,
			password: hashedPassword,
			name,
			role: 'admin',
			status: 'active',
			last_login: new Date()
		});

		logger.info('First admin created', {
			adminId: admin._id,
			email: admin.email,
			name: admin.name
		});

		res.status(201).json({
			success: true,
			message: 'Premier administrateur créé avec succès',
			admin: {
				id: admin._id,
				email: admin.email,
				name: admin.name,
				role: admin.role,
				status: admin.status
			}
		});
	} catch (error) {
		logger.error('Error creating first admin:', error);
		res.status(500).json({
			success: false,
			message: "Erreur lors de la création de l'administrateur"
		});
	}
};

// Vérifier s'il y a des administrateurs dans le système
export const checkAdminExists = async (req, res) => {
	try {
		const adminCount = await User.countDocuments({ role: 'admin' });
		const hasAdmin = adminCount > 0;

		res.json({
			success: true,
			hasAdmin,
			adminCount
		});
	} catch (error) {
		logger.error('Error checking admin existence:', error);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la vérification'
		});
	}
};
