import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
	place_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true, index: true },
	text: { type: String, required: true },
	created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Note', noteSchema);
