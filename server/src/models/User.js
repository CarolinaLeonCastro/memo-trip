import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true, lowercase: true },
	password: { type: String, required: true },
	name: { type: String, required: true },
	avatar: {
		url: {
			type: String,
			default: null
		},
		filename: {
			type: String,
			default: null
		},
		uploadedAt: {
			type: Date,
			default: null
		}
	},
	created_at: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
