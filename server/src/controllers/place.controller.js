import Place from '../models/Place.js';

// Ajouter une photo à un lieu
export const addPhotoToPlace = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { url, caption } = req.body;

		if (!url) {
			return res.status(400).json({ message: 'Photo URL is required' });
		}

		const place = await Place.findById(id);
		if (!place) {
			return res.status(404).json({ message: 'Place not found' });
		}

		const newPhoto = {
			url,
			caption: caption || '',
			uploaded_at: new Date()
		};

		place.photos.push(newPhoto);
		await place.save();

		res.status(201).json({
			message: 'Photo added successfully',
			photo: newPhoto,
			total_photos: place.photos.length
		});
	} catch (err) {
		next(err);
	}
};

// Supprimer une photo d'un lieu
export const removePhotoFromPlace = async (req, res, next) => {
	try {
		const { id, photoId } = req.params;

		const place = await Place.findById(id);
		if (!place) {
			return res.status(404).json({ message: 'Place not found' });
		}

		place.photos = place.photos.filter((photo) => photo._id.toString() !== photoId);
		await place.save();

		res.json({
			message: 'Photo removed successfully',
			total_photos: place.photos.length
		});
	} catch (err) {
		next(err);
	}
};

// Obtenir toutes les photos d'un lieu
export const getPlacePhotos = async (req, res, next) => {
	try {
		const { id } = req.params;
		const place = await Place.findById(id).select('photos name');

		if (!place) {
			return res.status(404).json({ message: 'Place not found' });
		}

		res.json({
			place_name: place.name,
			photos: place.photos,
			total: place.photos.length
		});
	} catch (err) {
		next(err);
	}
};

// GET /api/places?limit=10&page=2&search=Paris&user_id=123&journal_id=456&sort_by=date_visited
export const getPlaces = async (req, res, next) => {
	try {
		const {
			page = 1,
			limit = 10,
			search,
			user_id,
			journal_id,
			city,
			country,
			rating_min,
			rating_max,
			sort_by = 'date_visited',
			sort_order = 'desc'
		} = req.query;

		const filter = {};

		if (user_id) filter.user_id = user_id;
		if (journal_id) filter.journal_id = journal_id;
		if (city) filter['location.city'] = new RegExp(city, 'i');
		if (country) filter['location.country'] = new RegExp(country, 'i');
		if (rating_min || rating_max) {
			filter.rating = {};
			if (rating_min) filter.rating.$gte = Number(rating_min);
			if (rating_max) filter.rating.$lte = Number(rating_max);
		}

		if (search) {
			filter.$or = [
				{ name: new RegExp(search, 'i') },
				{ description: new RegExp(search, 'i') },
				{ 'location.address': new RegExp(search, 'i') },
				{ 'location.city': new RegExp(search, 'i') },
				{ 'location.country': new RegExp(search, 'i') },
				{ tags: new RegExp(search, 'i') }
			];
		}

		const sortOption = {};
		sortOption[sort_by] = sort_order === 'desc' ? -1 : 1;

		const places = await Place.find(filter)
			.populate('user_id', 'name email')
			.populate('journal_id', 'title')
			.skip((page - 1) * limit)
			.limit(Number(limit))
			.sort(sortOption)
			.exec();

		const total = await Place.countDocuments(filter);
		res.json({
			data: places,
			meta: { total, page: Number(page), limit: Number(limit) },
			filters: { search, user_id, journal_id, city, country, rating_min, rating_max, sort_by, sort_order }
		});
	} catch (err) {
		next(err);
	}
};

// GET /api/places/:id
export const getPlaceById = async (req, res, next) => {
	try {
		const place = await Place.findById(req.params.id).populate('user_id', 'name email').populate('journal_id', 'title');
		if (!place) return res.status(404).json({ message: 'Place not found' });
		res.json(place);
	} catch (err) {
		next(err);
	}
};

// POST /api/places
export const createPlace = async (req, res, next) => {
	try {
		const place = new Place(req.body);
		await place.save();
		await place.populate('user_id', 'name email');
		res.status(201).json(place);
	} catch (err) {
		next(err);
	}
};

// PUT /api/places/:id
export const updatePlace = async (req, res, next) => {
	try {
		const place = await Place.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		}).populate('user_id', 'name email');
		if (!place) return res.status(404).json({ message: 'Place not found' });
		res.json(place);
	} catch (err) {
		next(err);
	}
};

// DELETE /api/places/:id
export const deletePlace = async (req, res, next) => {
	try {
		const result = await Place.deleteOne({ _id: req.params.id });
		if (result.deletedCount === 0) return res.status(404).json({ message: 'Place not found' });
		res.status(204).end();
	} catch (err) {
		next(err);
	}
};

// GET /api/places/nearby?lat=48.8566&lng=2.3522&maxDistance=1000
export const getNearbyPlaces = async (req, res, next) => {
	try {
		const { lat, lng, maxDistance = 1000 } = req.query;

		if (!lat || !lng) {
			return res.status(400).json({ message: 'Latitude and longitude are required' });
		}

		const places = await Place.find({
			location: {
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: [parseFloat(lng), parseFloat(lat)]
					},
					$maxDistance: parseInt(maxDistance)
				}
			}
		}).populate('user_id', 'name email');

		res.json({ data: places });
	} catch (err) {
		next(err);
	}
};
