import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true },
		description: { type: String, trim: true },
		personal_notes: { type: String, trim: true }, // Notes personnelles de l'utilisateur
		start_date: { type: Date, required: true },
		end_date: { type: Date, required: true },
		cover_image: { type: String }, // URL de l'image de couverture
		// Nouveaux champs Cloudinary pour l'image de couverture
		cover_image_public_id: { type: String }, // ID public Cloudinary
		cover_image_variants: {
			thumbnail: { type: String },
			small: { type: String },
			medium: { type: String },
			large: { type: String },
			original: { type: String }
		},
		status: {
			type: String,
			enum: ['draft', 'published', 'archived'],
			default: 'draft'
		},
		is_public: {
			type: Boolean,
			default: false
		},
		slug: {
			type: String,
			unique: true,
			sparse: true // Permet null/undefined mais les valeurs existantes doivent être uniques
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

// Middleware pour générer un slug unique lors de la publication
journalSchema.pre('save', async function (next) {
	if (this.is_public && !this.slug) {
		// Générer un slug basé sur le titre et l'ID
		const baseSlug = this.title
			.toLowerCase()
			.replace(/[^a-z0-9]/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '');

		// Ajouter un suffixe unique avec timestamp
		const timestamp = Date.now();
		this.slug = `${baseSlug}-${timestamp}`;
	}
	next();
});

// Index pour la recherche par titre
journalSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Journal', journalSchema);
