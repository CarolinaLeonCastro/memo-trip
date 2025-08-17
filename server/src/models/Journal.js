import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true },
		description: { type: String, trim: true },
		personal_notes: { type: String, trim: true }, // Notes personnelles de l'utilisateur
		start_date: { type: Date, required: true },
		end_date: { type: Date, required: true },
		cover_image: { type: String }, // Image de couverture
		status: {
			type: String,
			enum: ['draft', 'published', 'archived'],
			default: 'draft'
		},
		is_public: {
			type: Boolean,
			default: false
		},
		tags: [{ type: String, trim: true }], // Tags pour catégoriser
		user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		places: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place' }],
		stats: {
			total_places: { type: Number, default: 0 },
			total_photos: { type: Number, default: 0 },
			total_days: { type: Number, default: 0 }
		}
	},
	{
		timestamps: true
	}
);

// Index pour la recherche par titre
journalSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Journal', journalSchema);
