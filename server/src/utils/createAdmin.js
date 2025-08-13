// Script pour créer un utilisateur administrateur
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import MONGO_URI from '../config/dotenv.config.js';
import User from '../models/User.js';

const createAdminUser = async () => {
	try {
		console.log('🔗 Connexion à MongoDB...');
		await mongoose.connect(MONGO_URI);
		console.log('✅ Connecté à MongoDB');

		// Données de l'administrateur
		const adminData = {
			email: 'admin@memotrip.com',
			password: 'Admin123!',
			name: 'Administrateur MemoTrip',
			role: 'admin',
			status: 'active'
		};

		// Vérifier si un admin existe déjà
		const existingAdmin = await User.findOne({ email: adminData.email });
		if (existingAdmin) {
			console.log('⚠️  Un administrateur avec cet email existe déjà');
			console.log('Email:', existingAdmin.email);
			console.log('Nom:', existingAdmin.name);
			console.log('Rôle:', existingAdmin.role);
			return;
		}

		// Hasher le mot de passe
		const saltRounds = 12;
		const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

		// Créer l'utilisateur admin
		const admin = await User.create({
			email: adminData.email,
			password: hashedPassword,
			name: adminData.name,
			role: adminData.role,
			status: adminData.status,
			last_login: new Date()
		});

		console.log('✅ Administrateur créé avec succès !');
		console.log('📧 Email:', admin.email);
		console.log('👤 Nom:', admin.name);
		console.log('🔑 Rôle:', admin.role);
		console.log('📊 Statut:', admin.status);
		console.log('');
		console.log('🔐 Informations de connexion :');
		console.log('Email: admin@memotrip.com');
		console.log('Mot de passe: Admin123!');
	} catch (error) {
		console.error("❌ Erreur lors de la création de l'administrateur:", error);
	} finally {
		await mongoose.disconnect();
		console.log('🔌 Déconnecté de MongoDB');
	}
};

// Exécution du script
createAdminUser();
