import app from './src/config/app.config.js';
import userRoutes from './src/routes/user.routes.js';
import placeRoutes from './src/routes/place.routes.js';
import noteRoutes from './src/routes/notes.routes.js';
import photoRoutes from './src/routes/photo.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';
import errorHandler from './src/middleware/errorHandler.js';

// Configuration des routes
app.use('/api/users', userRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Démarrage du serveur
app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
