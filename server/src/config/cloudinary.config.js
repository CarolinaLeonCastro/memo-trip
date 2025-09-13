import { v2 as cloudinary } from 'cloudinary';
import logger from './logger.config.js';
import env from './dotenv.config.js';

// Configuration Cloudinary avec les variables d'environnement
cloudinary.config({
	cloud_name: env.CLOUDINARY_CLOUD_NAME,
	api_key: env.CLOUDINARY_API_KEY,
	api_secret: env.CLOUDINARY_API_SECRET
});

// Debug : Vérifier la configuration (sans révéler les secrets)
logger.info('🌩️ Configuration Cloudinary initialisée:', {
	cloud_name: env.CLOUDINARY_CLOUD_NAME ? `${env.CLOUDINARY_CLOUD_NAME.substring(0, 5)}...` : 'MISSING',
	api_key: env.CLOUDINARY_API_KEY ? `${env.CLOUDINARY_API_KEY.substring(0, 5)}...` : 'MISSING',
	api_secret: env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING',
	config_test: env.CLOUDINARY_CLOUD_NAME ? 'OK' : '❌ CLOUD_NAME MISSING'
});

/**
 * Upload d'une image vers Cloudinary
 * @param {String} filePath - Chemin du fichier local
 * @param {String} folder - Dossier Cloudinary (ex: 'places', 'journals')
 * @param {String} publicId - ID public custom (optionnel)
 * @returns {Promise<Object>} Résultat de l'upload
 */
export const uploadImage = async (filePath, folder = 'memo-trip', publicId = null) => {
	try {
		const options = {
			folder,
			resource_type: 'image',
			quality: 'auto:good',
			fetch_format: 'auto'
		};

		if (publicId) {
			options.public_id = publicId;
		}

		logger.info(`📤 Uploading image to Cloudinary`, {
			filePath,
			folder,
			publicId
		});

		const result = await cloudinary.uploader.upload(filePath, options);

		logger.info(`✅ Image uploaded successfully`, {
			public_id: result.public_id,
			secure_url: result.secure_url,
			width: result.width,
			height: result.height,
			bytes: result.bytes
		});

		return {
			url: result.secure_url,
			public_id: result.public_id,
			width: result.width,
			height: result.height,
			format: result.format,
			size: result.bytes,
			created_at: result.created_at
		};
	} catch (error) {
		logger.error('❌ Cloudinary upload failed', {
			error: error.message,
			filePath,
			folder
		});
		throw new Error(`Erreur lors de l'upload vers Cloudinary: ${error.message}`);
	}
};

/**
 * Suppression d'une image de Cloudinary
 * @param {String} publicId - ID public de l'image à supprimer
 * @returns {Promise<Object>} Résultat de la suppression
 */
export const deleteImage = async (publicId) => {
	try {
		logger.info(`🗑️ Deleting image from Cloudinary`, { publicId });

		const result = await cloudinary.uploader.destroy(publicId);

		if (result.result === 'ok') {
			logger.info(`✅ Image deleted successfully`, { publicId });
		} else {
			logger.warn(`⚠️ Image deletion result: ${result.result}`, { publicId });
		}

		return result;
	} catch (error) {
		logger.error('❌ Cloudinary deletion failed', {
			error: error.message,
			publicId
		});
		throw new Error(`Erreur lors de la suppression de Cloudinary: ${error.message}`);
	}
};

/**
 * Génération d'URL avec transformations
 * @param {String} publicId - ID public de l'image
 * @param {Object} transformations - Transformations à appliquer
 * @returns {String} URL transformée
 */
export const getTransformedUrl = (publicId, transformations = {}) => {
	const defaultTransformations = {
		quality: 'auto:good',
		fetch_format: 'auto'
	};

	const finalTransformations = { ...defaultTransformations, ...transformations };

	return cloudinary.url(publicId, finalTransformations);
};

/**
 * Générateur d'URLs pour différentes tailles d'images
 * @param {String} publicId - ID public de l'image
 * @returns {Object} URLs pour différentes tailles
 */
export const generateImageVariants = (publicId) => {
	return {
		thumbnail: getTransformedUrl(publicId, {
			width: 150,
			height: 150,
			crop: 'fill',
			gravity: 'face'
		}),
		small: getTransformedUrl(publicId, {
			width: 300,
			height: 200,
			crop: 'fill'
		}),
		medium: getTransformedUrl(publicId, {
			width: 600,
			height: 400,
			crop: 'fill'
		}),
		large: getTransformedUrl(publicId, {
			width: 1200,
			height: 800,
			crop: 'fill'
		}),
		original: getTransformedUrl(publicId)
	};
};

export default cloudinary;
