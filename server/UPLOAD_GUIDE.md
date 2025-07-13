# MemoTrip Server - Guide d'utilisation des uploads

## 🎯 Fonctionnalités implémentées

### ✅ Winston Logging

- Logs automatiques dans `logs/`
- Logs d'erreurs, d'accès HTTP et combinés
- Rotation automatique des fichiers de logs
- Format JSON structuré avec détails des requêtes

### ✅ Sécurité (CORS, Helmet, Rate Limiting)

- **CORS** configuré pour accepter le client local (http://localhost:5173)
- **Helmet** pour la sécurité des headers HTTP avec CSP
- **Rate Limiting** : 
  - Général : 100 req/15min
  - Strict : 20 req/15min (auth)
  - Upload : 10 req/15min (uploads)

### ✅ Upload de fichiers (Multer)

- Support images : JPG, JPEG, PNG, GIF, WebP
- Support documents : PDF, TXT, CSV
- Validation des types MIME et extensions
- Gestion automatique des noms de fichiers (timestamp + random)
- Suppression automatique en cas d'erreur
- Métadonnées complètes (taille, type MIME, date d'upload)

## 📡 Endpoints d'upload

### 1. Upload d'avatar utilisateur

```bash
PUT /api/users/:userId/avatar
Content-Type: multipart/form-data

# Un seul fichier avatar (max 5MB)
avatar: file.jpg
```

**Réponse :**
```json
{
  "message": "Avatar mis à jour avec succès",
  "user": {
    "id": "userId",
    "name": "User Name",
    "avatar": {
      "url": "/uploads/avatar-timestamp-random.jpg",
      "filename": "avatar-timestamp-random.jpg",
      "uploadedAt": "2025-07-13T17:00:00.000Z"
    }
  }
}
```

### 2. Upload de photos pour un lieu

```bash
POST /api/places/:placeId/photos
Content-Type: multipart/form-data

# Jusqu'à 5 photos (max 5MB chacune)
photos: [photo1.jpg, photo2.png, ...]
captions: ["Description 1", "Description 2", ...]  # Optionnel, format JSON array
```

**Réponse :**
```json
{
  "message": "Photos ajoutées avec succès",
  "place": {
    "id": "placeId",
    "name": "Nom du lieu",
    "photos": [
      {
        "url": "/uploads/photo-timestamp-random.jpg",
        "filename": "photo-timestamp-random.jpg",
        "caption": "Belle vue",
        "size": 123456,
        "mimetype": "image/jpeg",
        "uploadedAt": "2025-07-13T17:00:00.000Z",
        "_id": "photoId"
      }
    ],
    "total_photos": 3
  }
}
```

### 3. Récupération des photos d'un lieu

```bash
GET /api/places/:placeId/photos
```

### 4. Suppression d'avatar

```bash
DELETE /api/users/:userId/avatar
```

### 5. Suppression de photo d'un lieu

```bash
DELETE /api/places/:placeId/photos/:photoId
```

```bash
DELETE /api/users/:userId/avatar
```

### 4. Suppression de photo d'un lieu

```bash
DELETE /api/places/:placeId/photos/:photoId
```

## 🧪 Tests avec Insomnia/Postman

### Test upload d'avatar

1. **Créer un utilisateur :**
```bash
POST http://localhost:30000/api/users
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123"
}
```

2. **Uploader l'avatar :**
```bash
PUT http://localhost:3000/api/users/{USER_ID}/avatar
Content-Type: multipart/form-data

Body:
- avatar: [sélectionner un fichier image]
```

### Test upload de photos pour un lieu

1. **Créer un lieu :**
```bash
POST http://localhost:3000/api/places
Content-Type: application/json

{
  "name": "Test Place",
  "description": "Description du lieu",
  "location": {
    "type": "Point",
    "coordinates": [2.3522, 48.8566]
  },
  "address": "Paris, France"
}
```

2. **Uploader photos avec captions :**
```bash
POST http://localhost:3000/api/places/{PLACE_ID}/photos
Content-Type: multipart/form-data

Body:
- photos: [sélectionner 1-5 images]
- captions: ["Photo 1", "Photo 2", "Photo 3"]  # Format JSON array
```

### Test récupération des photos

```bash
GET http://localhost:3000/api/places/{PLACE_ID}/photos
```

## ⚠️ Validations et limites

### Validation des fichiers
- **Types autorisés :** JPG, JPEG, PNG, GIF, WebP
- **Taille maximale :** 5MB par fichier
- **Nombre maximum :** 5 photos par lieu, 1 avatar par utilisateur

### Validation des ObjectId
- Tous les IDs de paramètres URL sont validés comme ObjectId MongoDB valides
- Erreur 400 si l'ID n'est pas au bon format

### Gestion des erreurs upload
- Suppression automatique des fichiers si échec
- Nettoyage des anciens fichiers lors du remplacement
- Vérification que le total de photos ne dépasse pas 5

## 🔄 Problèmes résolus

### ✅ Routing corrigé
Les routes sont maintenant dans le bon ordre pour éviter les conflits :
```javascript
// Routes spécifiques AVANT les routes avec :id
router.get('/nearby', ...)
router.post('/:id/photos', ...)
router.get('/:id/photos', ...)

// Routes avec :id À LA FIN
router.get('/:id', ...)
```

### ✅ Cohérence des champs
- Tous les champs utilisent `uploadedAt` (camelCase)
- Métadonnées complètes : url, filename, caption, size, mimetype, uploadedAt

### ✅ Validation ObjectId
- Validation des IDs avant les requêtes MongoDB
- Messages d'erreur explicites

## 🔐 Rate Limiting

Les endpoints ont des limites différentes :

- **Général** : 100 requêtes / 15 minutes / IP
- **Upload** : 10 uploads / 15 minutes / IP (appliqué aux routes d'upload)
- **Strict** : 20 requêtes / 15 minutes / IP (pour les routes sensibles)

Messages d'erreur quand la limite est atteinte :
```json
{
  "error": "Too many requests",
  "message": "Trop de requêtes, réessayez dans 15 minutes",
  "retryAfter": "15 minutes"
}
```

## 📂 Structure des fichiers

```
server/
├── logs/                    # Logs Winston
│   ├── error.log           # Erreurs uniquement
│   ├── combined.log        # Tous les logs
│   └── access.log          # Logs HTTP
├── uploads/                # Fichiers uploadés
│   ├── avatar-*.jpg        # Avatars utilisateurs
│   └── photo-*.jpg         # Photos des lieux
└── src/
    ├── config/
    │   ├── logger.config.js      # Configuration Winston
    │   ├── security.config.js    # CORS, Helmet, Rate Limiting
    │   ├── multer.config.js      # Configuration uploads
    │   └── app.config.js         # App principale avec middleware
    ├── controllers/
    │   ├── user.controller.js    # Avatar upload/delete
    │   └── place.controller.js   # Photo upload/delete
    ├── models/
    │   ├── User.js              # Schema avec avatar
    │   └── Place.js             # Schema avec photos array
    └── routes/
        ├── user.routes.js       # Routes avatar
        └── place.routes.js      # Routes photos
```

## 🔧 Configuration

### Variables d'environnement

```env
NODE_ENV=development
LOG_LEVEL=info
CLIENT_URL=http://localhost:5173
DATABASE_URL=mongodb://localhost:27017/memo-trip
PORT=3000
```

### Limites configurables dans multer.config.js

```javascript
// Taille max fichier : 5MB (images)
fileSize: 5 * 1024 * 1024

// Types autorisés
allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

// Nombre max de fichiers
maxCount: 5 (photos), 1 (avatar)
```

## 🚨 Gestion d'erreurs

### Erreurs automatiquement gérées :
- **Validation des fichiers :** Type, taille, nombre
- **Validation des ObjectId :** Format MongoDB
- **Limite de photos :** Maximum 5 par lieu
- **Nettoyage automatique :** Suppression des fichiers en cas d'échec
- **Logging complet :** Toutes les erreurs loggées avec Winston

### Types d'erreurs courants :

```json
// Fichier trop volumineux
{
  "message": "File too large",
  "error": "File size exceeds 5MB limit"
}

// Type de fichier invalide
{
  "message": "Invalid file type",
  "error": "Only JPEG, PNG, GIF, WebP images are allowed"
}

// Trop de photos
{
  "message": "Maximum 5 photos autorisées par lieu",
  "error": "Vous ne pouvez ajouter que 2 photo(s) de plus"
}

// ObjectId invalide
{
  "message": "Invalid place ID format",
  "error": "Place ID must be a valid MongoDB ObjectId"
}
```

## 📊 Monitoring et Logs

### Consulter les logs en temps réel :

```bash
# Tous les logs
dans logs 
```

### Logs des uploads :
```json
{
  "level": "info",
  "message": "Photos added to place",
  "placeId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "photoCount": 2,
  "filenames": ["photo-123456789.jpg", "photo-987654321.png"],
  "timestamp": "2025-07-13T17:00:00.000Z"
}
```

## 🚀 Prêt pour la production

Le serveur inclut maintenant toutes les sécurités et fonctionnalités nécessaires :

- ✅ Logging complet avec Winston
- ✅ Sécurité CORS & Helmet  
- ✅ Rate limiting configurable
- ✅ Upload sécurisé avec validation
- ✅ Gestion d'erreurs robuste
- ✅ Nettoyage automatique des fichiers
- ✅ Routes correctement organisées
- ✅ Validation des ObjectId MongoDB
