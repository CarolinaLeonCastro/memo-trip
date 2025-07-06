import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
		name: { type: String, required: true },
		description: String,
		location: {
			type: { type: String, enum: ['Point'], default: 'Point' },
			coordinates: { type: [Number], required: true } // [lng, lat]
		},
		dateVisited: Date
	},
	{
		timestamps: true
	}
);

placeSchema.index({ location: '2dsphere' });

export default mongoose.model('Place', placeSchema);
