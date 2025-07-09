import { createTheme } from '@mui/material/styles';

// Palette de couleurs basée sur vos wireframes
const palette = {
  primary: {
    main: '#3D5A80',
    light: '#7A9CC6',
    dark: '#2D3748',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#7A9CC6',
    light: '#B8D4F1',
    dark: '#3D5A80',
    contrastText: '#ffffff',
  },
  accent: {
    main: '#E07A5F',
    light: '#F2A389',
    dark: '#D16B4F',
    contrastText: '#ffffff',
  },
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF',
    secondary: '#F1F5F9',
  },
  text: {
    primary: '#2D3748',
    secondary: '#64748B',
    disabled: '#94A3B8',
  },
  divider: '#E2E8F0',
  common: {
    black: '#2D3748',
    white: '#FFFFFF',
  },
};

// Déclaration des couleurs personnalisées pour TypeScript
declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
  }
  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
  }
}

const theme = createTheme({
  palette: {
    ...palette,
    mode: 'light',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      color: palette.text.primary,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: palette.text.primary,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: palette.text.primary,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: palette.text.primary,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: palette.text.primary,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: palette.text.primary,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      color: palette.text.primary,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: palette.text.secondary,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.1)',
    '0px 4px 6px rgba(0, 0, 0, 0.1)',
    '0px 5px 15px rgba(0, 0, 0, 0.1)',
    '0px 10px 20px rgba(0, 0, 0, 0.1)',
    '0px 15px 25px rgba(0, 0, 0, 0.1)',
    '0px 20px 30px rgba(0, 0, 0, 0.1)',
    '0px 25px 35px rgba(0, 0, 0, 0.1)',
    '0px 30px 40px rgba(0, 0, 0, 0.1)',
    '0px 35px 45px rgba(0, 0, 0, 0.1)',
    '0px 40px 50px rgba(0, 0, 0, 0.1)',
    '0px 45px 55px rgba(0, 0, 0, 0.1)',
    '0px 50px 60px rgba(0, 0, 0, 0.1)',
    '0px 55px 65px rgba(0, 0, 0, 0.1)',
    '0px 60px 70px rgba(0, 0, 0, 0.1)',
    '0px 65px 75px rgba(0, 0, 0, 0.1)',
    '0px 70px 80px rgba(0, 0, 0, 0.1)',
    '0px 75px 85px rgba(0, 0, 0, 0.1)',
    '0px 80px 90px rgba(0, 0, 0, 0.1)',
    '0px 85px 95px rgba(0, 0, 0, 0.1)',
    '0px 90px 100px rgba(0, 0, 0, 0.1)',
    '0px 95px 105px rgba(0, 0, 0, 0.1)',
    '0px 100px 110px rgba(0, 0, 0, 0.1)',
    '0px 105px 115px rgba(0, 0, 0, 0.1)',
    '0px 110px 120px rgba(0, 0, 0, 0.1)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E2E8F0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#E2E8F0',
            },
            '&:hover fieldset': {
              borderColor: palette.primary.light,
            },
            '&.Mui-focused fieldset': {
              borderColor: palette.primary.main,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
