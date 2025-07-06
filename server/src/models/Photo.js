import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
	place_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true, index: true },
	url: { type: String, required: true },
	caption: { type: String },
	uploaded_at: { type: Date, default: Date.now }
});

export default mongoose.model('Photo', photoSchema);
