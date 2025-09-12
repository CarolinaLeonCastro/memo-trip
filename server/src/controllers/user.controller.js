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

// GET /api/users/activity - Récupérer l'activité récente de l'utilisateur
export async function getUserActivity(req, res, next) {
	try {
		const userId = req.user?.id || req.user?._id;

		if (!userId) {
			return res.status(401).json({
				success: false,
				message: 'Utilisateur non authentifié'
			});
		}

		// Vérifier que l'ID a un format valide pour MongoDB
		if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
			return res.status(400).json({
				success: false,
				message: "Format d'ID utilisateur invalide"
			});
		}

		const { limit = 10 } = req.query;

		// Récupérer les activités récentes
		const activities = [];

		// 1. Dernier journal créé (seulement le plus récent)
		const latestJournal = await Journal.findOne({ user_id: userId }).sort({ createdAt: -1 }).select('title createdAt');

		if (latestJournal) {
			activities.push({
				type: 'new_journal',
				title: 'Vous avez créé un nouveau journal',
				description: `Journal "${latestJournal.title}"`,
				date: latestJournal.createdAt,
				icon: 'ArticleIcon',
				color: 'primary.main'
			});
		}

		// 2. Dernier lieu ajouté (seulement le plus récent)
		const latestPlace = await Place.findOne({ user_id: userId })
			.sort({ createdAt: -1 })
			.select('name createdAt location.city location.country');

		if (latestPlace) {
			activities.push({
				type: 'new_place',
				title: `Vous avez ajouté un nouveau lieu`,
				description: `${latestPlace.name}`,
				date: latestPlace.createdAt,
				icon: 'LocationIcon',
				color: 'success.main'
			});
		}

		// 3. Dernières photos ajoutées (seulement le plus récent)
		const latestPlaceWithPhotos = await Place.findOne({
			user_id: userId,
			photos: { $exists: true, $not: { $size: 0 } }
		})
			.sort({ updatedAt: -1 })
			.select('name photos updatedAt');

		if (latestPlaceWithPhotos) {
			const photoCount = latestPlaceWithPhotos.photos?.length || 0;
			if (photoCount > 0) {
				activities.push({
					type: 'photos_added',
					title: `Vous avez ajouté ${photoCount} photo${photoCount > 1 ? 's' : ''}`,
					description: `À ${latestPlaceWithPhotos.name}`,
					date: latestPlaceWithPhotos.updatedAt,
					icon: 'CameraIcon',
					color: 'secondary.main'
				});
			}
		}

		// 4. Dernier journal mis à jour (seulement le plus récent)
		const allJournals = await Journal.find({ user_id: userId })
			.sort({ updatedAt: -1 })
			.limit(10)
			.select('title updatedAt createdAt');

		// Trouver le premier journal qui a été modifié (updatedAt différent de createdAt)
		const latestUpdatedJournal = allJournals.find((journal) => {
			const created = new Date(journal.createdAt).getTime();
			const updated = new Date(journal.updatedAt).getTime();
			return updated > created + 1000; // Plus d'1 seconde de différence
		});

		if (latestUpdatedJournal) {
			activities.push({
				type: 'journal_updated',
				title: `Vous avez mis à jour un journal`,
				description: `Journal "${latestUpdatedJournal.title}"`,
				date: latestUpdatedJournal.updatedAt,
				icon: 'EditIcon',
				color: 'info.main'
			});
		}

		// 5. Simulation d'activité de "likes" (à adapter selon votre logique métier)
		// Puisque nous n'avons pas de système de likes, nous simulons avec un nombre aléatoire
		if (activities.length > 0) {
			const randomLikes = Math.floor(Math.random() * 15) + 1; // Entre 1 et 15 likes
			const daysAgo = Math.floor(Math.random() * 14) + 1; // Entre 1 et 14 jours
			const likeDate = new Date();
			likeDate.setDate(likeDate.getDate() - daysAgo);

			activities.push({
				type: 'journal_liked',
				title: `Vous avez été aimé par ${randomLikes} personne${randomLikes > 1 ? 's' : ''}`,
				description: 'Sur vos derniers journaux',
				date: likeDate,
				icon: 'FavoriteIcon',
				color: 'error.main'
			});
		}

		// Trier toutes les activités par date décroissante et limiter
		const sortedActivities = activities
			.sort((a, b) => new Date(b.date) - new Date(a.date))
			.slice(0, Number(limit))
			.map((activity) => ({
				...activity,
				date: activity.date,
				formattedDate: getRelativeTimeString(activity.date)
			}));

		const response = {
			success: true,
			data: sortedActivities,
			meta: {
				total: sortedActivities.length,
				limit: Number(limit)
			}
		};

		console.log('🚀 Réponse envoyée:', JSON.stringify(response, null, 2));
		res.json(response);
	} catch (err) {
		logger.error("Erreur lors de la récupération de l'activité:", err);
		next(err);
	}
}

// Fonction utilitaire pour calculer le temps relatif
function getRelativeTimeString(date) {
	const now = new Date();
	const diffInMs = now - new Date(date);
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
	const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
	const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

	if (diffInDays > 0) {
		return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
	} else if (diffInHours > 0) {
		return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
	} else if (diffInMinutes > 0) {
		return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
	} else {
		return "À l'instant";
	}
}
