// src/utils/seed.js
import mongoose from 'mongoose';
import MONGO_URI from '../config/dotenv.config.js';
import User from '../models/User.js';
import Journal from '../models/Journal.js';
import Place from '../models/Place.js';

// Définit tes données de test
const seedData = async () => {
	console.log('🗑️ Purge des anciennes données...');
	// Purge les anciennes données
	await Promise.all([User.deleteMany(), Journal.deleteMany(), Place.deleteMany()]);

	console.log('👥 Création des utilisateurs...');
	// Crée des utilisateurs avec mots de passe simples
	const users = await User.create([
		{
			email: 'admin@memotrip.com',
			password: 'Admin123!',
			name: 'Administrateur MemoTrip',
			role: 'admin',
			status: 'active'
		},
		{
			email: 'alice.martin@example.com',
			password: 'password123',
			name: 'Alice Martin',
			role: 'user',
			status: 'active'
		},
		{
			email: 'bob.dubois@example.com',
			password: 'password123',
			name: 'Bob Dubois',
			role: 'user',
			status: 'active'
		},
		{
			email: 'astrid.leon@example.com',
			password: 'password123',
			name: 'Astrid Leon',
			role: 'user',
			status: 'active'
		}
	]);

	console.log('📚 Création des journaux...');
	// Crée des journaux de voyage
	const journals = await Journal.create([
		{
			title: 'Week-end romantique à Paris',
			description: 'Un magnifique voyage de 3 jours dans la capitale française avec ma moitié',
			start_date: new Date('2024-06-01'),
			end_date: new Date('2024-06-03'),
			cover_image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52',
			status: 'published',
			tags: ['romantique', 'paris', 'weekend', 'culture'],
			user_id: users[2]._id,
			places: [], // Sera mis à jour après création des places
			stats: {
				total_places: 0, // Sera calculé automatiquement
				total_photos: 0, // Sera calculé automatiquement
				total_days: 3
			}
		},
		{
			title: 'Road trip en Provence',
			description: 'Découverte des villages perchés et des champs de lavande',
			start_date: new Date('2024-07-15'),
			end_date: new Date('2024-07-22'),
			cover_image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e',
			status: 'published',
			tags: ['provence', 'roadtrip', 'nature', 'lavande'],
			user_id: users[2]._id,
			places: [], // Sera mis à jour après création des places
			stats: {
				total_places: 0, // Sera calculé automatiquement
				total_photos: 0, // Sera calculé automatiquement
				total_days: 8
			}
		},
		{
			title: 'Aventure urbaine à Tokyo',
			description: 'Exploration de la culture japonaise et de la gastronomie locale',
			start_date: new Date('2024-09-10'),
			end_date: new Date('2024-09-17'),
			cover_image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
			status: 'draft',
			tags: ['tokyo', 'japon', 'culture', 'gastronomie'],
			user_id: users[2]._id,
			places: [], // Sera mis à jour après création des places
			stats: {
				total_places: 0, // Sera calculé automatiquement
				total_photos: 0, // Sera calculé automatiquement
				total_days: 8
			}
		}
	]);

	console.log('📍 Création des lieux...');
	// Crée des lieux pour chaque journal
	const places = await Place.create([
		// Journal 1 - Paris (Alice)
		{
			user_id: users[2]._id,
			journal_id: journals[0]._id,
			name: 'Tour Eiffel',
			description: 'Visite du monument emblématique de Paris au coucher du soleil',
			location: {
				type: 'Point',
				coordinates: [2.2945, 48.8584],
				address: 'Champ de Mars, 5 Avenue Anatole France',
				city: 'Paris',
				country: 'France'
			},
			date_visited: new Date('2024-06-01T18:00:00'),
			photos: [
				{
					url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f',
					caption: 'Vue panoramique depuis le Trocadéro',
					uploaded_at: new Date('2024-06-01T18:30:00')
				},
				{
					url: 'https://images.unsplash.com/photo-1549144511-f099e773c147',
					caption: 'Tour Eiffel illuminée la nuit',
					uploaded_at: new Date('2024-06-01T21:00:00')
				}
			],
			rating: 5,
			weather: 'Ensoleillé, 22°C',
			budget: 29,
			tags: ['monument', 'romantique', 'incontournable'],
			is_favorite: true,
			visit_duration: 180,
			notes: 'Absolument magique au coucher du soleil. Prévoir du temps pour les photos !'
		},
		{
			user_id: users[2]._id,
			journal_id: journals[0]._id,
			name: 'Musée du Louvre',
			description: "Découverte des chefs-d'œuvre de l'art mondial",
			location: {
				type: 'Point',
				coordinates: [2.3364, 48.8606],
				address: 'Rue de Rivoli',
				city: 'Paris',
				country: 'France'
			},
			date_visited: new Date('2024-06-02T10:00:00'),
			photos: [
				{
					url: 'https://images.unsplash.com/photo-1566139426617-00ebd8fb5344',
					caption: 'La fameuse pyramide du Louvre',
					uploaded_at: new Date('2024-06-02T10:30:00')
				},
				{
					url: 'https://images.unsplash.com/photo-1541037394196-954d7d5c6915',
					caption: 'La Vénus de Milo dans sa galerie',
					uploaded_at: new Date('2024-06-02T12:00:00')
				}
			],
			rating: 4,
			weather: 'Nuageux, 19°C',
			budget: 17,
			tags: ['musée', 'art', 'culture'],
			is_favorite: false,
			visit_duration: 240,
			notes: 'Immense ! Impossible de tout voir en une journée. La Joconde était bondée.'
		},
		{
			user_id: users[2]._id,
			journal_id: journals[0]._id,
			name: 'Montmartre et Sacré-Cœur',
			description: 'Balade dans les ruelles pittoresques de Montmartre',
			location: {
				type: 'Point',
				coordinates: [2.3431, 48.8867],
				address: '35 Rue du Chevalier de la Barre',
				city: 'Paris',
				country: 'France'
			},
			date_visited: new Date('2024-06-03T14:00:00'),
			photos: [
				{
					url: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52',
					caption: 'Vue depuis la basilique du Sacré-Cœur',
					uploaded_at: new Date('2024-06-03T15:00:00')
				}
			],
			rating: 5,
			weather: 'Ensoleillé, 24°C',
			budget: 0,
			tags: ['basilique', 'vue', 'artistique'],
			is_favorite: true,
			visit_duration: 150,
			notes: 'Ambiance bohème incroyable. Les artistes de rue sont talentueux !'
		},
		{
			user_id: users[2]._id,
			journal_id: journals[0]._id,
			name: 'Seine et Pont des Arts',
			description: 'Promenade romantique le long de la Seine',
			location: {
				type: 'Point',
				coordinates: [2.3374, 48.8584],
				address: 'Pont des Arts',
				city: 'Paris',
				country: 'France'
			},
			date_visited: new Date('2024-06-03T19:00:00'),
			photos: [
				{
					url: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52',
					caption: 'Coucher de soleil sur la Seine',
					uploaded_at: new Date('2024-06-03T19:30:00')
				}
			],
			rating: 4,
			weather: 'Ensoleillé, 21°C',
			budget: 0,
			tags: ['romantique', 'coucher de soleil', 'promenade'],
			is_favorite: false,
			visit_duration: 90,
			notes: 'Parfait pour terminer le séjour en beauté.'
		},

		// Journal 2 - Provence (Bob)
		{
			user_id: users[2]._id,
			journal_id: journals[1]._id,
			name: 'Champs de lavande de Valensole',
			description: 'Promenade dans les champs de lavande en fleurs',
			location: {
				type: 'Point',
				coordinates: [5.8847, 43.8356],
				address: 'Route de Manosque',
				city: 'Valensole',
				country: 'France'
			},
			date_visited: new Date('2024-07-16T08:00:00'),
			photos: [
				{
					url: 'https://images.unsplash.com/photo-1498747946579-bde604cb8f44',
					caption: 'Rangées infinies de lavande',
					uploaded_at: new Date('2024-07-16T09:00:00')
				},
				{
					url: 'https://images.unsplash.com/photo-1508181123296-37f23ceff200',
					caption: 'Abeille butinant dans les champs de lavande',
					uploaded_at: new Date('2024-07-16T10:00:00')
				}
			],
			rating: 5,
			weather: 'Ensoleillé, 28°C',
			budget: 0,
			tags: ['nature', 'lavande', 'photographie'],
			is_favorite: true,
			visit_duration: 120,
			notes: 'Réveil très tôt pour éviter la foule. Le parfum de lavande est enivrant !'
		},
		{
			user_id: users[2]._id,
			journal_id: journals[1]._id,
			name: 'Village de Gordes',
			description: 'Découverte du plus beau village de France perché',
			location: {
				type: 'Point',
				coordinates: [5.1993, 43.9108],
				address: 'Le Village',
				city: 'Gordes',
				country: 'France'
			},
			date_visited: new Date('2024-07-17T11:00:00'),
			photos: [
				{
					url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e',
					caption: 'Vue panoramique sur Gordes',
					uploaded_at: new Date('2024-07-17T11:30:00')
				}
			],
			rating: 5,
			weather: 'Ensoleillé, 30°C',
			budget: 25,
			tags: ['village', 'architecture', 'panorama'],
			is_favorite: true,
			visit_duration: 180,
			notes: 'Architecture en pierre sèche magnifique. Vue imprenable sur la vallée.'
		},

		// Journal 3 - Tokyo (Astrid)
		{
			user_id: users[3]._id,
			journal_id: journals[2]._id,
			name: 'Sanctuaire Senso-ji',
			description: "Temple bouddhiste traditionnel dans le quartier d'Asakusa",
			location: {
				type: 'Point',
				coordinates: [139.7967, 35.7148],
				address: '2 Chome-3-1 Asakusa, Taito City',
				city: 'Tokyo',
				country: 'Japon'
			},
			date_visited: new Date('2024-09-11T14:00:00'),
			photos: [
				{
					url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989',
					caption: 'Porte Kaminarimon emblématique',
					uploaded_at: new Date('2024-09-11T14:30:00')
				},
				{
					url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
					caption: 'Cérémonie traditionnelle au temple',
					uploaded_at: new Date('2024-09-11T15:00:00')
				}
			],
			rating: 4,
			weather: 'Nuageux, 26°C',
			budget: 0,
			tags: ['temple', 'culture', 'spiritualité'],
			is_favorite: true,
			visit_duration: 90,
			notes: 'Très spirituel et paisible malgré la foule de touristes.'
		},
		{
			user_id: users[3]._id,
			journal_id: journals[2]._id,
			name: 'Quartier de Shibuya',
			description: 'Immersion dans le Tokyo moderne et animé',
			location: {
				type: 'Point',
				coordinates: [139.7016, 35.6598],
				address: 'Shibuya Crossing',
				city: 'Tokyo',
				country: 'Japon'
			},
			date_visited: new Date('2024-09-12T20:00:00'),
			photos: [
				{
					url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
					caption: 'Le célèbre carrefour de Shibuya la nuit',
					uploaded_at: new Date('2024-09-12T20:30:00')
				}
			],
			rating: 5,
			weather: 'Clair, 23°C',
			budget: 45,
			tags: ['moderne', 'vie nocturne', 'urbain'],
			is_favorite: true,
			visit_duration: 240,
			notes: 'Énergie incroyable ! Le carrefour est hypnotisant.'
		}
	]);

	console.log('🔗 Mise à jour des relations Journal ↔ Place...');
	// Mise à jour des relations bidirectionnelles
	for (const journal of journals) {
		const journalPlaces = places.filter((place) => place.journal_id.toString() === journal._id.toString());
		journal.places = journalPlaces.map((place) => place._id);

		// Calcul automatique des stats
		journal.stats.total_places = journalPlaces.length;
		journal.stats.total_photos = journalPlaces.reduce((acc, place) => acc + (place.photos?.length || 0), 0);

		await journal.save();
	}

	console.log('✅ Seed terminé avec succès :');
	console.log(`- ${users.length} utilisateurs créés`);
	console.log(`- ${journals.length} journaux créés`);
	console.log(`- ${places.length} lieux créés`);

	console.log('Données de test créées :');
	console.log(
		'Utilisateurs:',
		users.map((u) => ({ email: u.email, name: u.name }))
	);
	console.log(
		'Journaux:',
		journals.map((j) => ({
			title: j.title,
			user: j.user_id,
			places: j.stats.total_places,
			photos: j.stats.total_photos
		}))
	);

	console.log('🔐 Informations de connexion :');
	console.log('ADMIN: admin@memotrip.com | Mot de passe: Admin123!');
	console.log('USER: alice.martin@example.com | Mot de passe: password123');
	console.log('USER: bob.dubois@example.com | Mot de passe: password123');
	console.log('USER: astrid.leon@example.com | Mot de passe: password123');
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
