// controllers/note.controller.js
import Note from '../models/Note.js';

// GET /api/notes?limit=10&page=1&place_id=123
export async function getNotes(req, res, next) {
	try {
		const { page = 1, limit = 10, place_id } = req.query;
		const filter = {};

		if (place_id) filter.place_id = place_id;

		const notes = await Note.find(filter)
			.populate('place_id', 'name description')
			.skip((page - 1) * limit)
			.limit(Number(limit))
			.sort('-created_at')
			.exec();

		const total = await Note.countDocuments(filter);
		res.json({ data: notes, meta: { total, page, limit } });
	} catch (err) {
		next(err);
	}
}

// GET /api/notes/:id
export async function getNoteById(req, res, next) {
	try {
		const note = await Note.findById(req.params.id).populate('place_id', 'name description');
		if (!note) return res.status(404).json({ message: 'Note not found' });
		res.json(note);
	} catch (err) {
		next(err);
	}
}

// POST /api/notes
export async function createNote(req, res, next) {
	try {
		const note = new Note(req.body);
		await note.save();
		await note.populate('place_id', 'name description');
		res.status(201).json(note);
	} catch (err) {
		next(err);
	}
}

// PUT /api/notes/:id
export async function updateNote(req, res, next) {
	try {
		const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		}).populate('place_id', 'name description');
		if (!note) return res.status(404).json({ message: 'Note not found' });
		res.json(note);
	} catch (err) {
		next(err);
	}
}

// DELETE /api/notes/:id
export async function deleteNote(req, res, next) {
	try {
		const result = await Note.deleteOne({ _id: req.params.id });
		if (result.deletedCount === 0) return res.status(404).json({ message: 'Note not found' });
		res.status(204).end();
	} catch (err) {
		next(err);
	}
}
