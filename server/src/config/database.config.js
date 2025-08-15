import mongoose from 'mongoose';
import env from './dotenv.config.js';
import logger from './logger.config.js';

const connectDB = async () => {
	try {
		if (!env.MONGODB_URI) {
			throw new Error('MONGODB_URI is not defined in environment variables');
		}
		
		logger.info('Attempting to connect to MongoDB...', { uri: env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@') });
		
		await mongoose.connect(env.MONGODB_URI, {
			serverSelectionTimeoutMS: 5000,
			socketTimeoutMS: 45000,
		});
		
		logger.info('Successfully connected to MongoDB');
	} catch (error) {
		logger.error('MongoDB connection failed:', { error: error.message });
		throw error;
	}
};

const database = connectDB();

export default database;
