import { createTheme, type ThemeOptions } from '@mui/material/styles';

// Function to create theme based on mode
const createCustomTheme = (mode: 'light' | 'dark') => {
  const isLight = mode === 'light';

  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: '#3D5A80', // Bleu foncé principal
        light: '#6B8CAE',
        dark: '#2C4A6B',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#98C1D9', // Bleu clair
        light: '#B8D4E8',
        dark: '#7BA8C4',
        contrastText: isLight ? '#2C4A6B' : '#ffffff',
      },
      tertiary: {
        main: isLight ? '#E0FBFC' : '#1A2332', // Bleu très clair / foncé
        light: isLight ? '#F0FDFE' : '#2C3E50',
        dark: isLight ? '#C7E9EA' : '#0F1419',
      },
      error: {
        main: '#EE6C4D', // Orange/rouge pour les erreurs
        light: '#F28B73',
        dark: '#D4553A',
      },
      warning: {
        main: '#FF9F1C',
        light: '#FFB84D',
        dark: '#E68A00',
      },
      info: {
        main: '#2196F3',
        light: '#64B5F6',
        dark: '#1976D2',
      },
      success: {
        main: '#4CAF50',
        light: '#81C784',
        dark: '#388E3C',
      },
      background: {
        default: isLight ? '#FEFEFE' : '#0F1419',
        paper: isLight ? '#FFFFFF' : '#1A2332',
      },
      surface: {
        main: isLight ? '#F8F9FA' : '#2C3E50',
        variant: isLight ? '#E9ECEF' : '#34495E',
      },
      text: {
        primary: isLight ? '#293241' : '#E8F4FD',
        secondary: isLight ? '#6C757D' : '#B0BEC5',
      },
      outline: {
        main: isLight ? '#DEE2E6' : '#34495E',
        variant: isLight ? '#CED4DA' : '#2C3E50',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h4: {
        fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
        letterSpacing: '0.01em',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
        letterSpacing: '0.01em',
      },
      button: {
        fontSize: '0.875rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 16,
    },
    spacing: 8,
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            boxShadow: isLight
              ? '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)'
              : '0 4px 12px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
            border: `1px solid ${theme.palette.outline.main}`,
            borderRadius: 16,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: isLight
                ? '0 4px 12px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)'
                : '0 8px 20px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.3)',
              transform: 'translateY(-2px)',
            },
          }),
        },
      },
      MuiButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 600,
            padding: '12px 24px',
            fontSize: '0.875rem',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            [theme.breakpoints.down('sm')]: {
              padding: '10px 20px',
              fontSize: '0.8125rem',
            },
          }),
          contained: () => ({
            boxShadow: isLight
              ? '0 2px 8px rgba(61, 90, 128, 0.24)'
              : '0 4px 12px rgba(0,0,0,0.3)',
            '&:hover': {
              boxShadow: isLight
                ? '0 4px 12px rgba(61, 90, 128, 0.32)'
                : '0 6px 16px rgba(0,0,0,0.4)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }),
          outlined: ({ theme }) => ({
            borderWidth: '1.5px',
            '&:hover': {
              borderWidth: '1.5px',
              backgroundColor: theme.palette.action.hover,
            },
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: isLight
              ? '0 1px 3px rgba(0,0,0,0.08)'
              : '0 2px 8px rgba(0,0,0,0.3)',
            borderBottom: `1px solid ${theme.palette.outline.main}`,
          }),
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: ({ theme }) => ({
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderWidth: '2px',
              },
            },
          }),
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: ({ theme }) => ({
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            [theme.breakpoints.up('sm')]: {
              paddingLeft: theme.spacing(3),
              paddingRight: theme.spacing(3),
            },
            [theme.breakpoints.up('lg')]: {
              paddingLeft: theme.spacing(4),
              paddingRight: theme.spacing(4),
            },
          }),
        },
      },
    },
  };

  return createTheme(themeOptions);
};

// Augmenter les types pour les nouvelles couleurs
declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
    surface: {
      main: string;
      variant: string;
    };
    outline: {
      main: string;
      variant: string;
    };
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
    surface?: {
      main: string;
      variant: string;
    };
    outline?: {
      main: string;
      variant: string;
    };
  }
}

export { createCustomTheme };
export const defaultTheme = createCustomTheme('light');
export default defaultTheme;
