import User from '../models/User.js';
import Place from '../models/Place.js';
import Note from '../models/Note.js';
import Photo from '../models/Photo.js';

// GET /api/dashboard/stats - Statistiques générales
export async function getDashboardStats(req, res, next) {
	try {
		const [userCount, placeCount, noteCount, photoCount] = await Promise.all([
			User.countDocuments(),
			Place.countDocuments(),
			Note.countDocuments(),
			Photo.countDocuments()
		]);

		const stats = {
			users: userCount,
			places: placeCount,
			notes: noteCount,
			photos: photoCount,
			total_content: placeCount + noteCount + photoCount
		};

		res.json(stats);
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

// GET /api/dashboard/content/stats - Statistiques du contenu (notes + photos)
export async function getContentStats(req, res, next) {
	try {
		const { userId, startDate, endDate } = req.query;
		const matchStage = {};

		if (startDate || endDate) {
			matchStage.created_at = {};
			if (startDate) matchStage.created_at.$gte = new Date(startDate);
			if (endDate) matchStage.created_at.$lte = new Date(endDate);
		}

		// Statistiques des notes
		const notePipeline = [
			...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
			{
				$lookup: {
					from: 'places',
					localField: 'place_id',
					foreignField: '_id',
					as: 'place'
				}
			},
			{ $unwind: '$place' },
			...(userId ? [{ $match: { 'place.user_id': userId } }] : []),
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

		// Statistiques des photos
		const photoPipeline = [
			...(Object.keys(matchStage).length > 0 ? [{ $match: { uploaded_at: matchStage.created_at } }] : []),
			{
				$lookup: {
					from: 'places',
					localField: 'place_id',
					foreignField: '_id',
					as: 'place'
				}
			},
			{ $unwind: '$place' },
			...(userId ? [{ $match: { 'place.user_id': userId } }] : []),
			{
				$group: {
					_id: {
						year: { $year: '$uploaded_at' },
						month: { $month: '$uploaded_at' }
					},
					count: { $sum: 1 }
				}
			},
			{ $sort: { '_id.year': 1, '_id.month': 1 } }
		];

		const [noteStats, photoStats, totalNotes, totalPhotos] = await Promise.all([
			Note.aggregate(notePipeline),
			Photo.aggregate(photoPipeline),
			Note.countDocuments(),
			Photo.countDocuments()
		]);

		res.json({
			notes: {
				total: totalNotes,
				byMonth: noteStats
			},
			photos: {
				total: totalPhotos,
				byMonth: photoStats
			}
		});
	} catch (err) {
		next(err);
	}
}
