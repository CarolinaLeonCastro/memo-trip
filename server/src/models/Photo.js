import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
	place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', index: true },
	url: { type: String, required: true },
	caption: String,
	uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Photo', photoSchema);
