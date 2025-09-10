import User from '../models/User.js';
import Journal from '../models/Journal.js';
import Place from '../models/Place.js';
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
		console.log('🔍 Récupération des paramètres pour user ID:', req.user?.id);

		const user = await User.findById(req.user.id).select('areJournalsPublic');
		if (!user) {
			console.log('❌ Utilisateur non trouvé lors de la récupération des paramètres');
			return res.status(404).json({ message: 'Utilisateur non trouvé' });
		}

		console.log('📊 Paramètres récupérés depuis la DB:', user.areJournalsPublic);

		res.json({
			success: true,
			data: {
				areJournalsPublic: user.areJournalsPublic
			}
		});
	} catch (err) {
		console.error('❌ Erreur lors de la récupération des paramètres:', err);
		next(err);
	}
}

// PUT /api/users/settings - Mettre à jour les paramètres de l'utilisateur connecté
export async function updateUserSettings(req, res, next) {
	try {
		console.log('🔧 Mise à jour des paramètres utilisateur');
		console.log('📋 User ID:', req.user?.id);
		console.log('📦 Body reçu:', req.body);

		const { areJournalsPublic } = req.body;

		console.log('💾 Tentative de mise à jour avec la valeur:', areJournalsPublic);
		console.log('💾 Type de la valeur:', typeof areJournalsPublic);

		// Utiliser findOneAndUpdate avec un filter plus spécifique pour éviter les race conditions
		const user = await User.findOneAndUpdate(
			{ _id: req.user.id },
			{ $set: { areJournalsPublic: Boolean(areJournalsPublic) } },
			{ new: true, runValidators: true, upsert: false }
		).select('areJournalsPublic');

		if (!user) {
			console.log('❌ Utilisateur non trouvé');
			return res.status(404).json({ message: 'Utilisateur non trouvé' });
		}

		console.log('✅ Paramètres mis à jour dans la réponse:', user.areJournalsPublic);

		// Vérification immédiate pour s'assurer que la base de données a bien été mise à jour
		const verificationUser = await User.findById(req.user.id).select('areJournalsPublic');
		console.log('🔍 Vérification immédiate depuis la DB:', verificationUser?.areJournalsPublic);

		// Vérifier les journaux de cet utilisateur AVANT modification
		const userJournalsBefore = await Journal.find({
			user_id: req.user.id
		})
			.select('title is_public status')
			.limit(5);
		console.log(
			'📚 Journaux AVANT modification:',
			userJournalsBefore.map((j) => ({
				title: j.title,
				is_public: j.is_public,
				status: j.status
			}))
		);

		// 🎯 LOGIQUE INTELLIGENTE : Si on active les journaux publics
		if (areJournalsPublic) {
			console.log('🚀 Activation des journaux publics - publication automatique');

			// Option A: Rendre publics tous les journaux publiés (pas les brouillons)
			const publishedJournalsUpdate = await Journal.updateMany(
				{
					user_id: req.user.id,
					status: 'published' // Seulement les journaux déjà publiés
				},
				{
					$set: { is_public: true }
				}
			);

			console.log('📖 Journaux publiés rendus publics:', publishedJournalsUpdate.modifiedCount);

			// Option B: Publier ET rendre publics les brouillons récents (moins de 30 jours)
			const recentDrafts = await Journal.find({
				user_id: req.user.id,
				status: 'draft',
				createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // 30 jours
			});

			if (recentDrafts.length > 0) {
				console.log('📝 Brouillons récents trouvés:', recentDrafts.length);
				const draftUpdate = await Journal.updateMany(
					{
						user_id: req.user.id,
						status: 'draft',
						createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
					},
					{
						$set: {
							status: 'published',
							is_public: true
						}
					}
				);
				console.log('📝 Brouillons récents publiés:', draftUpdate.modifiedCount);
			}

			// Vérifier les lieux de cet utilisateur
			const userPlaces = await Place.find({
				user_id: req.user.id
			})
				.select('name')
				.limit(5);
			console.log(
				"🏞️ Lieux de l'utilisateur:",
				userPlaces.map((p) => ({
					name: p.name
				}))
			);

			// Note: Les lieux sont automatiquement publics si l'utilisateur a areJournalsPublic: true
		} else {
			// Si on désactive les journaux publics, rendre tous les journaux privés
			console.log('🔒 Désactivation des journaux publics - passage en privé');
			const privateUpdate = await Journal.updateMany({ user_id: req.user.id }, { $set: { is_public: false } });
			console.log('🔒 Journaux rendus privés:', privateUpdate.modifiedCount);

			// Note: Les lieux ne seront plus visibles publiquement
			console.log('🔒 Les lieux ne seront plus visibles publiquement');
		}

		// Vérifier les journaux APRÈS modification
		const userJournalsAfter = await Journal.find({
			user_id: req.user.id
		})
			.select('title is_public status')
			.limit(5);
		console.log(
			'📚 Journaux APRÈS modification:',
			userJournalsAfter.map((j) => ({
				title: j.title,
				is_public: j.is_public,
				status: j.status
			}))
		);

		// Assurer que nous retournons exactement ce qui est en base
		res.json({
			success: true,
			message: 'Paramètres mis à jour avec succès',
			data: {
				areJournalsPublic: verificationUser.areJournalsPublic
			}
		});
	} catch (err) {
		console.error('❌ Erreur lors de la mise à jour des paramètres:', err);
		next(err);
	}
}
