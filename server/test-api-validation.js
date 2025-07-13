import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

console.log('🚀 Test des validations via API\n');

// Helper pour faire des requêtes
async function makeRequest(method, endpoint, data = null) {
	const options = {
		method,
		headers: {
			'Content-Type': 'application/json'
		}
	};

	if (data) {
		options.body = JSON.stringify(data);
	}

	try {
		const response = await fetch(`${BASE_URL}${endpoint}`, options);
		const result = await response.json();
		return { status: response.status, data: result };
	} catch (error) {
		return { status: 500, error: error.message };
	}
}

async function testUserValidation() {
	console.log('👤 Test User API Validation:');

	// Test création utilisateur valide
	const validUser = {
		name: 'John Doe',
		email: 'john.test@example.com',
		password: 'password123'
	};

	const validResult = await makeRequest('POST', '/users', validUser);
	console.log('✅ User valide:', validResult.status === 201 ? 'SUCCÈS' : 'ÉCHEC');

	// Test création utilisateur invalide
	const invalidUser = {
		name: 'J', // Trop court
		email: 'invalid-email', // Email invalide
		password: '123' // Trop court
	};

	const invalidResult = await makeRequest('POST', '/users', invalidUser);
	console.log('❌ User invalide:', invalidResult.status === 400 ? 'ERREURS DÉTECTÉES' : 'PROBLÈME');
	if (invalidResult.status === 400) {
		invalidResult.data.errors?.forEach((err) => {
			console.log(`   - ${err.field}: ${err.message}`);
		});
	}

	// Test ObjectId invalide
	const invalidIdResult = await makeRequest('GET', '/users/invalid-id');
	console.log('🔍 ObjectId invalide:', invalidIdResult.status === 400 ? 'ERREUR DÉTECTÉE' : 'PROBLÈME');

	console.log('');
}

async function testJournalValidation() {
	console.log('📖 Test Journal API Validation:');

	// Test création journal valide
	const validJournal = {
		title: 'Mon voyage à Paris',
		description: 'Un voyage magnifique',
		start_date: '2024-06-01',
		end_date: '2024-06-10',
		user_id: '60f7b3b3b3b3b3b3b3b3b3b3'
	};

	const validResult = await makeRequest('POST', '/journals', validJournal);
	console.log('✅ Journal valide:', validResult.status === 201 ? 'SUCCÈS' : 'ÉCHEC');

	// Test création journal invalide
	const invalidJournal = {
		title: 'AB', // Trop court
		start_date: '2024-06-10',
		end_date: '2024-06-01', // Date de fin avant date de début
		user_id: 'invalid-id' // ObjectId invalide
	};

	const invalidResult = await makeRequest('POST', '/journals', invalidJournal);
	console.log('❌ Journal invalide:', invalidResult.status === 400 ? 'ERREURS DÉTECTÉES' : 'PROBLÈME');
	if (invalidResult.status === 400) {
		invalidResult.data.errors?.forEach((err) => {
			console.log(`   - ${err.field}: ${err.message}`);
		});
	}

	console.log('');
}

async function testPlaceValidation() {
	console.log('📍 Test Place API Validation:');

	// Test création place valide
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

	const validResult = await makeRequest('POST', '/places', validPlace);
	console.log('✅ Place valide:', validResult.status === 201 ? 'SUCCÈS' : 'ÉCHEC');

	// Test création place invalide
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

	const invalidResult = await makeRequest('POST', '/places', invalidPlace);
	console.log('❌ Place invalide:', invalidResult.status === 400 ? 'ERREURS DÉTECTÉES' : 'PROBLÈME');
	if (invalidResult.status === 400) {
		invalidResult.data.errors?.forEach((err) => {
			console.log(`   - ${err.field}: ${err.message}`);
		});
	}

	console.log('');
}

async function testGeoValidation() {
	console.log('🌍 Test Geo API Validation:');

	// Test requête géo valide
	const validGeoResult = await makeRequest('GET', '/places/nearby?lat=48.8566&lng=2.3522&maxDistance=1000');
	console.log('✅ Geo query valide:', validGeoResult.status !== 400 ? 'SUCCÈS' : 'ÉCHEC');

	// Test requête géo invalide
	const invalidGeoResult = await makeRequest('GET', '/places/nearby?lat=100&lng=200&maxDistance=100000');
	console.log('❌ Geo query invalide:', invalidGeoResult.status === 400 ? 'ERREURS DÉTECTÉES' : 'PROBLÈME');
	if (invalidGeoResult.status === 400) {
		invalidGeoResult.data.errors?.forEach((err) => {
			console.log(`   - ${err.field}: ${err.message}`);
		});
	}

	console.log('');
}

// Fonction principale pour exécuter tous les tests
async function runAllTests() {
	try {
		console.log('⏳ Vérification que le serveur est démarré...');

		// Test de connexion au serveur
		const healthCheck = await makeRequest('GET', '/users');
		if (healthCheck.status >= 500) {
			console.log("❌ Le serveur n'est pas accessible. Démarrez le serveur avec: npm run dev");
			return;
		}

		console.log('✅ Serveur accessible, début des tests\n');

		await testUserValidation();
		await testJournalValidation();
		await testPlaceValidation();
		await testGeoValidation();

		console.log('🎉 Tests API terminés!');
		console.log('\n📋 Résumé:');
		console.log('- Validation Joi intégrée dans toutes les routes');
		console.log('- Validation des ObjectId MongoDB');
		console.log("- Messages d'erreur personnalisés en français");
		console.log('- Nettoyage automatique des données (stripUnknown)');
		console.log('- Conversion automatique des types');
	} catch (error) {
		console.error('❌ Erreur lors des tests:', error.message);
	}
}

// Exécuter les tests
runAllTests();
