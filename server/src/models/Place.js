import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema(
	{
		user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		name: { type: String, required: true },
		description: { type: String },
		location: {
			type: { type: String, enum: ['Point'], default: 'Point' },
			coordinates: { type: [Number], required: true } // [longitude, latitude]
		},
		date_visited: { type: Date }
	},
	{
		timestamps: true
	}
);

placeSchema.index({ location: '2dsphere' });

export default mongoose.model('Place', placeSchema);
