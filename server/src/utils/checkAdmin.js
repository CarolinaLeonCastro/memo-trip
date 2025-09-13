// Script de diagnostic pour vérifier les comptes admin
import mongoose from 'mongoose';
import MONGO_URI from '../config/dotenv.config.js';
import User from '../models/User.js';

const checkAdminStatus = async () => {
	try {
		console.log('🔗 Connexion à MongoDB...');
		await mongoose.connect(MONGO_URI);
		console.log('✅ Connecté à MongoDB');

		// Vérifier tous les utilisateurs avec leurs rôles
		const users = await User.find({}, '-password').sort({ created_at: -1 });

		console.log('\n📊 État des utilisateurs dans la base :');
		console.log('═'.repeat(60));

		if (users.length === 0) {
			console.log('❌ Aucun utilisateur trouvé dans la base de données');
			return;
		}

		users.forEach((user, index) => {
			console.log(`\n${index + 1}. ${user.name}`);
			console.log(`   📧 Email: ${user.email}`);
			console.log(`   🔑 Rôle: ${user.role || 'non défini'}`);
			console.log(`   📊 Statut: ${user.status || 'non défini'}`);
			console.log(`   📅 Créé le: ${user.created_at?.toLocaleDateString('fr-FR') || 'non défini'}`);
			console.log(`   🕐 Dernière connexion: ${user.last_login?.toLocaleDateString('fr-FR') || 'jamais'}`);

			if (user.role === 'admin') {
				console.log('   🟢 ← ADMINISTRATEUR');
			} else {
				console.log('   🔵 ← UTILISATEUR');
			}
		});

		// Statistiques
		const adminCount = users.filter((u) => u.role === 'admin').length;
		const userCount = users.filter((u) => u.role === 'user').length;
		const undefinedCount = users.filter((u) => !u.role).length;

		console.log('\n📈 Statistiques :');
		console.log('═'.repeat(30));
		console.log(`👑 Administrateurs: ${adminCount}`);
		console.log(`👤 Utilisateurs: ${userCount}`);
		console.log(`❓ Rôle non défini: ${undefinedCount}`);
		console.log(`📊 Total: ${users.length}`);

		// Vérifications de sécurité
		console.log('\n🔒 Vérifications de sécurité :');
		console.log('═'.repeat(35));

		if (adminCount === 0) {
			console.log('❌ AUCUN ADMINISTRATEUR trouvé !');
			console.log('   → Utilisez: npm run create-admin');
		} else {
			console.log('✅ Au moins un administrateur existe');
		}

		if (undefinedCount > 0) {
			console.log(`⚠️  ${undefinedCount} utilisateur(s) sans rôle défini`);
			console.log("   → Ces utilisateurs pourraient avoir des problèmes d'accès");
		}

		// Rechercher spécifiquement l'admin par défaut
		const defaultAdmin = users.find((u) => u.email === 'admin@memotrip.com');
		if (defaultAdmin) {
			console.log('\n🎯 Admin par défaut trouvé :');
			console.log('═'.repeat(30));
			console.log(`   📧 Email: ${defaultAdmin.email}`);
			console.log(`   🔑 Rôle: ${defaultAdmin.role}`);
			console.log(`   📊 Statut: ${defaultAdmin.status}`);

			if (defaultAdmin.role === 'admin') {
				console.log('   ✅ Rôle admin correctement configuré');
			} else {
				console.log("   ❌ PROBLÈME: Le rôle n'est pas admin !");
			}
		}
	} catch (error) {
		console.error('❌ Erreur lors de la vérification:', error);
	} finally {
		await mongoose.disconnect();
		console.log('\n🔌 Déconnecté de MongoDB');
	}
};

// Exécution du script
checkAdminStatus();
