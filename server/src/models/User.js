import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true, lowercase: true },
	password: { type: String, required: true },
	name: { type: String, required: true },
	role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user'
	},
	status: {
		type: String,
		enum: ['active', 'blocked', 'pending'],
		default: 'active'
	},
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
	last_login: { type: Date },
	created_at: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
