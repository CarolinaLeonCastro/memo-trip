import mongoose from 'mongoose';
import env from './dotenv.config.js';

const database = mongoose.connect(env.MONGODB_URI);

export default database;
