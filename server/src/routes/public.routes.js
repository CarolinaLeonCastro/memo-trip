import express from 'express';
import Journal from '../models/Journal.js';
import Place from '../models/Place.js';
import User from '../models/User.js';
import logger from '../config/logger.config.js';

const router = express.Router();

// Route pour récupérer les journaux publics (accessible aux visiteurs)
export const getPublicJournals = async (req, res) => {
	try {
		const { page = 1, limit = 10, search } = req.query;
		const skip = (page - 1) * limit;

		const filter = {
			is_public: true,
			status: 'published'
		};

		if (search) {
			filter.$or = [
				{ title: { $regex: search, $options: 'i' } },
				{ description: { $regex: search, $options: 'i' } },
				{ tags: { $in: [new RegExp(search, 'i')] } }
			];
		}

		const journals = await Journal.find(filter)
			.populate({
				path: 'user_id',
				select: 'name avatar areJournalsPublic',
				match: { areJournalsPublic: true }
			})
			.populate({
				path: 'places',
				select: 'name location photos status',
				options: { limit: 3 } // Limiter à 3 lieux pour l'aperçu
			})
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit));

		// Filtrer les journaux dont l'utilisateur n'a pas areJournalsPublic: true
		const validJournals = journals.filter((journal) => journal.user_id !== null);

		// Ajouter les samplePlaces pour chaque journal
		const journalsWithSamplePlaces = validJournals.map((journal) => {
			const journalObj = journal.toObject();

			// Créer l'aperçu des lieux (samplePlaces)
			const samplePlaces = (journalObj.places || []).slice(0, 3).map((place) => ({
				_id: place._id,
				name: place.name,
				city: place.location?.city || '',
				country: place.location?.country || '',
				coverImage: place.photos && place.photos.length > 0 ? place.photos[0] : null,
				status: place.status || 'visited'
			}));

			// Compter les lieux restants pour le compteur +N
			const remainingPlacesCount = Math.max(0, (journalObj.stats?.total_places || journalObj.places?.length || 0) - 3);

			return {
				...journalObj,
				samplePlaces,
				remainingPlacesCount,
				places: undefined // Supprimer les places complètes pour économiser la bande passante
			};
		});

		// Recalculer le total avec les utilisateurs qui ont areJournalsPublic: true
		const totalValidJournals = await Journal.aggregate([
			{
				$match: filter
			},
			{
				$lookup: {
					from: 'users',
					localField: 'user_id',
					foreignField: '_id',
					as: 'user'
				}
			},
			{
				$match: {
					'user.areJournalsPublic': true
				}
			},
			{
				$count: 'total'
			}
		]);

		const total = totalValidJournals.length > 0 ? totalValidJournals[0].total : 0;

		res.json({
			success: true,
			data: {
				journals: journalsWithSamplePlaces,
				pagination: {
					page: parseInt(page),
					limit: parseInt(limit),
					total,
					pages: Math.ceil(total / limit)
				}
			}
		});
	} catch (error) {
		logger.error('Error fetching public journals:', error);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la récupération des journaux publics'
		});
	}
};

// Route pour récupérer un journal public par ID avec filtres pour les lieux
export const getPublicJournalById = async (req, res) => {
	try {
		const { id } = req.params;
		const { q, tag, sort = 'recent', page = 1, limit = 20 } = req.query;
		console.log('🔎 API getPublicJournalById appelée pour ID:', id, 'avec filtres:', { q, tag, sort, page, limit });

		// D'abord récupérer le journal de base
		const journal = await Journal.findOne({
			_id: id,
			is_public: true,
			status: 'published'
		})
			.populate({
				path: 'user_id',
				select: 'name avatar areJournalsPublic',
				match: { areJournalsPublic: true }
			});

		console.log('🔎 Journal trouvé:', !!journal);
		console.log('🔎 User_id populé:', !!journal?.user_id);
		console.log('🔎 User areJournalsPublic:', journal?.user_id?.areJournalsPublic);

		if (!journal || !journal.user_id) {
			console.log('❌ Journal non accessible:', { journal: !!journal, user_id: !!journal?.user_id });
			return res.status(404).json({
				success: false,
				message: 'Journal public non trouvé'
			});
		}

		// Créer le filtre pour les lieux
		const placeFilter = { journal_id: journal._id };

		// Filtrage par recherche textuelle
		if (q && q.trim()) {
			placeFilter.$or = [
				{ name: { $regex: q.trim(), $options: 'i' } },
				{ description: { $regex: q.trim(), $options: 'i' } }
			];
		}

		// Filtrage par tag
		if (tag && tag.trim()) {
			placeFilter.tags = { $in: [new RegExp(tag.trim(), 'i')] };
		}

		// Définir le tri
		let sortOptions = {};
		switch (sort) {
			case 'likes':
				sortOptions = { rating: -1, createdAt: -1 }; // Trier par rating comme proxy pour les likes
				break;
			case 'photos':
				sortOptions = { 'photos.length': -1, createdAt: -1 }; // Trier par nombre de photos
				break;
			case 'recent':
			default:
				sortOptions = { date_visited: -1, visitedAt: -1, createdAt: -1 };
				break;
		}

		// Pagination
		const skip = (parseInt(page) - 1) * parseInt(limit);

		// Récupérer les lieux avec filtres et pagination
		const places = await Place.find(placeFilter)
			.select(
				'name description location photos tags rating date_visited visitedAt start_date end_date status createdAt'
			)
			.sort(sortOptions)
			.skip(skip)
			.limit(parseInt(limit));

		// Compter le total pour la pagination
		const totalPlaces = await Place.countDocuments(placeFilter);

		// Formater les lieux pour l'API publique
		const formattedPlaces = places.map((place) => ({
			_id: place._id,
			name: place.name,
			city: place.location?.city || '',
			country: place.location?.country || '',
			description: place.description ? place.description.substring(0, 300) : '', // Limiter à 300 caractères
			coverImage: place.photos && place.photos.length > 0 ? place.photos[0] : null,
			photosCount: place.photos ? place.photos.length : 0,
			rating: place.rating,
			dateVisited: place.date_visited || place.visitedAt,
			visitPeriod:
				place.start_date && place.end_date
					? {
							start: place.start_date,
							end: place.end_date
					  }
					: null,
			tags: place.tags || [],
			status: place.status || 'visited',
			coordinates: place.location?.coordinates || []
		}));

		// Réponse avec journal et lieux paginés
		const response = {
			...journal.toObject(),
			places: formattedPlaces,
			placesMetadata: {
				total: totalPlaces,
				page: parseInt(page),
				limit: parseInt(limit),
				totalPages: Math.ceil(totalPlaces / parseInt(limit)),
				hasMore: skip + places.length < totalPlaces
			}
		};

		console.log('✅ Journal accessible, retour des données avec', formattedPlaces.length, 'lieux');
		res.json({
			success: true,
			data: response
		});
	} catch (error) {
		console.error('❌ Erreur getPublicJournalById:', error);
		logger.error('Error fetching public journal:', error);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la récupération du journal'
		});
	}
};

// Route pour récupérer un lieu public par ID
export const getPublicPlaceById = async (req, res) => {
	try {
		const { id } = req.params;
		console.log('🔎 API getPublicPlaceById appelée pour ID:', id);

		const place = await Place.findById(id)
			.populate({
				path: 'user_id',
				select: 'name avatar areJournalsPublic',
				match: { areJournalsPublic: true }
			})
			.populate({
				path: 'journal_id',
				select: 'title description is_public status'
			});

		console.log('🔎 Lieu trouvé:', !!place);
		console.log('🔎 User_id populé:', !!place?.user_id);
		console.log('🔎 User areJournalsPublic:', place?.user_id?.areJournalsPublic);

		if (!place || !place.user_id) {
			console.log('❌ Lieu non accessible:', { place: !!place, user_id: !!place?.user_id });
			return res.status(404).json({
				success: false,
				message: 'Lieu public non trouvé'
			});
		}

		// Vérifier que le journal parent est public (si applicable)
		if (place.journal_id && (!place.journal_id.is_public || place.journal_id.status !== 'published')) {
			return res.status(404).json({
				success: false,
				message: 'Lieu non accessible'
			});
		}

		console.log('✅ Lieu accessible, retour des données');
		res.json({
			success: true,
			data: place
		});
	} catch (error) {
		console.error('❌ Erreur getPublicPlaceById:', error);
		logger.error('Error fetching public place:', error);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la récupération du lieu'
		});
	}
};

// Route pour récupérer les statistiques publiques
export const getPublicStats = async (req, res) => {
	try {
		// Compter les journaux publics avec des utilisateurs qui ont areJournalsPublic: true
		const totalPublicJournalsResult = await Journal.aggregate([
			{
				$match: {
					is_public: true,
					status: 'published'
				}
			},
			{
				$lookup: {
					from: 'users',
					localField: 'user_id',
					foreignField: '_id',
					as: 'user'
				}
			},
			{
				$match: {
					'user.areJournalsPublic': true
				}
			},
			{
				$count: 'total'
			}
		]);

		const totalPublicJournals = totalPublicJournalsResult.length > 0 ? totalPublicJournalsResult[0].total : 0;

		// Compter tous les lieux des utilisateurs publics
		const totalPublicPlacesResult = await Place.aggregate([
			{
				$lookup: {
					from: 'users',
					localField: 'user_id',
					foreignField: '_id',
					as: 'user'
				}
			},
			{
				$match: {
					'user.areJournalsPublic': true
				}
			},
			{
				$count: 'total'
			}
		]);

		const totalPublicPlaces = totalPublicPlacesResult.length > 0 ? totalPublicPlacesResult[0].total : 0;

		// Journaux les plus récents
		const recentJournals = await Journal.find({
			is_public: true,
			status: 'published'
		})
			.populate({
				path: 'user_id',
				select: 'name avatar areJournalsPublic',
				match: { areJournalsPublic: true }
			})
			.select('title description cover_image createdAt user_id stats')
			.sort({ createdAt: -1 })
			.limit(10); // Récupérer plus pour compenser le filtrage

		// Filtrer et limiter à 5
		const validRecentJournals = recentJournals.filter((journal) => journal.user_id !== null).slice(0, 5);

		res.json({
			success: true,
			data: {
				stats: {
					totalJournals: totalPublicJournals,
					totalPlaces: totalPublicPlaces
				},
				recentJournals: validRecentJournals
			}
		});
	} catch (error) {
		logger.error('Error fetching public stats:', error);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la récupération des statistiques publiques'
		});
	}
};

// Route pour récupérer les posts pour la page découverte
export const getDiscoverPosts = async (req, res) => {
	try {
		console.log('🔎 API getDiscoverPosts appelée avec:', req.query);
		const { page = 1, limit = 12, search, tags, type = 'all', sort = 'recent' } = req.query;
		const skip = (page - 1) * limit;

		let posts = [];
		console.log('🔎 Type de contenu demandé:', type);

		if (type === 'all' || type === 'journal') {
			// Récupérer les journaux publics
			const journalFilter = {
				is_public: true,
				status: 'published'
			};

			if (search) {
				journalFilter.$or = [
					{ title: { $regex: search, $options: 'i' } },
					{ description: { $regex: search, $options: 'i' } }
				];
			}

			if (tags && tags.length > 0) {
				const tagArray = Array.isArray(tags) ? tags : tags.split(',');
				journalFilter.tags = { $in: tagArray };
			}

			console.log('🔎 Filtre journal appliqué:', journalFilter);

			const journals = await Journal.find(journalFilter)
				.populate({
					path: 'user_id',
					select: 'name avatar areJournalsPublic',
					match: { areJournalsPublic: true }
				})
				.populate({
					path: 'places',
					select: 'name location photos status',
					options: { limit: 3 } // Limiter à 3 lieux pour l'aperçu
				})
				.select('title description cover_image tags start_date end_date stats createdAt')
				.sort({ createdAt: sort === 'recent' ? -1 : 1 })
				.limit(parseInt(limit));

			console.log('🔎 Journaux trouvés avant filtrage:', journals.length);
			console.log(
				'🔎 Détails des journaux:',
				journals.map((j) => ({
					title: j.title,
					is_public: j.is_public,
					status: j.status,
					user_populated: !!j.user_id,
					user_areJournalsPublic: j.user_id?.areJournalsPublic
				}))
			);

			const validJournals = journals.filter((journal) => journal.user_id !== null);
			console.log('🔎 Journaux valides après filtrage user:', validJournals.length);

			posts = posts.concat(
				validJournals.map((journal) => {
					// Créer l'aperçu des lieux (samplePlaces)
					const samplePlaces = (journal.places || []).slice(0, 3).map((place) => ({
						_id: place._id,
						name: place.name,
						city: place.location?.city || '',
						country: place.location?.country || '',
						coverImage: place.photos && place.photos.length > 0 ? place.photos[0] : null,
						status: place.status || 'visited'
					}));

					// Compter les lieux restants
					const remainingPlacesCount = Math.max(0, (journal.stats?.total_places || journal.places?.length || 0) - 3);

					return {
						_id: journal._id,
						type: 'journal',
						user: {
							_id: journal.user_id._id,
							name: journal.user_id.name,
							avatar: journal.user_id.avatar
						},
						content: {
							_id: journal._id,
							title: journal.title,
							description: journal.description,
							cover_image: journal.cover_image,
							tags: journal.tags,
							places_count: journal.stats?.total_places || 0,
							start_date: journal.start_date,
							end_date: journal.end_date,
							samplePlaces,
							remainingPlacesCount
						},
						likes: 0, // À implémenter avec un système de likes
						comments: 0, // À implémenter avec un système de commentaires
						views: 0, // À implémenter avec un système de vues
						is_liked: false,
						created_at: journal.createdAt
					};
				})
			);
		}

		// AJOUTER LES LIEUX PUBLICS
		if (type === 'all' || type === 'place') {
			console.log('🔎 Récupération des lieux publics...');

			const placeFilter = {};
			// Pas de modération : tous les lieux des utilisateurs publics sont visibles

			if (search) {
				placeFilter.$or = [
					{ name: { $regex: search, $options: 'i' } },
					{ description: { $regex: search, $options: 'i' } }
				];
			}

			if (tags && tags.length > 0) {
				const tagArray = Array.isArray(tags) ? tags : tags.split(',');
				placeFilter.tags = { $in: tagArray };
			}

			console.log('🔎 Filtre lieu appliqué:', placeFilter);

			const places = await Place.find(placeFilter)
				.populate({
					path: 'user_id',
					select: 'name avatar areJournalsPublic',
					match: { areJournalsPublic: true }
				})
				.select('name description photos location tags rating date_visited visitedAt budget notes createdAt user_id')
				.sort({ createdAt: sort === 'recent' ? -1 : 1 })
				.limit(parseInt(limit));

			console.log('🔎 Lieux trouvés avant filtrage:', places.length);
			console.log(
				'🔎 Détails des lieux:',
				places.map((p) => ({
					name: p.name,
					user_populated: !!p.user_id,
					user_areJournalsPublic: p.user_id?.areJournalsPublic
				}))
			);

			const validPlaces = places.filter((place) => place.user_id !== null);
			console.log('🔎 Lieux valides après filtrage user:', validPlaces.length);

			posts = posts.concat(
				validPlaces.map((place) => ({
					_id: place._id,
					type: 'place',
					user: {
						_id: place.user_id._id,
						name: place.user_id.name,
						avatar: place.user_id.avatar
					},
					content: {
						_id: place._id,
						name: place.name,
						description: place.description,
						city: place.location?.city,
						country: place.location?.country,
						photos: place.photos || [],
						tags: place.tags,
						rating: place.rating,
						location: {
							latitude: place.location?.coordinates[1],
							longitude: place.location?.coordinates[0]
						},
						date_visited: place.date_visited || place.visitedAt
					},
					likes: 0,
					comments: 0,
					views: 0,
					is_liked: false,
					created_at: place.createdAt
				}))
			);
		}

		// Trier et paginer les résultats
		posts.sort((a, b) => {
			if (sort === 'recent') {
				return new Date(b.created_at) - new Date(a.created_at);
			}
			return new Date(a.created_at) - new Date(b.created_at);
		});

		const paginatedPosts = posts.slice(skip, skip + parseInt(limit));
		const total = posts.length;

		const responseData = {
			success: true,
			data: {
				posts: paginatedPosts,
				total,
				page: parseInt(page),
				totalPages: Math.ceil(total / limit)
			}
		};

		console.log('🔎 Réponse finale API:', {
			success: responseData.success,
			postsCount: responseData.data.posts.length,
			total: responseData.data.total,
			page: responseData.data.page
		});

		res.json(responseData);
	} catch (error) {
		logger.error('Error fetching discover posts:', error);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la récupération des posts'
		});
	}
};

// Route pour récupérer les statistiques de découverte
export const getDiscoverStats = async (req, res) => {
	try {
		// Compter les journaux publics
		const publicJournalsResult = await Journal.aggregate([
			{
				$match: {
					is_public: true,
					status: 'published'
				}
			},
			{
				$lookup: {
					from: 'users',
					localField: 'user_id',
					foreignField: '_id',
					as: 'user'
				}
			},
			{
				$match: {
					'user.areJournalsPublic': true
				}
			},
			{
				$count: 'total'
			}
		]);

		const publicJournals = publicJournalsResult.length > 0 ? publicJournalsResult[0].total : 0;

		// Compter les lieux partagés des utilisateurs publics
		const sharedPlacesResult = await Place.aggregate([
			{
				$lookup: {
					from: 'users',
					localField: 'user_id',
					foreignField: '_id',
					as: 'user'
				}
			},
			{
				$match: {
					'user.areJournalsPublic': true
				}
			},
			{
				$count: 'total'
			}
		]);

		const sharedPlaces = sharedPlacesResult.length > 0 ? sharedPlacesResult[0].total : 0;

		// Compter les voyageurs actifs (utilisateurs avec journals publics)
		const activeTravelers = await User.countDocuments({
			areJournalsPublic: true
		});

		res.json({
			success: true,
			data: {
				shared_places: sharedPlaces,
				public_journals: publicJournals,
				active_travelers: activeTravelers
			}
		});
	} catch (error) {
		logger.error('Error fetching discover stats:', error);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la récupération des statistiques'
		});
	}
};

// Route pour récupérer les tags tendance
export const getTrendingTags = async (req, res) => {
	try {
		const trendingTags = await Journal.aggregate([
			{
				$match: {
					is_public: true,
					status: 'published'
				}
			},
			{
				$lookup: {
					from: 'users',
					localField: 'user_id',
					foreignField: '_id',
					as: 'user'
				}
			},
			{
				$match: {
					'user.areJournalsPublic': true
				}
			},
			{
				$unwind: '$tags'
			},
			{
				$group: {
					_id: '$tags',
					count: { $sum: 1 }
				}
			},
			{
				$sort: { count: -1 }
			},
			{
				$limit: 20
			},
			{
				$project: {
					tag: '$_id',
					count: 1,
					_id: 0
				}
			}
		]);

		res.json({
			success: true,
			data: trendingTags
		});
	} catch (error) {
		logger.error('Error fetching trending tags:', error);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la récupération des tags tendance'
		});
	}
};

// Route pour récupérer les voyageurs actifs
export const getActiveTravelers = async (req, res) => {
	try {
		const activeTravelers = await User.aggregate([
			{
				$match: {
					areJournalsPublic: true
				}
			},
			{
				$lookup: {
					from: 'journals',
					localField: '_id',
					foreignField: 'user_id',
					as: 'journals'
				}
			},
			{
				$lookup: {
					from: 'places',
					localField: '_id',
					foreignField: 'user_id',
					as: 'places'
				}
			},
			{
				$project: {
					name: 1,
					avatar: 1,
					places_count: { $size: '$places' },
					journals_count: {
						$size: {
							$filter: {
								input: '$journals',
								cond: {
									$and: [{ $eq: ['$$this.is_public', true] }, { $eq: ['$$this.status', 'published'] }]
								}
							}
						}
					}
				}
			},
			{
				$match: {
					$or: [{ places_count: { $gt: 0 } }, { journals_count: { $gt: 0 } }]
				}
			},
			{
				$sort: { journals_count: -1, places_count: -1 }
			},
			{
				$limit: 10
			}
		]);

		res.json({
			success: true,
			data: activeTravelers
		});
	} catch (error) {
		logger.error('Error fetching active travelers:', error);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la récupération des voyageurs actifs'
		});
	}
};

// Route pour récupérer les destinations populaires
export const getPopularDestinations = async (req, res) => {
	try {
		const popularDestinations = await Place.aggregate([
			{
				$match: {
					moderation_status: 'approved'
				}
			},
			{
				$group: {
					_id: {
						city: '$location.city',
						country: '$location.country'
					},
					count: { $sum: 1 }
				}
			},
			{
				$match: {
					'_id.city': { $ne: null },
					'_id.country': { $ne: null }
				}
			},
			{
				$sort: { count: -1 }
			},
			{
				$limit: 15
			},
			{
				$project: {
					city: '$_id.city',
					country: '$_id.country',
					count: 1,
					_id: 0
				}
			}
		]);

		res.json({
			success: true,
			data: popularDestinations
		});
	} catch (error) {
		logger.error('Error fetching popular destinations:', error);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la récupération des destinations populaires'
		});
	}
};

// Configuration des routes publiques
router.get('/journals', getPublicJournals);
router.get('/journals/:id', getPublicJournalById);
router.get('/places/:id', getPublicPlaceById);
router.get('/stats', getPublicStats);

// Routes pour la page Discover
router.get('/discover/posts', getDiscoverPosts);
router.get('/discover/stats', getDiscoverStats);
router.get('/discover/trending-tags', getTrendingTags);
router.get('/discover/active-travelers', getActiveTravelers);
router.get('/discover/popular-destinations', getPopularDestinations);

export default router;
