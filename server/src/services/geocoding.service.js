import fetch from 'node-fetch';
import logger from '../config/logger.config.js';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

export class GeocodingService {
	static async searchPlaces(query, limit = 5, countryCode = null) {
		// Retry mechanism pour les erreurs temporaires
		for (let attempt = 1; attempt <= 3; attempt++) {
			try {
				const params = new URLSearchParams({
					q: query,
					format: 'json',
					limit: limit.toString(),
					addressdetails: '1',
					extratags: '1',
					namedetails: '1'
				});

				if (countryCode) {
					params.append('countrycodes', countryCode);
				}

				// Ajouter un délai pour respecter les limites de taux
				if (attempt > 1) {
					await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
				}

				const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params}`, {
					headers: {
						'User-Agent': 'MemoTrip/1.0 (contact@memotrip.app)',
						'Accept': 'application/json',
						'Accept-Language': 'fr,en'
					},
					timeout: 10000 // 10 secondes de timeout
				});

				if (!response.ok) {
					if (response.status === 429) {
						// Rate limit - retry après délai
						logger.warn(`Rate limit hit on attempt ${attempt}, retrying...`);
						continue;
					}
					if (response.status >= 500 && attempt < 3) {
						// Erreur serveur - retry
						logger.warn(`Server error ${response.status} on attempt ${attempt}, retrying...`);
						continue;
					}
					throw new Error(`Nominatim API error: ${response.status}`);
				}

				const data = await response.json();

				return data.map((place) => ({
					place_id: place.place_id,
					display_name: place.display_name,
					name: place.name || place.display_name.split(',')[0],
					address: {
						house_number: place.address?.house_number,
						road: place.address?.road,
						city: place.address?.city || place.address?.town || place.address?.village,
						state: place.address?.state,
						country: place.address?.country,
						postcode: place.address?.postcode
					},
					coordinates: {
						latitude: parseFloat(place.lat),
						longitude: parseFloat(place.lon)
					},
					type: place.type,
					class: place.class,
					importance: place.importance,
					bbox: place.boundingbox
						? {
								north: parseFloat(place.boundingbox[1]),
								south: parseFloat(place.boundingbox[0]),
								east: parseFloat(place.boundingbox[3]),
								west: parseFloat(place.boundingbox[2])
							}
						: null
				}));

			} catch (error) {
				logger.error(`Geocoding search error on attempt ${attempt}`, { 
					error: error.message, 
					query, 
					attempt 
				});
				
				// Si c'est le dernier essai, propager l'erreur
				if (attempt === 3) {
					throw new Error('Failed to search places after 3 attempts');
				}
			}
		}

		// Si on arrive ici, tous les essais ont échoué
		throw new Error('Failed to search places - all retries exhausted');
	}

	static async reverseGeocode(latitude, longitude) {
		try {
			const params = new URLSearchParams({
				lat: latitude.toString(),
				lon: longitude.toString(),
				format: 'json',
				addressdetails: '1'
			});

			const response = await fetch(`${NOMINATIM_BASE_URL}/reverse?${params}`, {
				headers: {
					'User-Agent': 'MemoTrip/1.0 (contact@memotrip.app)',
					'Accept': 'application/json',
					'Accept-Language': 'fr,en'
				},
				timeout: 10000
			});

			if (!response.ok) {
				throw new Error(`Nominatim API error: ${response.status}`);
			}

			const data = await response.json();

			if (!data.display_name) {
				throw new Error('No address found for these coordinates');
			}

			return {
				display_name: data.display_name,
				address: {
					house_number: data.address?.house_number,
					road: data.address?.road,
					city: data.address?.city || data.address?.town || data.address?.village,
					state: data.address?.state,
					country: data.address?.country,
					postcode: data.address?.postcode
				},
				coordinates: {
					latitude: parseFloat(data.lat),
					longitude: parseFloat(data.lon)
				}
			};
		} catch (error) {
			logger.error('Reverse geocoding error', { error: error.message, latitude, longitude });
			throw new Error('Failed to reverse geocode coordinates');
		}
	}
}
