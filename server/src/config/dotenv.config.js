import dotenv from 'dotenv';

dotenv.config();

const env = {
	FRONTEND_URLS: process.env.FRONTEND_URLS,
	PORT: process.env.PORT || 3000,
	MONGODB_URI: process.env.MONGODB_URI,
	JWT_SECRET: process.env.JWT_SECRET || 'default-secret-key-change-in-production',
	JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
	// Variables Cloudinary
	CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
	NODE_ENV: process.env.NODE_ENV || 'development'
};

export default env;
