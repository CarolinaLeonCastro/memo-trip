import express from 'express';
import Journal from '../models/Journal.js';
import Place from '../models/Place.js';

const router = express.Router();

// GET /api/search?q=paris&type=all&user_id=123
export async function globalSearch(req, res, next) {
	try {
		const { q, type = 'all', user_id, limit = 20 } = req.query;

		if (!q) {
			return res.status(400).json({ message: 'Search query is required' });
		}

		const searchRegex = new RegExp(q, 'i');
		const results = {};

		if (type === 'all' || type === 'journals') {
			const journalFilter = {
				$or: [{ title: searchRegex }, { description: searchRegex }, { tags: searchRegex }]
			};
			if (user_id) journalFilter.user_id = user_id;

			results.journals = await Journal.find(journalFilter)
				.populate('user_id', 'name')
				.limit(Number(limit))
				.select('title description start_date end_date cover_image tags')
				.sort({ start_date: -1 });
		}

		if (type === 'all' || type === 'places') {
			const placeFilter = {
				$or: [
					{ name: searchRegex },
					{ description: searchRegex },
					{ 'location.address': searchRegex },
					{ 'location.city': searchRegex },
					{ 'location.country': searchRegex },
					{ tags: searchRegex }
				]
			};
			if (user_id) placeFilter.user_id = user_id;

			results.places = await Place.find(placeFilter)
				.populate('user_id', 'name')
				.populate('journal_id', 'title')
				.limit(Number(limit))
				.select('name description location date_visited photos rating')
				.sort({ date_visited: -1 });
		}

		res.json({
			query: q,
			type,
			results,
			meta: {
				total_journals: results.journals?.length || 0,
				total_places: results.places?.length || 0
			}
		});
	} catch (err) {
		next(err);
	}
}

// GET /api/search/suggestions?q=par
export async function getSearchSuggestions(req, res, next) {
	try {
		const { q, user_id } = req.query;

		if (!q || q.length < 2) {
			return res.json({ suggestions: [] });
		}

		const searchRegex = new RegExp(q, 'i');
		const suggestions = new Set();

		// Suggestions depuis les journaux
		const journalFilter = { title: searchRegex };
		if (user_id) journalFilter.user_id = user_id;

		const journals = await Journal.find(journalFilter).select('title').limit(5);

		journals.forEach((journal) => suggestions.add(journal.title));

		// Suggestions depuis les lieux
		const placeFilter = {
			$or: [{ name: searchRegex }, { 'location.city': searchRegex }, { 'location.country': searchRegex }]
		};
		if (user_id) placeFilter.user_id = user_id;

		const places = await Place.find(placeFilter).select('name location.city location.country').limit(10);

		places.forEach((place) => {
			suggestions.add(place.name);
			if (place.location.city) suggestions.add(place.location.city);
			if (place.location.country) suggestions.add(place.location.country);
		});

		res.json({
			query: q,
			suggestions: Array.from(suggestions).slice(0, 10)
		});
	} catch (err) {
		next(err);
	}
}

router.get('/', globalSearch);
router.get('/suggestions', getSearchSuggestions);

export default router;
