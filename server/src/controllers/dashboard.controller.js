import User from '../models/User.js';
import Place from '../models/Place.js';
import Journal from '../models/Journal.js';

// GET /api/dashboard/recent-places?user_id=123&limit=6
export async function getRecentPlaces(req, res, next) {
	try {
		const { user_id, limit = 6 } = req.query;

		if (!user_id) {
			return res.status(400).json({ message: 'user_id is required' });
		}

		const recentPlaces = await Place.find({ user_id })
			.populate('journal_id', 'title')
			.sort({ date_visited: -1 })
			.limit(Number(limit))
			.select('name location.city location.country photos date_visited rating');

		res.json({
			data: recentPlaces,
			meta: {
				total: recentPlaces.length,
				limit: Number(limit)
			}
		});
	} catch (err) {
		next(err);
	}
}

// GET /api/dashboard/stats?user_id=123
export async function getDashboardStats(req, res, next) {
	try {
		const { user_id } = req.query;

		if (!user_id) {
			return res.status(400).json({ message: 'user_id is required' });
		}

		// Compter les lieux
		const totalPlaces = await Place.countDocuments({ user_id });

		// Compter les pays uniques
		const countries = await Place.distinct('location.country', { user_id });
		const totalCountries = countries.filter((country) => country).length;

		// Compter les journaux
		const totalJournals = await Journal.countDocuments({ user_id });

		// Photos totales
		const placesWithPhotos = await Place.find({ user_id }).select('photos');
		const totalPhotos = placesWithPhotos.reduce((acc, place) => {
			return acc + (place.photos ? place.photos.length : 0);
		}, 0);

		res.json({
			stats: {
				total_places: totalPlaces,
				total_countries: totalCountries,
				total_journals: totalJournals,
				total_photos: totalPhotos
			}
		});
	} catch (err) {
		next(err);
	}
}

// GET /api/dashboard/map-places?user_id=123&journal_id=456
export async function getMapPlaces(req, res, next) {
	try {
		const { user_id, journal_id } = req.query;

		if (!user_id) {
			return res.status(400).json({ message: 'user_id is required' });
		}

		const filter = { user_id };
		if (journal_id) filter.journal_id = journal_id;

		const places = await Place.find(filter)
			.populate('journal_id', 'title')
			.select('name location date_visited photos rating description')
			.sort({ date_visited: -1 });

		// Formater pour la carte
		const mapData = places.map((place) => ({
			id: place._id,
			name: place.name,
			coordinates: place.location.coordinates,
			address: place.location.address,
			city: place.location.city,
			country: place.location.country,
			date_visited: place.date_visited,
			photos: place.photos,
			rating: place.rating,
			description: place.description,
			journal: place.journal_id
		}));

		res.json({
			data: mapData,
			meta: {
				total: mapData.length
			}
		});
	} catch (err) {
		next(err);
	}
}

// GET /api/dashboard/users/stats - Statistiques des utilisateurs
export async function getUserStats(req, res, next) {
	try {
		const { startDate, endDate } = req.query;
		const matchStage = {};

		if (startDate || endDate) {
			matchStage.created_at = {};
			if (startDate) matchStage.created_at.$gte = new Date(startDate);
			if (endDate) matchStage.created_at.$lte = new Date(endDate);
		}

		const pipeline = [
			...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
			{
				$group: {
					_id: {
						year: { $year: '$created_at' },
						month: { $month: '$created_at' }
					},
					count: { $sum: 1 }
				}
			},
			{ $sort: { '_id.year': 1, '_id.month': 1 } }
		];

		const userStats = await User.aggregate(pipeline);
		const totalUsers = await User.countDocuments(matchStage);

		res.json({
			total: totalUsers,
			byMonth: userStats
		});
	} catch (err) {
		next(err);
	}
}

// GET /api/dashboard/places/stats - Statistiques des lieux
export async function getPlaceStats(req, res, next) {
	try {
		const { userId, startDate, endDate } = req.query;
		const matchStage = {};

		if (userId) matchStage.user_id = userId;
		if (startDate || endDate) {
			matchStage.date_visited = {};
			if (startDate) matchStage.date_visited.$gte = new Date(startDate);
			if (endDate) matchStage.date_visited.$lte = new Date(endDate);
		}

		const [placesByUser, placesByMonth, totalPlaces] = await Promise.all([
			Place.aggregate([
				...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
				{
					$group: {
						_id: '$user_id',
						count: { $sum: 1 }
					}
				},
				{
					$lookup: {
						from: 'users',
						localField: '_id',
						foreignField: '_id',
						as: 'user'
					}
				},
				{
					$unwind: '$user'
				},
				{
					$project: {
						user_name: '$user.name',
						user_email: '$user.email',
						place_count: '$count'
					}
				},
				{ $sort: { place_count: -1 } }
			]),
			Place.aggregate([
				...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
				{
					$group: {
						_id: {
							year: { $year: '$date_visited' },
							month: { $month: '$date_visited' }
						},
						count: { $sum: 1 }
					}
				},
				{ $sort: { '_id.year': 1, '_id.month': 1 } }
			]),
			Place.countDocuments(matchStage)
		]);

		res.json({
			total: totalPlaces,
			byUser: placesByUser,
			byMonth: placesByMonth
		});
	} catch (err) {
		next(err);
	}
}

// GET /api/dashboard/content/stats - Statistiques du contenu (photos seulement)
export async function getContentStats(req, res, next) {
	try {
		const { userId, startDate, endDate } = req.query;
		const matchStage = { user_id: userId };

		if (startDate || endDate) {
			matchStage.createdAt = {};
			if (startDate) matchStage.createdAt.$gte = new Date(startDate);
			if (endDate) matchStage.createdAt.$lte = new Date(endDate);
		}

		// Statistiques des photos intégrées dans les places
		const photoPipeline = [
			{ $match: matchStage },
			{ $unwind: { path: '$photos', preserveNullAndEmptyArrays: true } },
			{ $match: { photos: { $exists: true } } },
			{
				$group: {
					_id: {
						year: { $year: '$photos.uploaded_at' },
						month: { $month: '$photos.uploaded_at' }
					},
					count: { $sum: 1 }
				}
			},
			{ $sort: { '_id.year': 1, '_id.month': 1 } }
		];

		// Compter le total des photos
		const totalPhotosResult = await Place.aggregate([
			{ $match: matchStage },
			{ $project: { photoCount: { $size: { $ifNull: ['$photos', []] } } } },
			{ $group: { _id: null, total: { $sum: '$photoCount' } } }
		]);

		const totalPhotos = totalPhotosResult.length > 0 ? totalPhotosResult[0].total : 0;
		const photoStats = await Place.aggregate(photoPipeline);

		res.json({
			photos: {
				total: totalPhotos,
				byMonth: photoStats
			}
		});
	} catch (err) {
		next(err);
	}
}
