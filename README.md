# MemoTrip 📍

<div align="center">

**Application web de carnets de voyage interactifs**

*Créez, partagez et découvrez des aventures à travers le monde*

![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Node.js](https://img.shields.io/badge/Node.js-Latest-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)
![Material-UI](https://img.shields.io/badge/Material--UI-7.2.0-purple)

</div>

## 📖 À propos

MemoTrip est une application web moderne qui permet aux utilisateurs de créer, gérer et partager leurs carnets de voyage de manière interactive. Documentez vos aventures avec des photos, des notes détaillées, et visualisez vos parcours sur une carte interactive.

### ✨ Fonctionnalités principales

- **🗺️ Cartes interactives** : Visualisez tous vos lieux visités sur une carte Leaflet
- **📔 Carnets de voyage** : Créez et organisez vos journaux avec photos et descriptions
- **📍 Gestion des lieux** : Ajoutez des lieux visités avec géolocalisation, photos et notes
- **🌍 Mode public** : Partagez vos aventures avec la communauté
- **🔍 Découverte** : Explorez les carnets publics d'autres voyageurs
- **👤 Profils utilisateurs** : Gérez votre profil et suivez vos statistiques
- **⚙️ Administration** : Dashboard complet pour les administrateurs
- **🏷️ Tags et recherche** : Organisez et trouvez facilement vos contenus

## 🛠️ Technologies utilisées

### Frontend
- **React 19.1.0** avec TypeScript
- **Material-UI 7.2.0** pour l'interface utilisateur
- **React Router** pour la navigation
- **Leaflet** pour les cartes interactives
- **Vite** comme bundler
- **Axios** pour les requêtes API

### Backend
- **Node.js** avec Express 5.1.0
- **MongoDB** avec Mongoose
- **JWT** pour l'authentification
- **Multer** pour l'upload de fichiers
- **bcryptjs** pour le hashage des mots de passe
- **Winston** pour les logs

### Outils de développement
- **ESLint** & **Prettier** pour la qualité de code
- **Husky** pour les hooks Git
- **Nodemon** pour le développement

## 🚀 Installation et lancement

### Prérequis
- Node.js (version 18+)
- MongoDB
- npm ou yarn

### 1. Cloner le projet
```bash
https://github.com/CarolinaLeonCastro/memo-trip.git

```

### 2. Installation des dépendances

**Backend :**
```bash
cd server
npm install
```

**Frontend :**
```bash
cd client
npm install
```

### 3. Configuration de l'environnement

Créez un fichier `.env` dans le dossier `server` avec les variables suivantes :
```env
# Base de données
MONGO_URI=mongodb://localhost:27017/memo-trip

# JWT
JWT_SECRET=votre_secret_jwt_super_securise
JWT_EXPIRES_IN=7d

# Serveur
PORT=3000
NODE_ENV=development

```

### 4. Lancement de l'application

**Démarrer le serveur backend :**
```bash
cd server
npm run dev
```

**Démarrer le client frontend :**
```bash
cd client
npm run dev
```

L'application sera accessible à l'adresse : `http://localhost:5173`

## 📋 Scripts disponibles

### Backend (server/)
```bash
npm start          # Lancer en production
npm run dev        # Lancer en développement avec nodemon
npm run seed       # Initialiser la base de données
npm run lint       # Vérifier le code avec ESLint
npm run format     # Formater le code avec Prettier
```

### Frontend (client/)
```bash
npm run dev        # Lancer le serveur de développement
npm run build      # Construire pour la production
npm run preview    # Prévisualiser le build de production
npm run lint       # Vérifier le code avec ESLint
npm run format     # Formater le code avec Prettier
```

## 🗂️ Structure du projet

```
memo-trip/
├── client/                 # Application React (Frontend)
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── context/        # Contextes React
│   │   ├── services/       # Services API
│   │   ├── hooks/          # Hooks personnalisés
│   │   ├── types/          # Types TypeScript
│   │   └── utils/          # Utilitaires
│   ├── public/             # Fichiers statiques
│   └── package.json
│
├── server/                 # API Node.js (Backend)
│   ├── src/
│   │   ├── controllers/    # Contrôleurs
│   │   ├── models/         # Modèles MongoDB
│   │   ├── routes/         # Routes API
│   │   ├── middleware/     # Middlewares
│   │   ├── services/       # Services métier
│   │   ├── config/         # Configuration
│   │   └── utils/          # Utilitaires
│   ├── uploads/            # Fichiers uploadés
│   └── package.json
│
└── README.md
```

## 🔐 Authentification et autorisation

L'application utilise un système d'authentification JWT avec trois niveaux d'accès :

- **👤 Utilisateur** : Peut créer et gérer ses propres carnets
- **👑 Administrateur** : Accès complet au dashboard admin
- **🌍 Public** : Accès en lecture aux contenus publics

## 🎯 Fonctionnalités détaillées

### Carnets de voyage
- Création avec titre, description, dates de voyage
- Ajout de lieux visités avec géolocalisation
- Upload d'images avec légendes
- Système de tags pour l'organisation
- Partage public

### Lieux
- Géolocalisation automatique
- Photos multiples avec légendes
- Notes personnelles détaillées
- Évaluation par étoiles
- Informations de budget
- Durée de visite

### Carte interactive
- Affichage de tous les lieux visités
- Navigation fluide entre les lieux
- Clustering pour les zones denses
- Popup d'informations détaillées

### Administration
- Tableau de bord avec statistiques
- Gestion des utilisateurs
- Configuration système

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment procéder :

1. **Fork** le projet
2. Créez votre **branche feature** (`git checkout -b feature/client ou server + ma-nouvelle-fonctionnalite`)
3. **Committez** vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. **Push** vers la branche (`git push origin feature/ma-nouvelle-fonctionnalite`)
5. Ouvrez une **Pull Request**

### Standards de code
- Utilisez **ESLint** et **Prettier** pour maintenir la qualité du code
- Écrivez des messages de commit descriptifs
- Documentez vos nouvelles fonctionnalités
- Testez avant de soumettre

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Astrid Leon**
- GitHub: [@CarolinaLeonCastro](https://github.com/CarolinaLeonCastro)
- Email: leoncarolina35@gmail.com

---

<div align="center">

**Fait avec ❤️ pour les passionnés de voyage**

⭐ Si ce projet vous a plu, n'hésitez pas à lui donner une étoile !

</div>