import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema(
	{
		user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		journal_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Journal', required: true, index: true },
		name: { type: String, required: true, trim: true },
		description: { type: String, trim: true },
		location: {
			type: { type: String, enum: ['Point'], default: 'Point' },
			coordinates: { type: [Number], required: true }, // [longitude, latitude]
			address: { type: String, trim: true }, // Adresse lisible
			city: { type: String, trim: true },
			country: { type: String, trim: true }
		},
		date_visited: { type: Date, required: true },
		photos: [
			{
				url: {
					type: String,
					required: false
				},
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
		notes: { type: String, trim: true } // Notes détaillées
	},
	{
		timestamps: true
	}
);

placeSchema.index({ location: '2dsphere' });

export default mongoose.model('Place', placeSchema);
