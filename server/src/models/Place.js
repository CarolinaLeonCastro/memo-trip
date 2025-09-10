import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema(
	{
		user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		journal_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Journal', required: true, index: true },
		name: { type: String, required: true, trim: true },
		description: { type: String, trim: true },
		// Statut du lieu : planned pour les journaux futurs, visited pour les lieux visités
		status: {
			type: String,
			enum: ['planned', 'visited'],
			default: 'visited',
			required: true
		},
		location: {
			type: { type: String, enum: ['Point'], default: 'Point' },
			coordinates: { type: [Number], required: true }, // [longitude, latitude]
			address: { type: String, trim: true }, // Adresse lisible
			city: { type: String, trim: true },
			country: { type: String, trim: true }
		},
		// === DATES POUR LIEUX VISITÉS ===
		date_visited: { type: Date }, // Date principale pour compatibilité (optionnelle)
		start_date: { type: Date }, // Date de début de la visite (optionnelle)
		end_date: { type: Date }, // Date de fin de la visite (optionnelle)
		visitedAt: { type: Date }, // Date exacte de visite (pour status = 'visited')

		// === DATES POUR LIEUX PLANIFIÉS ===
		plannedStart: { type: Date }, // Date de début planifiée (pour status = 'planned')
		plannedEnd: { type: Date }, // Date de fin planifiée (pour status = 'planned')
		photos: [
			{
				url: {
					type: String,
					required: false
				},
				// Nouveaux champs Cloudinary
				public_id: {
					type: String,
					required: false // Pour compatibilité avec les anciennes données
				},
				width: {
					type: Number,
					required: false
				},
				height: {
					type: Number,
					required: false
				},
				format: {
					type: String,
					required: false
				},
				variants: {
					thumbnail: { type: String },
					small: { type: String },
					medium: { type: String },
					large: { type: String },
					original: { type: String }
				},
				// Champs existants (legacy)
				filename: {
					type: String,
					required: false
				},
				caption: {
					type: String,
					trim: true,
					required: false
				},
				size: {
					type: Number,
					required: false
				},
				mimetype: {
					type: String,
					required: false
				},
				uploadedAt: {
					type: Date,
					default: Date.now
				}
			}
		],
		rating: { type: Number, min: 1, max: 5 }, // Note sur 5
		weather: { type: String, trim: true }, // Temps qu'il faisait
		budget: { type: Number }, // Coût approximatif
		tags: [{ type: String, trim: true }], // Tags personnalisés
		is_favorite: { type: Boolean, default: false },
		visit_duration: { type: Number }, // Durée en minutes
		notes: { type: String, trim: true }, // Notes détaillées
		moderation_status: {
			type: String,
			enum: ['pending', 'approved', 'rejected'],
			default: 'pending'
		},
		moderated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		moderated_at: { type: Date },
		rejection_reason: { type: String, trim: true }
	},
	{
		timestamps: true
	}
);

placeSchema.index({ location: '2dsphere' });

export default mongoose.model('Place', placeSchema);
