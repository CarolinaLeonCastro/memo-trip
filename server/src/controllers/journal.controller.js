import Journal from '../models/Journal.js';
import Place from '../models/Place.js';

// POST /api/journals
export async function createJournal(req, res, next) {
	try {
		const journal = await Journal.create(req.body);
		res.status(201).json(journal);
	} catch (err) {
		next(err);
	}
}

// GET /api/journals?limit=10&page=1&search=title&status=published&tags=vacation
export async function getJournals(req, res, next) {
	try {
		const {
			page = 1,
			limit = 20,
			search,
			user_id,
			status,
			tags,
			sort_by = 'start_date',
			sort_order = 'desc'
		} = req.query;

		const filter = {};
		if (user_id) filter.user_id = user_id;
		if (status) filter.status = status;
		if (tags) filter.tags = { $in: tags.split(',') };
		if (search) {
			filter.$or = [
				{ title: new RegExp(search, 'i') },
				{ description: new RegExp(search, 'i') },
				{ tags: new RegExp(search, 'i') }
			];
		}

		const sortOption = {};
		sortOption[sort_by] = sort_order === 'desc' ? -1 : 1;

		const journals = await Journal.find(filter)
			.populate('user_id', 'name email')
			.populate({
				path: 'places',
				select: 'name location date_visited photos rating',
				options: { sort: { date_visited: 1 } }
			})
			.skip((page - 1) * limit)
			.limit(Number(limit))
			.sort(sortOption)
			.exec();

		const total = await Journal.countDocuments(filter);

		// Calculer les statistiques pour chaque journal
		const journalsWithStats = journals.map((journal) => {
			const journalObj = journal.toObject();
			journalObj.stats = {
				total_places: journal.places.length,
				total_photos: journal.places.reduce((acc, place) => acc + (place.photos?.length || 0), 0),
				total_days: Math.ceil((new Date(journal.end_date) - new Date(journal.start_date)) / (1000 * 60 * 60 * 24)) + 1
			};
			return journalObj;
		});

		res.json({
			data: journalsWithStats,
			meta: { total, page: Number(page), limit: Number(limit) },
			filters: { search, status, tags, sort_by, sort_order }
		});
	} catch (err) {
		next(err);
	}
}

// GET /api/journals/:id
export async function getJournalById(req, res, next) {
	try {
		const journal = await Journal.findById(req.params.id).populate('user_id', 'name email').populate('places');
		if (!journal) return res.status(404).json({ message: 'Journal not found' });
		res.json(journal);
	} catch (err) {
		next(err);
	}
}

// PUT /api/journals/:id
export async function updateJournal(req, res, next) {
	try {
		const journal = await Journal.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		})
			.populate('user_id', 'name email')
			.populate('places');
		if (!journal) return res.status(404).json({ message: 'Journal not found' });
		res.json(journal);
	} catch (err) {
		next(err);
	}
}

// DELETE /api/journals/:id
export async function deleteJournal(req, res, next) {
	try {
		// Supprimer aussi tous les lieux associés
		await Place.deleteMany({ journal_id: req.params.id });

		const result = await Journal.deleteOne({ _id: req.params.id });
		if (result.deletedCount === 0) return res.status(404).json({ message: 'Journal not found' });
		res.status(204).end();
	} catch (err) {
		next(err);
	}
}

// GET /api/journals/:id/export-pdf
export async function exportJournalPDF(req, res, next) {
	try {
		const journal = await Journal.findById(req.params.id).populate('user_id', 'name email').populate('places');

		if (!journal) return res.status(404).json({ message: 'Journal not found' });

		// TODO: Implémenter la génération PDF avec pdfkit
		// Pour l'instant, retourner les données JSON
		res.json({
			message: 'PDF export not implemented yet',
			data: journal
		});
	} catch (err) {
		next(err);
	}
}
