import { GeocodingService } from '../services/geocoding.service.js';
import logger from '../config/logger.config.js';

export const searchPlaces = async (req, res, next) => {
	try {
		const { q: query, limit = 5, country } = req.query;

		if (!query || query.trim().length < 3) {
			return res.status(400).json({
				message: 'Query must be at least 3 characters long'
			});
		}

		const places = await GeocodingService.searchPlaces(query.trim(), Math.min(parseInt(limit), 10), country);

		logger.info('Places search completed', {
			query,
			resultsCount: places.length
		});

		res.json({
			query,
			results: places,
			count: places.length
		});
	} catch (error) {
		next(error);
	}
};

export const reverseGeocode = async (req, res, next) => {
	try {
		const { lat, lon } = req.query;

		if (!lat || !lon) {
			return res.status(400).json({
				message: 'Latitude and longitude are required'
			});
		}

		const latitude = parseFloat(lat);
		const longitude = parseFloat(lon);

		if (isNaN(latitude) || isNaN(longitude)) {
			return res.status(400).json({
				message: 'Invalid latitude or longitude'
			});
		}

		const result = await GeocodingService.reverseGeocode(latitude, longitude);

		logger.info('Reverse geocoding completed', {
			latitude,
			longitude,
			address: result.display_name
		});

		res.json(result);
	} catch (error) {
		next(error);
	}
};
