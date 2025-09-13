import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
	{
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true
		},
		target_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			index: true
		},
		target_type: {
			type: String,
			enum: ['journal', 'place'],
			required: true,
			index: true
		}
	},
	{
		timestamps: true
	}
);

// Index composé pour éviter les doublons et optimiser les requêtes
likeSchema.index({ user_id: 1, target_id: 1, target_type: 1 }, { unique: true });

// Index pour compter facilement les likes d'une entité
likeSchema.index({ target_id: 1, target_type: 1 });

const Like = mongoose.model('Like', likeSchema);

export default Like;
