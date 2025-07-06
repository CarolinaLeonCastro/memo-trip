import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true, lowercase: true },
	password: { type: String, required: true },
	name: { type: String, required: true },
	createdAt: { type: Date, default: Date.now }
});

// avant sauvegarde, on hash le mot de passe
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

export default mongoose.model('User', userSchema);
