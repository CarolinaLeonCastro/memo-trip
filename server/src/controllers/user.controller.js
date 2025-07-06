import User from '../models/User.js';

// POST /api/users
export async function createUser(req, res, next) {
	try {
		const user = await User.create(req.body);
		res.status(201).json(user);
	} catch (err) {
		next(err);
	}
}

// GET /api/users?limit=10&page=1
export async function getUsers(req, res, next) {
	try {
		const { page = 1, limit = 20 } = req.query;
		const users = await User.find()
			.skip((page - 1) * limit)
			.limit(Number(limit))
			.select('-password')
			.exec();
		const total = await User.countDocuments();
		res.json({ data: users, meta: { total, page, limit } });
	} catch (err) {
		next(err);
	}
}

// GET /api/users/:id
export async function getUserById(req, res, next) {
	try {
		const user = await User.findById(req.params.id).select('-password');
		if (!user) return res.status(404).json({ message: 'User not found' });
		res.json(user);
	} catch (err) {
		next(err);
	}
}

// PUT /api/users/:id
export async function updateUser(req, res, next) {
	try {
		const user = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		}).select('-password');
		if (!user) return res.status(404).json({ message: 'User not found' });
		res.json(user);
	} catch (err) {
		next(err);
	}
}

// DELETE /api/users/:id
export async function deleteUser(req, res, next) {
	try {
		const result = await User.deleteOne({ _id: req.params.id });
		if (result.deletedCount === 0) return res.status(404).json({ message: 'User not found' });
		res.status(204).end();
	} catch (err) {
		next(err);
	}
}
