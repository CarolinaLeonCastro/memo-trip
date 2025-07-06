import Place from '../models/Place.js';

// GET /api/places?limit=10&page=2&search=Paris&user_id=123
export const getPlaces = async (req, res, next) => {
	try {
		const { page = 1, limit = 10, search, user_id } = req.query;
		const filter = {};

		if (user_id) filter.user_id = user_id;
		if (search) filter.name = new RegExp(search, 'i');

		const places = await Place.find(filter)
			.populate('user_id', 'name email')
			.skip((page - 1) * limit)
			.limit(Number(limit))
			.sort('-date_visited')
			.exec();

		const total = await Place.countDocuments(filter);
		res.json({ data: places, meta: { total, page, limit } });
	} catch (err) {
		next(err);
	}
};

// GET /api/places/:id
export const getPlaceById = async (req, res, next) => {
	try {
		const place = await Place.findById(req.params.id).populate('user_id', 'name email');
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
