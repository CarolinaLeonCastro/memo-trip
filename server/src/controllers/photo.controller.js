import Photo from '../models/Photo.js';

// GET /api/photos?limit=10&page=1&place_id=123
export async function getPhotos(req, res, next) {
	try {
		const { page = 1, limit = 10, place_id } = req.query;
		const filter = {};

		if (place_id) filter.place_id = place_id;

		const photos = await Photo.find(filter)
			.populate('place_id', 'name description')
			.skip((page - 1) * limit)
			.limit(Number(limit))
			.sort('-uploaded_at')
			.exec();

		const total = await Photo.countDocuments(filter);
		res.json({ data: photos, meta: { total, page, limit } });
	} catch (err) {
		next(err);
	}
}

// GET /api/photos/:id
export async function getPhotoById(req, res, next) {
	try {
		const photo = await Photo.findById(req.params.id).populate('place_id', 'name description');
		if (!photo) return res.status(404).json({ message: 'Photo not found' });
		res.json(photo);
	} catch (err) {
		next(err);
	}
}

// POST /api/photos
export async function createPhoto(req, res, next) {
	try {
		const photo = new Photo(req.body);
		await photo.save();
		await photo.populate('place_id', 'name description');
		res.status(201).json(photo);
	} catch (err) {
		next(err);
	}
}

// PUT /api/photos/:id
export async function updatePhoto(req, res, next) {
	try {
		const photo = await Photo.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		}).populate('place_id', 'name description');
		if (!photo) return res.status(404).json({ message: 'Photo not found' });
		res.json(photo);
	} catch (err) {
		next(err);
	}
}

// DELETE /api/photos/:id
export async function deletePhoto(req, res, next) {
	try {
		const result = await Photo.deleteOne({ _id: req.params.id });
		if (result.deletedCount === 0) return res.status(404).json({ message: 'Photo not found' });
		res.status(204).end();
	} catch (err) {
		next(err);
	}
}
