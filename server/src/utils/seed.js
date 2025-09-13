// src/utils/seed.js
import mongoose from 'mongoose';
import MONGO_URI from '../config/dotenv.config.js';
import User from '../models/User.js';
import Journal from '../models/Journal.js';
import Place from '../models/Place.js';

// Définit tes données de test
const seedData = async () => {
	console.log(' Création des utilisateurs...');
	// Crée des utilisateurs avec mots de passe simples
	const users = await User.create([
		{
			email: 'marie.dupont@memotrip.com',
			password: 'password123',
			name: 'Marie Dupont',
			role: 'user',
			status: 'active',
			areJournalsPublic: true
		},
		{
			email: 'julien.martin@memotrip.com',
			password: 'password123',
			name: 'Julien Martin',
			role: 'user',
			status: 'active',
			areJournalsPublic: true
		},
		{
			email: 'sophie.bernard@memotrip.com',
			password: 'password123',
			name: 'Sophie Bernard',
			role: 'user',
			status: 'active',
			areJournalsPublic: true
		},
		{
			email: 'alex.moreau@memotrip.com',
			password: 'password123',
			name: 'Alexandre Moreau',
			role: 'user',
			status: 'active',
			areJournalsPublic: false
		},
		{
			email: 'emma.rousseau@memotrip.com',
			password: 'password123',
			name: 'Emma Rousseau',
			role: 'user',
			status: 'active',
			areJournalsPublic: true
		},
		{
			email: 'thomas.petit@memotrip.com',
			password: 'password123',
			name: 'Thomas Petit',
			role: 'user',
			status: 'active',
			areJournalsPublic: true
		},
		{
			email: 'clara.garcia@memotrip.com',
			password: 'password123',
			name: 'Clara Garcia',
			role: 'user',
			status: 'active',
			areJournalsPublic: true
		}
	]);

	console.log('📚 Création des journaux...');
	// Crée des journaux de voyage pour différents utilisateurs
	const journals = await Journal.create([
		// Journaux de Marie Dupont (index 1)
		{
			title: 'Week-end romantique à Paris',
			description: 'Trois jours magiques dans la capitale française. Visite des monuments emblématiques et promenades romantiques le long de la Seine.',
			start_date: new Date('2024-06-01'),
			end_date: new Date('2024-06-03'),
			cover_image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?auto=format&fit=crop&q=80&w=800',
			status: 'published',
			is_public: true,
			tags: ['Culture', 'Monument', 'Ville', 'Détente'],
			user_id: users[1]._id,
			places: [],
			stats: {
				total_places: 0,
				total_photos: 0,
				total_days: 3
			}
		},
		{
			title: 'Road trip en Provence',
			description: 'Découverte des villages perchés de Provence et des magnifiques champs de lavande en fleurs.',
			start_date: new Date('2024-07-15'),
			end_date: new Date('2024-07-22'),
			cover_image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&q=80&w=800',
			status: 'published',
			is_public: true,
			tags: ['Nature', 'Détente', 'Ville'],
			user_id: users[1]._id,
			places: [],
			stats: {
				total_places: 0,
				total_photos: 0,
				total_days: 8
			}
		},
		
		// Journaux de Julien Martin (index 2)
		{
			title: 'Aventure urbaine à Tokyo',
			description: 'Immersion totale dans la culture japonaise moderne et traditionnelle. Exploration des quartiers emblématiques de Tokyo.',
			start_date: new Date('2024-09-10'),
			end_date: new Date('2024-09-17'),
			cover_image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800',
			status: 'published',
			is_public: true,
			tags: ['Culture', 'Ville', 'Aventure'],
			user_id: users[2]._id,
			places: [],
			stats: {
				total_places: 0,
				total_photos: 0,
				total_days: 8
			}
		},
		{
			title: 'Tour culinaire du Japon',
			description: 'Découverte de la gastronomie japonaise authentique à travers différentes régions.',
			start_date: new Date('2024-05-12'),
			end_date: new Date('2024-05-26'),
			cover_image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=800',
			status: 'published',
			is_public: true,
			tags: ['Restaurant', 'Culture', 'Aventure'],
			user_id: users[2]._id,
			places: [],
			stats: {
				total_places: 0,
				total_photos: 0,
				total_days: 15
			}
		},
		
		// Journaux de Sophie Bernard (index 3)
		{
			title: 'Les merveilles de la Toscane',
			description: 'Circuit à travers les collines toscanes, les vignobles et les villes d\'art de la Renaissance.',
			start_date: new Date('2024-04-20'),
			end_date: new Date('2024-05-02'),
			cover_image: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&q=80&w=800',
			status: 'published',
			is_public: true,
			tags: ['Culture', 'Architecture', 'Ville'],
			user_id: users[3]._id,
			places: [],
			stats: {
				total_places: 0,
				total_photos: 0,
				total_days: 13
			}
		},
		{
			title: 'Escapade aux Cinque Terre',
			description: 'Randonnées spectaculaires entre les cinq villages colorés suspendus au-dessus de la Méditerranée.',
			start_date: new Date('2024-08-10'),
			end_date: new Date('2024-08-15'),
			cover_image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800',
			status: 'published',
			is_public: true,
			tags: ['Nature', 'Plage', 'Aventure'],
			user_id: users[3]._id,
			places: [],
			stats: {
				total_places: 0,
				total_photos: 0,
				total_days: 6
			}
		},
		
		// Journal d'Alexandre Moreau (index 4) - privé
		{
			title: 'Weekend à Amsterdam',
			description: 'Découverte des canaux et de la culture hollandaise en mode décontracté.',
			start_date: new Date('2024-08-25'),
			end_date: new Date('2024-08-27'),
			cover_image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800',
			status: 'published',
			is_public: false,
			tags: ['Culture', 'Ville', 'Détente'],
			user_id: users[4]._id,
			places: [],
			stats: {
				total_places: 0,
				total_photos: 0,
				total_days: 3
			}
		},
		
		// Journaux d'Emma Rousseau (index 5)
		{
			title: 'Voyage en Islande',
			description: 'Road trip épique à travers les paysages lunaires de l\'Islande. Aurores boréales et sources chaudes.',
			start_date: new Date('2024-03-15'),
			end_date: new Date('2024-03-25'),
			cover_image: 'https://images.unsplash.com/photo-1498747946579-bde604cb8f44?auto=format&fit=crop&q=80&w=800',
			status: 'published',
			is_public: true,
			tags: ['Nature', 'Aventure', 'Montagne'],
			user_id: users[5]._id,
			places: [],
			stats: {
				total_places: 0,
				total_photos: 0,
				total_days: 11
			}
		},
		{
			title: 'Safari au Kenya',
			description: 'Aventure inoubliable dans les parcs nationaux du Kenya à la rencontre de la faune sauvage.',
			start_date: new Date('2024-02-01'),
			end_date: new Date('2024-02-09'),
			cover_image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800',
			status: 'published',
			is_public: true,
			tags: ['Nature', 'Aventure', 'Parc'],
			user_id: users[5]._id,
			places: [],
			stats: {
				total_places: 0,
				total_photos: 0,
				total_days: 9
			}
		},
		
		// Journal de Thomas Petit (index 6)
		{
			title: 'Exploration de la Patagonie',
			description: 'Trek épique dans les montagnes de Patagonie entre Argentine et Chili.',
			start_date: new Date('2024-01-10'),
			end_date: new Date('2024-01-31'),
			cover_image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=800',
			status: 'published',
			is_public: true,
			tags: ['Nature', 'Aventure', 'Montagne'],
			user_id: users[6]._id,
			places: [],
			stats: {
				total_places: 0,
				total_photos: 0,
				total_days: 22
			}
		},
		
		// Journal de Clara Garcia (index 7)
		{
			title: 'Les plages paradisiaques des Maldives',
			description: 'Séjour de rêve dans un resort sur pilotis aux Maldives. Snorkeling et détente absolue.',
			start_date: new Date('2024-07-01'),
			end_date: new Date('2024-07-08'),
			cover_image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=800',
			status: 'published',
			is_public: true,
			tags: ['Nature', 'Plage', 'Détente'],
			user_id: users[7]._id,
			places: [],
			stats: {
				total_places: 0,
				total_photos: 0,
				total_days: 8
			}
		}
	]);

	console.log('📍 Création des lieux...');
	// Crée des lieux détaillés pour chaque journal et utilisateur
	const places = await Place.create([
		// MARIE DUPONT - Paris
		{
			user_id: users[1]._id,
			journal_id: journals[0]._id,
			name: 'Tour Eiffel',
			description: 'Visite du monument emblématique de Paris au coucher du soleil. Vue panoramique exceptionnelle depuis le deuxième étage.',
			status: 'visited',
			location: {
				type: 'Point',
				coordinates: [2.2945, 48.8584],
				address: 'Champ de Mars, 5 Avenue Anatole France',
				city: 'Paris',
				country: 'France'
			},
			date_visited: new Date('2024-06-01T18:00:00'),
			start_date: new Date('2024-06-01T18:00:00'),
			end_date: new Date('2024-06-01T21:00:00'),
			photos: [
				{
					url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=800',
					caption: 'Vue panoramique depuis le Trocadéro',
					uploadedAt: new Date('2024-06-01T18:30:00')
				},
				{
					url: 'https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&q=80&w=800',
					caption: 'Tour Eiffel illuminée la nuit',
					uploadedAt: new Date('2024-06-01T21:00:00')
				}
			],
			rating: 5,
			weather: '☀️ Ensoleillé',
			budget: 29,
			tags: ['Monument', 'Culture', 'Architecture'],
			is_favorite: true,
			visit_duration: 180,
			notes: 'Absolument magique au coucher du soleil. Prévoir du temps pour les photos ! Les ascenseurs peuvent avoir de la queue.',
			moderation_status: 'approved'
		},
		{
			user_id: users[1]._id,
			journal_id: journals[0]._id,
			name: 'Musée du Louvre',
			description: 'Découverte des chefs-d\'œuvre de l\'art mondial. Collections impressionnantes de la Renaissance et de l\'Antiquité.',
			status: 'visited',
			location: {
				type: 'Point',
				coordinates: [2.3364, 48.8606],
				address: 'Rue de Rivoli',
				city: 'Paris',
				country: 'France'
			},
			date_visited: new Date('2024-06-02T10:00:00'),
			start_date: new Date('2024-06-02T10:00:00'),
			end_date: new Date('2024-06-02T14:00:00'),
			photos: [
				{
					url: 'https://images.unsplash.com/photo-1566139426617-00ebd8fb5344?auto=format&fit=crop&q=80&w=800',
					caption: 'La fameuse pyramide du Louvre',
					uploadedAt: new Date('2024-06-02T10:30:00')
				},
				{
					url: 'https://images.unsplash.com/photo-1541037394196-954d7d5c6915?auto=format&fit=crop&q=80&w=800',
					caption: 'La Joconde dans sa salle',
					uploadedAt: new Date('2024-06-02T12:00:00')
				}
			],
			rating: 4,
			weather: '☁️ Nuageux',
			budget: 17,
			tags: ['Musée', 'Culture', 'Art'],
			is_favorite: false,
			visit_duration: 240,
			notes: 'Immense ! Impossible de tout voir en une journée. La Joconde était bondée mais ça vaut le détour.',
			moderation_status: 'approved'
		},
		{
			user_id: users[1]._id,
			journal_id: journals[0]._id,
			name: 'Montmartre et Sacré-Cœur',
			description: 'Balade dans les ruelles pittoresques de Montmartre. Ambiance bohème et vue exceptionnelle sur Paris.',
			status: 'visited',
			location: {
				type: 'Point',
				coordinates: [2.3431, 48.8867],
				address: '35 Rue du Chevalier de la Barre',
				city: 'Paris',
				country: 'France'
			},
			date_visited: new Date('2024-06-03T14:00:00'),
			start_date: new Date('2024-06-03T14:00:00'),
			end_date: new Date('2024-06-03T17:00:00'),
			photos: [
				{
					url: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?auto=format&fit=crop&q=80&w=800',
					caption: 'Vue depuis la basilique du Sacré-Cœur',
					uploadedAt: new Date('2024-06-03T15:00:00')
				}
			],
			rating: 5,
			weather: 'Ensoleillé',
			budget: 0,
			tags: ['Culture', 'Architecture', 'Ville'],
			is_favorite: true,
			visit_duration: 180,
			notes: 'Ambiance bohème incroyable. Les artistes de rue sont talentueux ! Ne pas manquer la Place du Tertre.',
			moderation_status: 'approved'
		},

		// MARIE DUPONT - Provence
		{
			user_id: users[1]._id,
			journal_id: journals[1]._id,
			name: 'Champs de lavande de Valensole',
			description: 'Promenade matinale dans les champs de lavande en fleurs. Parfum enivrant et couleurs exceptionnelles.',
			status: 'visited',
			location: {
				type: 'Point',
				coordinates: [5.8847, 43.8356],
				address: 'Route de Manosque',
				city: 'Valensole',
				country: 'France'
			},
			date_visited: new Date('2024-07-16T08:00:00'),
			start_date: new Date('2024-07-16T08:00:00'),
			end_date: new Date('2024-07-16T10:00:00'),
			photos: [
				{
					url: 'https://images.unsplash.com/photo-1498747946579-bde604cb8f44?auto=format&fit=crop&q=80&w=800',
					caption: 'Rangées infinies de lavande au petit matin',
					uploadedAt: new Date('2024-07-16T09:00:00')
				},
				{
					url: 'https://images.unsplash.com/photo-1508181123296-37f23ceff200?auto=format&fit=crop&q=80&w=800',
					caption: 'Abeille butinant dans les champs',
					uploadedAt: new Date('2024-07-16T10:00:00')
				}
			],
			rating: 5,
			weather: '☀️ Ensoleillé',
			budget: 0,
			tags: ['Nature', 'Plage'],
			is_favorite: true,
			visit_duration: 120,
			notes: 'Réveil à 6h pour éviter la foule et avoir la meilleure lumière. Le parfum de lavande est enivrant !',
			moderation_status: 'approved'
		},
		{
			user_id: users[1]._id,
			journal_id: journals[1]._id,
			name: 'Village de Gordes',
			description: 'Découverte du plus beau village de France perché. Architecture en pierre sèche remarquable.',
			status: 'visited',
			location: {
				type: 'Point',
				coordinates: [5.1993, 43.9108],
				address: 'Le Village',
				city: 'Gordes',
				country: 'France'
			},
			date_visited: new Date('2024-07-17T11:00:00'),
			start_date: new Date('2024-07-17T11:00:00'),
			end_date: new Date('2024-07-17T14:00:00'),
			photos: [
				{
					url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&q=80&w=800',
					caption: 'Vue panoramique sur Gordes perché',
					uploadedAt: new Date('2024-07-17T11:30:00')
				}
			],
			rating: 5,
			weather: '☀️ Ensoleillé',
			budget: 25,
			tags: ['Ville', 'Architecture', 'Culture'],
			is_favorite: true,
			visit_duration: 180,
			notes: 'Architecture en pierre sèche magnifique. Vue imprenable sur la vallée du Luberon. Petit déjeuner au café du village.',
			moderation_status: 'approved'
		},

		// JULIEN MARTIN - Tokyo
		{
			user_id: users[2]._id,
			journal_id: journals[2]._id,
			name: 'Sanctuaire Senso-ji',
			description: 'Temple bouddhiste traditionnel dans le quartier d\'Asakusa. Spiritualité et traditions ancestrales.',
			status: 'visited',
			location: {
				type: 'Point',
				coordinates: [139.7967, 35.7148],
				address: '2 Chome-3-1 Asakusa, Taito City',
				city: 'Tokyo',
				country: 'Japon'
			},
			date_visited: new Date('2024-09-11T14:00:00'),
			start_date: new Date('2024-09-11T14:00:00'),
			end_date: new Date('2024-09-11T15:30:00'),
			photos: [
				{
					url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80&w=800',
					caption: 'Porte Kaminarimon emblématique',
					uploadedAt: new Date('2024-09-11T14:30:00')
				},
				{
					url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800',
					caption: 'Cérémonie traditionnelle au temple',
					uploadedAt: new Date('2024-09-11T15:00:00')
				}
			],
			rating: 4,
			weather: '☁️ Nuageux',
			budget: 0,
			tags: ['Culture', 'Architecture', 'Monument'],
			is_favorite: true,
			visit_duration: 90,
			notes: 'Très spirituel et paisible malgré la foule de touristes. Les omamori (amulettes) sont magnifiques.',
			moderation_status: 'approved'
		},
		{
			user_id: users[2]._id,
			journal_id: journals[2]._id,
			name: 'Quartier de Shibuya',
			description: 'Immersion dans le Tokyo moderne et électrisant. Le carrefour le plus célèbre du monde.',
			status: 'visited',
			location: {
				type: 'Point',
				coordinates: [139.7016, 35.6598],
				address: 'Shibuya Crossing',
				city: 'Tokyo',
				country: 'Japon'
			},
			date_visited: new Date('2024-09-12T20:00:00'),
			start_date: new Date('2024-09-12T20:00:00'),
			end_date: new Date('2024-09-12T23:00:00'),
			photos: [
				{
					url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=800',
					caption: 'Le célèbre carrefour de Shibuya la nuit',
					uploadedAt: new Date('2024-09-12T20:30:00')
				}
			],
			rating: 5,
			weather: '☀️ Ensoleillé',
			budget: 45,
			tags: ['Ville', 'Shopping', 'Culture'],
			is_favorite: true,
			visit_duration: 180,
			notes: 'Énergie incroyable ! Le carrefour est hypnotisant. Montée au Shibuya Sky pour la vue panoramique.',
			moderation_status: 'approved'
		},

		// JULIEN MARTIN - Tour culinaire Japon
		{
			user_id: users[2]._id,
			journal_id: journals[3]._id,
			name: 'Marché de Tsukiji',
			description: 'Découverte du plus célèbre marché aux poissons du monde. Fraîcheur exceptionnelle et ambiance authentique.',
			status: 'visited',
			location: {
				type: 'Point',
				coordinates: [139.7709, 35.6650],
				address: 'Tsukiji Outer Market',
				city: 'Tokyo',
				country: 'Japon'
			},
			date_visited: new Date('2024-05-13T05:00:00'),
			start_date: new Date('2024-05-13T05:00:00'),
			end_date: new Date('2024-05-13T07:00:00'),
			photos: [
				{
					url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&q=80&w=800',
					caption: 'Vente aux enchères de thons géants',
					uploadedAt: new Date('2024-05-13T05:30:00')
				},
				{
					url: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&q=80&w=800',
					caption: 'Petit-déjeuner sushi traditionnel',
					uploadedAt: new Date('2024-05-13T06:30:00')
				}
			],
			rating: 5,
			weather: '🌧️ Pluvieux',
			budget: 35,
			tags: ['Restaurant', 'Culture', 'Shopping'],
			is_favorite: true,
			visit_duration: 120,
			notes: 'Réveil à 4h du matin mais ça vaut absolument le coup ! Les sushis pour le petit-déjeuner sont une révélation.',
			moderation_status: 'approved'
		},

		// SOPHIE BERNARD - Toscane
		{
			user_id: users[3]._id,
			journal_id: journals[4]._id,
			name: 'Florence - Duomo',
			description: 'Visite de la cathédrale emblématique de Florence. Chef-d\'œuvre de l\'architecture Renaissance.',
			status: 'visited',
			location: {
				type: 'Point',
				coordinates: [11.2558, 43.7731],
				address: 'Piazza del Duomo',
				city: 'Florence',
				country: 'Italie'
			},
			date_visited: new Date('2024-04-21T09:00:00'),
			start_date: new Date('2024-04-21T09:00:00'),
			end_date: new Date('2024-04-21T12:00:00'),
			photos: [
				{
					url: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&q=80&w=800',
					caption: 'La magnifique coupole de Brunelleschi',
					uploadedAt: new Date('2024-04-21T10:00:00')
				},
				{
					url: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&q=80&w=800',
					caption: 'Vue depuis le campanile de Giotto',
					uploadedAt: new Date('2024-04-21T11:30:00')
				}
			],
			rating: 5,
			weather: 'Ensoleillé',
			budget: 20,
			tags: ['Architecture', 'Culture', 'Monument'],
			is_favorite: true,
			visit_duration: 180,
			notes: 'Architecture Renaissance à couper le souffle. L\'ascension de la coupole est sportive mais la vue vaut l\'effort !',
			moderation_status: 'approved'
		},
		{
			user_id: users[3]._id,
			journal_id: journals[4]._id,
			name: 'Vignobles du Chianti',
			description: 'Dégustation de vins dans les collines du Chianti. Paysages de carte postale et vins d\'exception.',
			status: 'visited',
			location: {
				type: 'Point',
				coordinates: [11.3059, 43.4818],
				address: 'Strada del Chianti',
				city: 'Greve in Chianti',
				country: 'Italie'
			},
			date_visited: new Date('2024-04-24T14:00:00'),
			start_date: new Date('2024-04-24T14:00:00'),
			end_date: new Date('2024-04-24T19:00:00'),
			photos: [
				{
					url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800',
					caption: 'Vignobles à perte de vue',
					uploadedAt: new Date('2024-04-24T15:00:00')
				},
				{
					url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800',
					caption: 'Dégustation dans une cave centenaire',
					uploadedAt: new Date('2024-04-24T17:00:00')
				}
			],
			rating: 5,
			weather: 'Ensoleillé',
			budget: 65,
			tags: ['Nature', 'Détente'],
			is_favorite: true,
			visit_duration: 300,
			notes: 'Expérience œnotouristique exceptionnelle. Les paysages sont de toute beauté et les vins remarquables.',
			moderation_status: 'approved'
		},

		// EMMA ROUSSEAU - Islande
		{
			user_id: users[5]._id,
			journal_id: journals[7]._id,
			name: 'Geysir et Strokkur',
			description: 'Spectacle naturel fascinant des geysers islandais. Puissance brute de la géothermie.',
			status: 'visited',
			location: {
				type: 'Point',
				coordinates: [-20.3014, 64.3128],
				address: 'Haukadalur',
				city: 'Haukadalur',
				country: 'Islande'
			},
			date_visited: new Date('2024-03-16T11:00:00'),
			start_date: new Date('2024-03-16T11:00:00'),
			end_date: new Date('2024-03-16T12:30:00'),
			photos: [
				{
					url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=800',
					caption: 'Éruption spectaculaire du geyser Strokkur',
					uploadedAt: new Date('2024-03-16T11:30:00')
				},
				{
					url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800',
					caption: 'Paysage lunaire autour des sources chaudes',
					uploadedAt: new Date('2024-03-16T12:00:00')
				}
			],
			rating: 5,
			weather: 'Nuageux',
			budget: 0,
			tags: ['Nature', 'Aventure'],
			is_favorite: true,
			visit_duration: 90,
			notes: 'Phénomène naturel fascinant ! Strokkur jaillit régulièrement toutes les 5-10 minutes. Prévoir des vêtements chauds.',
			moderation_status: 'approved'
		},
		{
			user_id: users[5]._id,
			journal_id: journals[7]._id,
			name: 'Aurores boréales à Reykjavik',
			description: 'Chasse nocturne aux aurores boréales dans la campagne islandaise. Spectacle magique et inoubliable.',
			status: 'visited',
			location: {
				type: 'Point',
				coordinates: [-21.9426, 64.1466],
				address: 'Environs de Reykjavik',
				city: 'Reykjavik',
				country: 'Islande'
			},
			date_visited: new Date('2024-03-19T22:00:00'),
			start_date: new Date('2024-03-19T22:00:00'),
			end_date: new Date('2024-03-20T04:00:00'),
			photos: [
				{
					url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=800',
					caption: 'Danse mystique des aurores vertes',
					uploadedAt: new Date('2024-03-20T02:00:00')
				}
			],
			rating: 5,
			weather: 'Clair',
			budget: 120,
			tags: ['Nature', 'Aventure'],
			is_favorite: true,
			visit_duration: 360,
			notes: 'Expérience absolument magique ! Nous avons eu une chance incroyable avec la météo. Photos à couper le souffle.',
			moderation_status: 'approved'
		},

		// THOMAS PETIT - Patagonie
		{
			user_id: users[6]._id,
			journal_id: journals[9]._id,
			name: 'Torres del Paine',
			description: 'Trek mythique dans le parc national Torres del Paine. Paysages grandioses de Patagonie.',
			status: 'visited',
			location: {
				type: 'Point',
				coordinates: [-73.0524, -50.9423],
				address: 'Parque Nacional Torres del Paine',
				city: 'Torres del Paine',
				country: 'Chili'
			},
			date_visited: new Date('2024-01-15T06:00:00'),
			start_date: new Date('2024-01-15T06:00:00'),
			end_date: new Date('2024-01-15T18:00:00'),
			photos: [
				{
					url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=800',
					caption: 'Les tours emblématiques au lever du soleil',
					uploadedAt: new Date('2024-01-15T07:00:00')
				},
				{
					url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800',
					caption: 'Randonnée dans les steppes patagonnes',
					uploadedAt: new Date('2024-01-15T14:00:00')
				}
			],
			rating: 5,
			weather: 'Venteux',
			budget: 0,
			tags: ['Nature', 'Aventure', 'Montagne'],
			is_favorite: true,
			visit_duration: 720,
			notes: 'Trek exigeant mais absolument grandiose. Les paysages sont à couper le souffle. Prévoir équipement grand froid.',
			moderation_status: 'approved'
		},

		// CLARA GARCIA - Maldives
		{
			user_id: users[7]._id,
			journal_id: journals[10]._id,
			name: 'Resort Soneva Jani',
			description: 'Séjour paradisiaque dans un resort sur pilotis. Luxe absolu et eaux cristallines.',
			status: 'visited',
			location: {
				type: 'Point',
				coordinates: [72.8453, 5.2383],
				address: 'Medhufaru Island',
				city: 'Noonu Atoll',
				country: 'Maldives'
			},
			date_visited: new Date('2024-07-02T14:00:00'),
			start_date: new Date('2024-07-02T14:00:00'),
			end_date: new Date('2024-07-07T12:00:00'),
			photos: [
				{
					url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=800',
					caption: 'Villa sur pilotis au coucher du soleil',
					uploadedAt: new Date('2024-07-02T19:00:00')
				},
				{
					url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800',
					caption: 'Snorkeling dans le récif corallien',
					uploadedAt: new Date('2024-07-04T10:00:00')
				}
			],
			rating: 5,
			weather: 'Tropical',
			budget: 2500,
			tags: ['Nature', 'Plage', 'Détente'],
			is_favorite: true,
			visit_duration: 7200,
			notes: 'Séjour absolument paradisiaque ! Le snorkeling est exceptionnel avec une biodiversité incroyable. Service impeccable.',
			moderation_status: 'approved'
		},
		{
			user_id: users[0]._id,
			journal_id: journals[0]._id,
			name: 'Musée du Louvre',
			description: 'Visite du plus grand musée d\'art au monde',
			location: {
				type: 'Point',
				coordinates: [2.3376, 48.8606],
				address: 'Rue de Rivoli',
				city: 'Paris',
				country: 'France'
			},
			date_visited: new Date('2024-06-02T10:00:00'),
			photos: [
				{
					url: 'https://images.unsplash.com/photo-1566139852-74ee2dd7ad21',
					caption: 'La pyramide du Louvre',
					uploaded_at: new Date('2024-06-02T11:00:00')
				}
			],
			category: 'cultural',
			rating: 4,
			weather: 'Nuageux',
			budget: 17,
			tags: ['Musée', 'Culture', 'Art'],
			is_favorite: false,
			visit_duration: 240,
			notes: 'Immense ! Impossible de tout voir en une journée. La Joconde était bondée.',
			moderation_status: 'approved'
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
			weather: 'Ensoleillé',
			budget: 0,
			tags: ['Culture', 'Architecture', 'Ville'],
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
			weather: 'Ensoleillé',
			budget: 0,
			tags: ['Culture', 'Détente', 'Ville'],
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
			weather: 'Ensoleillé',
			budget: 0,
			tags: ['Nature', 'Plage'],
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
			weather: 'Ensoleillé',
			budget: 25,
			tags: ['Ville', 'Architecture', 'Culture'],
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
			weather: 'Nuageux',
			budget: 0,
			tags: ['Culture', 'Architecture', 'Monument'],
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
			weather: 'Clair',
			budget: 45,
			tags: ['Ville', 'Shopping', 'Culture'],
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
