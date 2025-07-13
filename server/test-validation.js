import { userValidation, journalValidation, placeValidation, geoValidation } from './src/validation/schemas.js';

console.log('🧪 Test des schémas de validation Joi\n');

// Test User validation
console.log('👤 Test User Validation:');

// Test valide
const validUser = {
	name: 'John Doe',
	email: 'john@example.com',
	password: 'password123'
};

const userResult = userValidation.create.validate(validUser);
console.log('✅ User valide:', userResult.error ? 'ÉCHEC' : 'SUCCÈS');

// Test invalide
const invalidUser = {
	name: 'J', // Trop court
	email: 'invalid-email', // Email invalide
	password: '123' // Trop court
};

const invalidUserResult = userValidation.create.validate(invalidUser);
console.log('❌ User invalide:', invalidUserResult.error ? 'ERREURS DÉTECTÉES' : 'PROBLÈME');
if (invalidUserResult.error) {
	invalidUserResult.error.details.forEach((err) => {
		console.log(`   - ${err.path.join('.')}: ${err.message}`);
	});
}

console.log('\n📖 Test Journal Validation:');

// Test valide
const validJournal = {
	title: 'Mon voyage à Paris',
	description: 'Un voyage magnifique',
	start_date: '2024-06-01',
	end_date: '2024-06-10',
	user_id: '60f7b3b3b3b3b3b3b3b3b3b3'
};

const journalResult = journalValidation.create.validate(validJournal);
console.log('✅ Journal valide:', journalResult.error ? 'ÉCHEC' : 'SUCCÈS');

// Test invalide
const invalidJournal = {
	title: 'AB', // Trop court
	start_date: '2024-06-10',
	end_date: '2024-06-01', // Date de fin avant date de début
	user_id: 'invalid-id' // ObjectId invalide
};

const invalidJournalResult = journalValidation.create.validate(invalidJournal);
console.log('❌ Journal invalide:', invalidJournalResult.error ? 'ERREURS DÉTECTÉES' : 'PROBLÈME');
if (invalidJournalResult.error) {
	invalidJournalResult.error.details.forEach((err) => {
		console.log(`   - ${err.path.join('.')}: ${err.message}`);
	});
}

console.log('\n📍 Test Place Validation:');

// Test valide
const validPlace = {
	name: 'Tour Eiffel',
	description: 'Monument emblématique de Paris',
	location: {
		type: 'Point',
		coordinates: [2.2945, 48.8584], // [longitude, latitude]
		address: 'Champ de Mars, 75007 Paris',
		city: 'Paris',
		country: 'France'
	},
	date_visited: '2024-06-05',
	rating: 5,
	weather: 'Ensoleillé',
	budget: 25.5,
	tags: ['monument', 'historique', 'vue'],
	user_id: '60f7b3b3b3b3b3b3b3b3b3b3',
	journal_id: '60f7b3b3b3b3b3b3b3b3b3b4'
};

const placeResult = placeValidation.create.validate(validPlace);
console.log('✅ Place valide:', placeResult.error ? 'ÉCHEC' : 'SUCCÈS');

// Test invalide
const invalidPlace = {
	name: 'A', // Trop court
	location: {
		coordinates: [200, 100] // Coordonnées invalides
	},
	date_visited: '2025-12-31', // Date dans le futur
	rating: 6, // Note trop élevée
	user_id: 'invalid',
	journal_id: 'invalid'
};

const invalidPlaceResult = placeValidation.create.validate(invalidPlace);
console.log('❌ Place invalide:', invalidPlaceResult.error ? 'ERREURS DÉTECTÉES' : 'PROBLÈME');
if (invalidPlaceResult.error) {
	invalidPlaceResult.error.details.forEach((err) => {
		console.log(`   - ${err.path.join('.')}: ${err.message}`);
	});
}

console.log('\n🌍 Test Geo Validation:');

// Test valide
const validGeoQuery = {
	lat: 48.8566,
	lng: 2.3522,
	maxDistance: 1000
};

const geoResult = geoValidation.nearby.validate(validGeoQuery);
console.log('✅ Geo query valide:', geoResult.error ? 'ÉCHEC' : 'SUCCÈS');

// Test invalide
const invalidGeoQuery = {
	lat: 100, // Latitude invalide
	lng: 200, // Longitude invalide
	maxDistance: 100000 // Distance trop grande
};

const invalidGeoResult = geoValidation.nearby.validate(invalidGeoQuery);
console.log('❌ Geo query invalide:', invalidGeoResult.error ? 'ERREURS DÉTECTÉES' : 'PROBLÈME');
if (invalidGeoResult.error) {
	invalidGeoResult.error.details.forEach((err) => {
		console.log(`   - ${err.path.join('.')}: ${err.message}`);
	});
}

console.log('\n🎉 Tests terminés!');
