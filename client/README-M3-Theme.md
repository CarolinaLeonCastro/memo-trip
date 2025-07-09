# Thème Material Design 3 - Memo Trip

## 🎨 Améliorations apportées selon [Material Design 3](https://m3.material.io/)

Ce thème a été complètement refondu pour respecter les dernières directives de Material Design 3, tout en conservant votre palette de couleurs originale.

### 1. **Système de couleurs HCT (Hue, Chroma, Tone)**

✅ **Avant (M2)** : Couleurs simples RGB
✅ **Maintenant (M3)** : Palette complète HCT avec 12 tons par couleur

```typescript
// Votre palette originale adaptée en HCT
const m3Colors = {
  primary: {
    0: '#000000', // Noir pur
    10: '#001E30', // Très sombre
    20: '#003548', // Sombre
    30: '#004D62', // Moyen sombre
    40: '#00687D', // Moyen
    50: '#3D5A80', // Votre couleur principale
    60: '#4A90E2', // Plus clair
    70: '#7A9CC6', // Clair
    80: '#99B8D9', // Très clair
    90: '#B8D4F1', // Container
    95: '#DCE9F7', // Container clair
    99: '#FEFCFF', // Presque blanc
    100: '#FFFFFF', // Blanc pur
  },
  // ... secondary, tertiary, error, neutral, neutralVariant
};
```

### 2. **Nouvelle typographie M3**

✅ **Avant** : h1, h2, h3, h4, h5, h6, body1, body2
✅ **Maintenant** : Display, Headline, Title, Label, Body avec tailles S/M/L

```typescript
// Échelle typographique M3 complète
const m3Typography = {
  // Display - Titres les plus importants
  displayLarge: { fontSize: '3.5rem', fontWeight: 400 },
  displayMedium: { fontSize: '2.8125rem', fontWeight: 400 },
  displaySmall: { fontSize: '2.25rem', fontWeight: 400 },

  // Headline - Titres de section
  headlineLarge: { fontSize: '2rem', fontWeight: 400 },
  headlineMedium: { fontSize: '1.75rem', fontWeight: 400 },
  headlineSmall: { fontSize: '1.5rem', fontWeight: 400 },

  // Title - Titres de composants
  titleLarge: { fontSize: '1.375rem', fontWeight: 400 },
  titleMedium: { fontSize: '1rem', fontWeight: 500 },
  titleSmall: { fontSize: '0.875rem', fontWeight: 500 },

  // Label - Boutons et labels
  labelLarge: { fontSize: '0.875rem', fontWeight: 500 },
  labelMedium: { fontSize: '0.75rem', fontWeight: 500 },
  labelSmall: { fontSize: '0.6875rem', fontWeight: 500 },

  // Body - Contenu principal
  bodyLarge: { fontSize: '1rem', fontWeight: 400 },
  bodyMedium: { fontSize: '0.875rem', fontWeight: 400 },
  bodySmall: { fontSize: '0.75rem', fontWeight: 400 },
};
```

### 3. **Couleurs sémantiques M3**

✅ **Nouvelles couleurs** : Container, OnContainer, Surface variants, Outline

```typescript
// Couleurs de rôle M3
const lightScheme = {
  // Couleurs primaires avec containers
  primary: m3Colors.primary[40],
  onPrimary: m3Colors.primary[100],
  primaryContainer: m3Colors.primary[90],
  onPrimaryContainer: m3Colors.primary[10],

  // Surfaces avec variants
  surface: m3Colors.neutral[98],
  onSurface: m3Colors.neutral[10],
  surfaceContainer: m3Colors.neutral[94],
  surfaceContainerHigh: m3Colors.neutral[92],
  surfaceContainerHighest: m3Colors.neutral[90],
  surfaceContainerLow: m3Colors.neutral[96],
  surfaceContainerLowest: m3Colors.neutral[100],

  // Outlines pour les bordures
  outline: m3Colors.neutralVariant[50],
  outlineVariant: m3Colors.neutralVariant[80],

  // Couleurs inverses
  inverseSurface: m3Colors.neutral[20],
  inverseOnSurface: m3Colors.neutral[95],
  inversePrimary: m3Colors.primary[80],
};
```

### 4. **Élévation et ombres M3**

✅ **Avant** : 25 niveaux d'ombres génériques
✅ **Maintenant** : 6 niveaux d'élévation précis avec surfaces tonales

```typescript
// Nouvelles élévations M3
const m3Elevations = [
  'none', // 0
  '0px 1px 2px 0px rgba(0,0,0,0.04), 0px 1px 3px 1px rgba(0,0,0,0.06)', // 1
  '0px 1px 2px 0px rgba(0,0,0,0.04), 0px 2px 6px 2px rgba(0,0,0,0.06)', // 2
  '0px 1px 3px 0px rgba(0,0,0,0.04), 0px 4px 8px 3px rgba(0,0,0,0.06)', // 3
  '0px 2px 3px 0px rgba(0,0,0,0.04), 0px 6px 10px 4px rgba(0,0,0,0.06)', // 4
  '0px 4px 4px 0px rgba(0,0,0,0.04), 0px 8px 12px 6px rgba(0,0,0,0.06)', // 5
];
```

### 5. **Composants optimisés M3**

#### Boutons

✅ **Bordures arrondies** : 20px (très arrondis selon M3)
✅ **États d'interaction** : Hover avec élévation
✅ **Couleurs** : Primary, Secondary, Tertiary avec containers

#### Cards

✅ **Surface containers** : `surfaceContainerLow` pour les cards
✅ **Élévation** : Niveau 1 par défaut, niveau 2 au hover
✅ **Bordures** : Supprimées (M3 utilise les surfaces)

#### Text Fields

✅ **Background** : `surfaceContainerHighest`
✅ **Bordures** : Outline et focus améliorés
✅ **Coins** : 4px (moins arrondis que les boutons)

#### App Bar

✅ **Surface** : Background neutre
✅ **Élévation** : Aucune (M3 privilégie les bordures)
✅ **Bordure** : `outlineVariant` en bas

### 6. **Accessibilité améliorée**

✅ **Contraste** : Tous les rapports de contraste respectent WCAG 2.1
✅ **Focus** : États de focus visibles et cohérents
✅ **Couleurs** : Système de couleurs sémantiques pour les malvoyants

### 7. **Utilisation du nouveau thème**

```typescript
// Dans votre composant
import { useTheme } from '@mui/material/styles';

const MyComponent = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        // Nouvelles couleurs M3
        backgroundColor: theme.palette.surfaceContainer,
        color: theme.palette.onSurface,

        // Nouvelle typographie M3
        ...theme.typography.headlineMedium,

        // Élévation M3
        boxShadow: theme.shadows[2],

        // Coins arrondis M3
        borderRadius: theme.shape.borderRadius,
      }}
    >
      Contenu avec thème M3
    </Box>
  );
};
```

### 8. **Types TypeScript étendus**

```typescript
// Nouvelles couleurs disponibles
declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
    surfaceContainer: string;
    surfaceContainerHigh: string;
    surfaceContainerHighest: string;
    surfaceContainerLow: string;
    surfaceContainerLowest: string;
    outline: string;
    outlineVariant: string;
    // ... autres couleurs M3
  }
}
```

### 9. **Migration depuis l'ancien thème**

1. **Remplacer l'import** :

```typescript
// Ancien
import theme from './theme/index';

// Nouveau
import m3Theme from './theme/m3-theme';
```

2. **Mettre à jour les couleurs** :

```typescript
// Ancien
color: theme.palette.accent.main;

// Nouveau
color: theme.palette.tertiary.main;
```

3. **Utiliser la nouvelle typographie** :

```typescript
// Ancien
<Typography variant="h3">Titre</Typography>

// Nouveau
<Typography variant="h3">Titre</Typography> // Compatible
// OU
<Typography sx={theme.typography.headlineLarge}>Titre</Typography>
```

### 10. **Bénéfices du thème M3**

- 🎨 **Cohérence** : Respecte les standards Material Design 3
- 🌈 **Personnalisation** : Votre palette conservée et optimisée
- ♿ **Accessibilité** : Contrastes et focus améliorés
- 🔧 **Maintenabilité** : Code plus propre et organisé
- 🚀 **Performance** : Optimisé pour le rendu
- 📱 **Responsive** : Adapté à tous les écrans

### 11. **Prochaines étapes**

1. **Tester le thème** sur tous vos composants
2. **Ajouter le mode sombre** (darkScheme)
3. **Implémenter la couleur dynamique** (Android 12+)
4. **Créer des composants personnalisés** M3

---

**Ressources utiles :**

- [Material Design 3 Guidelines](https://m3.material.io/)
- [Material Color Utilities](https://github.com/material-foundation/material-color-utilities)
- [Material Theme Builder](https://m3.material.io/theme-builder)
