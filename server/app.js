import app from './src/config/app.config.js';
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import journalRoutes from './src/routes/journal.routes.js';
import placeRoutes from './src/routes/place.routes.js';
import searchRoutes from './src/routes/search.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import publicRoutes from './src/routes/public.routes.js';
import setupRoutes from './src/routes/setup.routes.js';
import errorHandler from './src/middleware/errorHandler.js';
import logger from './src/config/logger.config.js';
import geocodingRoutes from './src/routes/geocoding.routes.js';

// Configuration des routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/geocoding', geocodingRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/setup', setupRoutes);

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Démarrage du serveur
app.listen(process.env.PORT, () => {
	logger.info(`Server is running on port ${process.env.PORT}`);
});
