import User from '../models/User.js';
import logger from '../config/logger.config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// PUT /api/users/:id/avatar
export async function updateUserAvatar(req, res, next) {
	try {
		const { id } = req.params;

		if (!req.file) {
			return res.status(400).json({ message: 'Aucun avatar uploadé' });
		}

		const user = await User.findById(id);
		if (!user) {
			// Supprimer le fichier uploadé si l'utilisateur n'existe pas
			const filePath = path.join(__dirname, '../../uploads', req.file.filename);
			fs.unlink(filePath, (unlinkErr) => {
				if (unlinkErr) {
					logger.error('Error deleting uploaded avatar file', {
						filename: req.file.filename,
						error: unlinkErr.message
					});
				}
			});
			return res.status(404).json({ message: 'User not found' });
		}

		// Supprimer l'ancien avatar s'il existe
		if (user.avatar && user.avatar.filename) {
			const oldFilePath = path.join(__dirname, '../../uploads', user.avatar.filename);
			fs.unlink(oldFilePath, (unlinkErr) => {
				if (unlinkErr) {
					logger.error('Error deleting old avatar file', {
						filename: user.avatar.filename,
						error: unlinkErr.message
					});
				} else {
					logger.info('Old avatar file deleted successfully', {
						filename: user.avatar.filename,
						userId: id
					});
				}
			});
		}

		// Mettre à jour l'avatar
		user.avatar = {
			url: `/uploads/${req.file.filename}`,
			filename: req.file.filename,
			uploadedAt: new Date()
		};

		await user.save();

		logger.info('Avatar updated successfully', {
			userId: id,
			filename: req.file.filename
		});

		res.json({
			message: 'Avatar mis à jour avec succès',
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				avatar: user.avatar
			}
		});
	} catch (err) {
		// En cas d'erreur, supprimer le fichier uploadé
		if (req.file) {
			const filePath = path.join(__dirname, '../../uploads', req.file.filename);
			fs.unlink(filePath, (unlinkErr) => {
				if (unlinkErr) {
					logger.error('Error deleting uploaded avatar file after error', {
						filename: req.file.filename,
						error: unlinkErr.message
					});
				}
			});
		}

		logger.error('Error uploading avatar', {
			error: err.message,
			stack: err.stack,
			userId: req.params.id
		});

		next(err);
	}
}

// DELETE /api/users/:id/avatar
export async function removeUserAvatar(req, res, next) {
	try {
		const { id } = req.params;

		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		if (!user.avatar || !user.avatar.filename) {
			return res.status(404).json({ message: 'Aucun avatar à supprimer' });
		}

		// Supprimer le fichier physique
		const filePath = path.join(__dirname, '../../uploads', user.avatar.filename);
		fs.unlink(filePath, (unlinkErr) => {
			if (unlinkErr) {
				logger.error('Error deleting avatar file', {
					filename: user.avatar.filename,
					error: unlinkErr.message
				});
			} else {
				logger.info('Avatar file deleted successfully', {
					filename: user.avatar.filename,
					userId: id
				});
			}
		});

		// Supprimer l'avatar de la base de données
		user.avatar = undefined;
		await user.save();

		res.json({
			message: 'Avatar supprimé avec succès'
		});
	} catch (err) {
		next(err);
	}
}

// GET /api/users/settings - Récupérer les paramètres de l'utilisateur connecté
export async function getUserSettings(req, res, next) {
	try {
		const user = await User.findById(req.user.id).select('areJournalsPublic');
		if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
		
		res.json({
			success: true,
			data: {
				areJournalsPublic: user.areJournalsPublic
			}
		});
	} catch (err) {
		next(err);
	}
}

// PUT /api/users/settings - Mettre à jour les paramètres de l'utilisateur connecté
export async function updateUserSettings(req, res, next) {
	try {
		const { areJournalsPublic } = req.body;
		
		const user = await User.findByIdAndUpdate(
			req.user.id,
			{ areJournalsPublic },
			{ new: true, runValidators: true }
		).select('areJournalsPublic');
		
		if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
		
		res.json({
			success: true,
			message: 'Paramètres mis à jour avec succès',
			data: {
				areJournalsPublic: user.areJournalsPublic
			}
		});
	} catch (err) {
		next(err);
	}
}