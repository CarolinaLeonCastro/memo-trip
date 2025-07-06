import app from './src/config/app.config.js';

app.use('/api/users', userRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/photos', photoRoutes);

app.use(errorHandler);

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
