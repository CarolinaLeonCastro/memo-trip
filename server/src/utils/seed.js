// src/utils/seed.js
import mongoose from 'mongoose';
import MONGO_URI from '../config/dotenv.config.js';
import User from '../models/User.js';
import Place from '../models/Place.js';
import Note from '../models/Note.js';
import Photo from '../models/Photo.js';

// Définit tes données de test
const seedData = async () => {
	// Purge les anciennes données
	await Promise.all([User.deleteMany(), Place.deleteMany(), Note.deleteMany(), Photo.deleteMany()]);

	// Crée des utilisateurs
	const users = await User.create([
		{ email: 'alice@example.com', password: 'Password1!', name: 'Alice' },
		{ email: 'bob@example.com', password: 'Password1!', name: 'Bob' },
		{ email: 'charlie@example.com', password: 'Password1!', name: 'Charlie' }
	]);

	// Crée des lieux pour chaque utilisateur
	const places = await Place.create([
		{
			user_id: users[0]._id,
			name: 'Tour Eiffel',
			description: 'Visite du monument emblématique de Paris',
			location: { type: 'Point', coordinates: [2.2945, 48.8584] },
			date_visited: new Date('2023-06-01')
		},
		{
			user_id: users[1]._id,
			name: 'Louvre',
			description: 'La fameuse pyramide et la Joconde',
			location: { type: 'Point', coordinates: [2.3364, 48.8606] },
			date_visited: new Date('2023-06-02')
		},
		{
			user_id: users[0]._id,
			name: 'Arc de Triomphe',
			description: 'Monument historique au centre de la Place Charles de Gaulle',
			location: { type: 'Point', coordinates: [2.295, 48.8738] },
			date_visited: new Date('2023-06-03')
		},
		{
			user_id: users[2]._id,
			name: 'Sacré-Cœur',
			description: 'Basilique située au sommet de la butte Montmartre',
			location: { type: 'Point', coordinates: [2.3431, 48.8867] },
			date_visited: new Date('2023-06-04')
		}
	]);

	// Crée des notes associées aux lieux
	const notes = await Note.create([
		{ place_id: places[0]._id, text: 'Superbe panorama depuis le sommet !', created_at: new Date() },
		{ place_id: places[1]._id, text: 'Trop de monde, mais ça vaut le coup', created_at: new Date() },
		{ place_id: places[2]._id, text: 'Vue magnifique sur les Champs-Élysées', created_at: new Date() },
		{ place_id: places[3]._id, text: 'Montée difficile mais la vue est exceptionnelle', created_at: new Date() },
		{ place_id: places[0]._id, text: 'Idéal pour un coucher de soleil romantique', created_at: new Date() }
	]);

	// Crée des photos pour illustrer
	const photos = await Photo.create([
		{
			place_id: places[0]._id,
			url: 'https://example.com/eiffel-tower.jpg',
			caption: 'Vue du sommet de la Tour Eiffel',
			uploaded_at: new Date()
		},
		{
			place_id: places[1]._id,
			url: 'https://example.com/louvre-pyramid.jpg',
			caption: 'Devant la pyramide du Louvre',
			uploaded_at: new Date()
		},
		{
			place_id: places[2]._id,
			url: 'https://example.com/arc-triomphe.jpg',
			caption: 'Arc de Triomphe vu depuis les Champs-Élysées',
			uploaded_at: new Date()
		},
		{
			place_id: places[3]._id,
			url: 'https://example.com/sacre-coeur.jpg',
			caption: 'Basilique du Sacré-Cœur',
			uploaded_at: new Date()
		}
	]);

	console.log('✅ Seed terminé avec succès :');
	console.log(`- ${users.length} utilisateurs créés`);
	console.log(`- ${places.length} lieux créés`);
	console.log(`- ${notes.length} notes créées`);
	console.log(`- ${photos.length} photos créées`);
};

// Connexion à MongoDB + exécution du seed
const run = async () => {
	try {
		console.log('🔗 Connexion à MongoDB...');
		await mongoose.connect(MONGO_URI);
		console.log('✅ Connecté à MongoDB Atlas');

		await seedData();
	} catch (err) {
		console.error('❌ Erreur pendant le seed :', err);
	} finally {
		await mongoose.disconnect();
		console.log('🔌 Déconnecté de MongoDB');
	}
};

run();
