# Thème Material-UI pour MemoTrip

Ce projet utilise un thème Material-UI personnalisé basé sur votre palette de couleurs et vos wireframes.

## Palette de couleurs

### Couleurs principales

- **Primary (Bleu foncé)**: `#3D5A80` - Utilisé pour les éléments principaux
- **Secondary (Bleu moyen)**: `#7A9CC6` - Utilisé pour les éléments secondaires
- **Accent (Coral)**: `#E07A5F` - Utilisé pour les boutons d'action et les éléments saillants

### Couleurs de fond

- **Background**: `#F8FAFC` - Fond principal de l'application
- **Paper**: `#FFFFFF` - Fond des cartes et conteneurs
- **Secondary**: `#F1F5F9` - Fond secondaire pour les zones de contenu

### Couleurs de texte

- **Primary**: `#2D3748` - Texte principal
- **Secondary**: `#64748B` - Texte secondaire
- **Disabled**: `#94A3B8` - Texte désactivé

## Composants créés

### 1. ThemeProvider (`src/providers/ThemeProvider.tsx`)

- Wrapper principal pour l'application
- Intègre le thème Material-UI et CssBaseline

### 2. AppHeader (`src/components/Layout/AppHeader.tsx`)

- Header fixe avec logo et avatar utilisateur
- Utilise les couleurs du thème

### 3. Sidebar (`src/components/Layout/Sidebar.tsx`)

- Sidebar avec liste des lieux
- Bouton d'ajout avec couleur accent
- Sélection avec couleurs primaires

### 4. Dashboard (`src/components/Dashboard/Dashboard.tsx`)

- Vue principale avec carte interactive
- Section "Recent places" avec cartes
- Statistiques (Total places, Countries)

### 5. PlaceCard (`src/components/Dashboard/PlaceCard.tsx`)

- Carte pour afficher un lieu
- Grille d'images avec placeholders
- Effets hover intégrés

### 6. PlaceDetail (`src/components/PlaceDetail/PlaceDetail.tsx`)

- Vue détaillée d'un lieu
- Sections Notes et Photos
- Bouton de téléchargement

## Utilisation du thème

### Accès aux couleurs personnalisées

```tsx
import { useTheme } from '@mui/material/styles';

const theme = useTheme();

// Utilisation des couleurs
sx={{
  backgroundColor: 'primary.main',
  color: 'primary.contrastText',
  '&:hover': {
    backgroundColor: 'primary.dark',
  },
}}

// Couleur accent personnalisée
sx={{
  backgroundColor: 'accent.main',
  color: 'accent.contrastText',
}}
```

### Personnalisation des composants

Le thème inclut des personnalisations pour :

- **Buttons** : Bordures arrondies, pas de transformation de texte
- **Cards** : Ombres douces, bordures arrondies
- **TextFields** : Bordures personnalisées
- **Chips** : Bordures arrondies

### Responsive Design

Les composants utilisent des breakpoints Material-UI :

- `xs` (mobile)
- `sm` (tablette)
- `md` (desktop)
- `lg` (grand écran)

## Structure des fichiers

```
src/
├── theme/
│   └── index.ts              # Configuration du thème principal
├── providers/
│   └── ThemeProvider.tsx     # Provider pour le thème
├── components/
│   ├── Layout/
│   │   ├── AppHeader.tsx
│   │   └── Sidebar.tsx
│   ├── Dashboard/
│   │   ├── Dashboard.tsx
│   │   └── PlaceCard.tsx
│   └── PlaceDetail/
│       └── PlaceDetail.tsx
└── App.tsx                   # Application principale
```

## Prochaines étapes

1. **Ajouter des icônes personnalisées** pour les différentes actions
2. **Implémenter la carte interactive** avec une bibliothèque comme MapBox
3. **Ajouter des animations** pour améliorer l'expérience utilisateur
4. **Créer des variantes de thème** (mode sombre, autres palettes)
5. **Ajouter la gestion d'état** avec Redux ou Context API
6. **Intégrer des tests** pour les composants du thème

## Commandes utiles

```bash
# Démarrer le serveur de développement
npm run dev

# Formater le code
npm run format

# Vérifier les erreurs de linting
npm run lint

# Construire pour la production
npm run build
```
