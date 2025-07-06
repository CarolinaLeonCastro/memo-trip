import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
	place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', index: true },
	text: { type: String, required: true },
	createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Note', noteSchema);
