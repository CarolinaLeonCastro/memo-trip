import { createTheme, type Shadows } from '@mui/material/styles';

// ===== MATERIAL DESIGN 3 COLOR SYSTEM =====
// Basé sur votre palette existante, adaptée aux standards HCT (Hue, Chroma, Tone)

const m3Colors = {
  // Primary Palette (Bleu principal)
  primary: {
    0: '#000000',
    10: '#001E30',
    20: '#003548',
    30: '#004D62',
    40: '#00687D',
    50: '#3D5A80', // Votre couleur principale
    60: '#4A90E2', // Version plus claire pour les interactions
    70: '#7A9CC6',
    80: '#99B8D9',
    90: '#B8D4F1',
    95: '#DCE9F7',
    99: '#FEFCFF',
    100: '#FFFFFF',
  },

  // Secondary Palette (Bleu secondaire)
  secondary: {
    0: '#000000',
    10: '#0F1419',
    20: '#24292E',
    30: '#3A3F44',
    40: '#51575C',
    50: '#697075',
    60: '#7A9CC6', // Votre couleur secondaire
    70: '#94B0D4',
    80: '#B0C5E1',
    90: '#CCDAEE',
    95: '#E6EFFA',
    99: '#FEFCFF',
    100: '#FFFFFF',
  },

  // Tertiary Palette (Orange/Coral accent)
  tertiary: {
    0: '#000000',
    10: '#2B0E00',
    20: '#451A00',
    30: '#602800',
    40: '#7D3600',
    50: '#9C4500',
    60: '#E07A5F', // Votre couleur accent
    70: '#F2A389',
    80: '#FFBC9E',
    90: '#FFDBC7',
    95: '#FFEDE4',
    99: '#FFFBFF',
    100: '#FFFFFF',
  },

  // Error Palette
  error: {
    0: '#000000',
    10: '#410E0B',
    20: '#601410',
    30: '#8C1D18',
    40: '#B3261E',
    50: '#DC362E',
    60: '#E46962',
    70: '#EC928E',
    80: '#F2B8B5',
    90: '#F9DEDC',
    95: '#FCEEEE',
    99: '#FFFBF9',
    100: '#FFFFFF',
  },

  // Neutral Palette
  neutral: {
    0: '#000000',
    4: '#0F0F0F',
    6: '#141414',
    10: '#1F1F1F',
    12: '#212121',
    17: '#2C2C2C',
    20: '#313131',
    22: '#363636',
    24: '#393939',
    30: '#484848',
    40: '#606060',
    50: '#797979',
    60: '#939393',
    70: '#ADADAD',
    80: '#C9C9C9',
    87: '#DEDEDE',
    90: '#E5E5E5',
    92: '#EBEBEB',
    94: '#F0F0F0',
    95: '#F3F3F3',
    96: '#F5F5F5',
    98: '#FAFAFA',
    99: '#FCFCFC',
    100: '#FFFFFF',
  },

  // Neutral Variant Palette
  neutralVariant: {
    0: '#000000',
    10: '#191C20',
    20: '#2E3135',
    30: '#44474C',
    40: '#5C5F64',
    50: '#75787D',
    60: '#8E9297',
    70: '#A9ACB1',
    80: '#C4C7CC',
    90: '#E0E3E8',
    95: '#EEF1F6',
    99: '#FEFCFF',
    100: '#FFFFFF',
  },
};

// Color roles selon Material Design 3
const lightScheme = {
  primary: m3Colors.primary[40],
  onPrimary: m3Colors.primary[100],
  primaryContainer: m3Colors.primary[90],
  onPrimaryContainer: m3Colors.primary[10],

  secondary: m3Colors.secondary[40],
  onSecondary: m3Colors.secondary[100],
  secondaryContainer: m3Colors.secondary[90],
  onSecondaryContainer: m3Colors.secondary[10],

  tertiary: m3Colors.tertiary[40],
  onTertiary: m3Colors.tertiary[100],
  tertiaryContainer: m3Colors.tertiary[90],
  onTertiaryContainer: m3Colors.tertiary[10],

  error: m3Colors.error[40],
  onError: m3Colors.error[100],
  errorContainer: m3Colors.error[90],
  onErrorContainer: m3Colors.error[10],

  surface: m3Colors.neutral[98],
  onSurface: m3Colors.neutral[10],
  surfaceVariant: m3Colors.neutralVariant[90],
  onSurfaceVariant: m3Colors.neutralVariant[30],

  inverseSurface: m3Colors.neutral[20],
  inverseOnSurface: m3Colors.neutral[95],
  inversePrimary: m3Colors.primary[80],

  outline: m3Colors.neutralVariant[50],
  outlineVariant: m3Colors.neutralVariant[80],

  background: m3Colors.neutral[99],
  onBackground: m3Colors.neutral[10],

  surfaceContainer: m3Colors.neutral[94],
  surfaceContainerHigh: m3Colors.neutral[92],
  surfaceContainerHighest: m3Colors.neutral[90],
  surfaceContainerLow: m3Colors.neutral[96],
  surfaceContainerLowest: m3Colors.neutral[100],

  surfaceDim: m3Colors.neutral[87],
  surfaceBright: m3Colors.neutral[98],

  scrim: m3Colors.neutral[0],
  shadow: m3Colors.neutral[0],
};

// Extensions TypeScript pour les nouvelles couleurs M3
declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
    surfaceContainer: string;
    surfaceContainerHigh: string;
    surfaceContainerHighest: string;
    surfaceContainerLow: string;
    surfaceContainerLowest: string;
    surfaceDim: string;
    surfaceBright: string;
    outline: string;
    outlineVariant: string;
    inverseSurface: string;
    inverseOnSurface: string;
    inversePrimary: string;
    scrim: string;
    shadow: string;
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
    surfaceContainer?: string;
    surfaceContainerHigh?: string;
    surfaceContainerHighest?: string;
    surfaceContainerLow?: string;
    surfaceContainerLowest?: string;
    surfaceDim?: string;
    surfaceBright?: string;
    outline?: string;
    outlineVariant?: string;
    inverseSurface?: string;
    inverseOnSurface?: string;
    inversePrimary?: string;
    scrim?: string;
    shadow?: string;
  }
}

// ===== MATERIAL DESIGN 3 TYPOGRAPHY =====
// Nouvelle échelle typographique M3
const m3Typography = {
  fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',

  // Display styles - Pour les titres importants
  displayLarge: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    fontSize: '3.5rem', // 56px
    fontWeight: 400,
    lineHeight: 1.14, // 64px
    letterSpacing: '-0.025em',
  },
  displayMedium: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    fontSize: '2.8125rem', // 45px
    fontWeight: 400,
    lineHeight: 1.16, // 52px
    letterSpacing: '0',
  },
  displaySmall: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    fontSize: '2.25rem', // 36px
    fontWeight: 400,
    lineHeight: 1.22, // 44px
    letterSpacing: '0',
  },

  // Headline styles - Pour les titres de section
  headlineLarge: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    fontSize: '2rem', // 32px
    fontWeight: 400,
    lineHeight: 1.25, // 40px
    letterSpacing: '0',
  },
  headlineMedium: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    fontSize: '1.75rem', // 28px
    fontWeight: 400,
    lineHeight: 1.29, // 36px
    letterSpacing: '0',
  },
  headlineSmall: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    fontSize: '1.5rem', // 24px
    fontWeight: 400,
    lineHeight: 1.33, // 32px
    letterSpacing: '0',
  },

  // Title styles - Pour les titres de composants
  titleLarge: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    fontSize: '1.375rem', // 22px
    fontWeight: 400,
    lineHeight: 1.27, // 28px
    letterSpacing: '0',
  },
  titleMedium: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    fontSize: '1rem', // 16px
    fontWeight: 500,
    lineHeight: 1.5, // 24px
    letterSpacing: '0.009375em', // 0.15px
  },
  titleSmall: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    fontSize: '0.875rem', // 14px
    fontWeight: 500,
    lineHeight: 1.43, // 20px
    letterSpacing: '0.00714em', // 0.1px
  },

  // Label styles - Pour les boutons et labels
  labelLarge: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    fontSize: '0.875rem', // 14px
    fontWeight: 500,
    lineHeight: 1.43, // 20px
    letterSpacing: '0.00714em', // 0.1px
    textTransform: 'none' as const,
  },
  labelMedium: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    fontSize: '0.75rem', // 12px
    fontWeight: 500,
    lineHeight: 1.33, // 16px
    letterSpacing: '0.041666em', // 0.5px
    textTransform: 'none' as const,
  },
  labelSmall: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    fontSize: '0.6875rem', // 11px
    fontWeight: 500,
    lineHeight: 1.45, // 16px
    letterSpacing: '0.045454em', // 0.5px
    textTransform: 'none' as const,
  },

  // Body styles - Pour le contenu principal
  bodyLarge: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    fontSize: '1rem', // 16px
    fontWeight: 400,
    lineHeight: 1.5, // 24px
    letterSpacing: '0.03125em', // 0.5px
  },
  bodyMedium: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    fontSize: '0.875rem', // 14px
    fontWeight: 400,
    lineHeight: 1.43, // 20px
    letterSpacing: '0.0178571em', // 0.25px
  },
  bodySmall: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    fontSize: '0.75rem', // 12px
    fontWeight: 400,
    lineHeight: 1.33, // 16px
    letterSpacing: '0.033333em', // 0.4px
  },
};

// Mapping vers la typologie MUI existante pour compatibilité
const compatibilityMapping = {
  h1: m3Typography.displayLarge,
  h2: m3Typography.displayMedium,
  h3: m3Typography.headlineLarge,
  h4: m3Typography.headlineMedium,
  h5: m3Typography.titleLarge,
  h6: m3Typography.titleMedium,
  subtitle1: m3Typography.titleMedium,
  subtitle2: m3Typography.titleSmall,
  body1: m3Typography.bodyLarge,
  body2: m3Typography.bodyMedium,
  button: m3Typography.labelLarge,
  caption: m3Typography.bodySmall,
  overline: m3Typography.labelSmall,
};

// ===== MATERIAL DESIGN 3 ELEVATION =====
// Nouveau système d'élévation M3 avec surfaces tonales
const m3Elevations = [
  'none', // 0
  `0px 1px 2px 0px ${lightScheme.shadow}0A, 0px 1px 3px 1px ${lightScheme.shadow}0F`, // 1
  `0px 1px 2px 0px ${lightScheme.shadow}0A, 0px 2px 6px 2px ${lightScheme.shadow}0F`, // 2
  `0px 1px 3px 0px ${lightScheme.shadow}0A, 0px 4px 8px 3px ${lightScheme.shadow}0F`, // 3
  `0px 2px 3px 0px ${lightScheme.shadow}0A, 0px 6px 10px 4px ${lightScheme.shadow}0F`, // 4
  `0px 4px 4px 0px ${lightScheme.shadow}0A, 0px 8px 12px 6px ${lightScheme.shadow}0F`, // 5
];

// ===== THÈME PRINCIPAL M3 =====
const m3Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: lightScheme.primary,
      light: m3Colors.primary[70],
      dark: m3Colors.primary[30],
      contrastText: lightScheme.onPrimary,
    },
    secondary: {
      main: lightScheme.secondary,
      light: m3Colors.secondary[70],
      dark: m3Colors.secondary[30],
      contrastText: lightScheme.onSecondary,
    },
    tertiary: {
      main: lightScheme.tertiary,
      light: m3Colors.tertiary[70],
      dark: m3Colors.tertiary[30],
      contrastText: lightScheme.onTertiary,
    },
    error: {
      main: lightScheme.error,
      light: m3Colors.error[70],
      dark: m3Colors.error[30],
      contrastText: lightScheme.onError,
    },
    background: {
      default: lightScheme.background,
      paper: lightScheme.surface,
    },
    text: {
      primary: lightScheme.onSurface,
      secondary: lightScheme.onSurfaceVariant,
      disabled: `${lightScheme.onSurface}61`, // 38% opacity
    },
    divider: lightScheme.outline,
    // Nouvelles couleurs M3
    surfaceContainer: lightScheme.surfaceContainer,
    surfaceContainerHigh: lightScheme.surfaceContainerHigh,
    surfaceContainerHighest: lightScheme.surfaceContainerHighest,
    surfaceContainerLow: lightScheme.surfaceContainerLow,
    surfaceContainerLowest: lightScheme.surfaceContainerLowest,
    surfaceDim: lightScheme.surfaceDim,
    surfaceBright: lightScheme.surfaceBright,
    outline: lightScheme.outline,
    outlineVariant: lightScheme.outlineVariant,
    inverseSurface: lightScheme.inverseSurface,
    inverseOnSurface: lightScheme.inverseOnSurface,
    inversePrimary: lightScheme.inversePrimary,
    scrim: lightScheme.scrim,
    shadow: lightScheme.shadow,
  },

  typography: {
    ...compatibilityMapping,
    ...m3Typography,
  },

  shape: {
    borderRadius: 16, // M3 utilise des coins plus arrondis par défaut
  },

  shadows: m3Elevations as Shadows,

  components: {
    // Boutons selon M3
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20, // M3 boutons très arrondis
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          lineHeight: 1.43,
          letterSpacing: '0.00714em',
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: m3Elevations[1],
          },
        },
        contained: {
          '&:hover': {
            boxShadow: m3Elevations[2],
          },
        },
        outlined: {
          borderColor: lightScheme.outline,
          '&:hover': {
            backgroundColor: `${lightScheme.primary}08`, // 3% opacity
            borderColor: lightScheme.outline,
          },
        },
        text: {
          '&:hover': {
            backgroundColor: `${lightScheme.primary}08`, // 3% opacity
          },
        },
      },
    },

    // Cards selon M3
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: lightScheme.surfaceContainerLow,
          boxShadow: m3Elevations[1],
          border: 'none',
          '&:hover': {
            boxShadow: m3Elevations[2],
          },
        },
      },
    },

    // Paper selon M3
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: lightScheme.surface,
        },
        elevation1: {
          backgroundColor: lightScheme.surfaceContainer,
        },
        elevation2: {
          backgroundColor: lightScheme.surfaceContainerHigh,
        },
        elevation3: {
          backgroundColor: lightScheme.surfaceContainerHighest,
        },
      },
    },

    // Text Fields selon M3
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4, // M3 utilise des coins moins arrondis pour les inputs
            backgroundColor: lightScheme.surfaceContainerHighest,
            '& fieldset': {
              borderColor: lightScheme.outline,
            },
            '&:hover fieldset': {
              borderColor: lightScheme.onSurface,
            },
            '&.Mui-focused fieldset': {
              borderColor: lightScheme.primary,
              borderWidth: 2,
            },
          },
        },
      },
    },

    // Chips selon M3
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: lightScheme.surfaceContainerLow,
          color: lightScheme.onSurfaceVariant,
          '&:hover': {
            backgroundColor: lightScheme.surfaceContainer,
          },
        },
        filled: {
          backgroundColor: lightScheme.secondaryContainer,
          color: lightScheme.onSecondaryContainer,
        },
      },
    },

    // App Bar selon M3
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: lightScheme.surface,
          color: lightScheme.onSurface,
          boxShadow: 'none',
          borderBottom: `1px solid ${lightScheme.outlineVariant}`,
        },
      },
    },

    // Lists selon M3
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            backgroundColor: `${lightScheme.primary}08`, // 3% opacity
          },
          '&.Mui-selected': {
            backgroundColor: `${lightScheme.primary}12`, // 7% opacity
            '&:hover': {
              backgroundColor: `${lightScheme.primary}1A`, // 10% opacity
            },
          },
        },
      },
    },
  },
});

export default m3Theme;
