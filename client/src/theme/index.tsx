import { createTheme, type ThemeOptions } from '@mui/material/styles';

// Function to create theme based on mode
const createCustomTheme = (mode: 'light' | 'dark') => {
  const isLight = mode === 'light';

  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: '#2563EB', // Bleu moderne et vibrant
        light: '#60A5FA',
        dark: '#1D4ED8',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#06B6D4', // Cyan pour les accents
        light: '#67E8F9',
        dark: '#0891B2',
        contrastText: '#ffffff',
      },
      tertiary: {
        main: isLight ? '#F0F9FF' : '#0F172A', // Bleu très clair / slate foncé
        light: isLight ? '#F8FAFC' : '#1E293B',
        dark: isLight ? '#E2E8F0' : '#020617',
      },
      accent: {
        main: '#F59E0B', // Orange pour les CTA importants
        light: '#FBBF24',
        dark: '#D97706',
        contrastText: '#ffffff',
      },
      error: {
        main: '#EF4444',
        light: '#F87171',
        dark: '#DC2626',
      },
      warning: {
        main: '#F59E0B',
        light: '#FBBF24',
        dark: '#D97706',
      },
      info: {
        main: '#3B82F6',
        light: '#93C5FD',
        dark: '#1D4ED8',
      },
      success: {
        main: '#10B981',
        light: '#6EE7B7',
        dark: '#059669',
      },
      background: {
        default: isLight ? '#FEFEFE' : '#0F172A',
        paper: isLight ? '#FFFFFF' : '#1E293B',
      },
      surface: {
        main: isLight ? '#F8FAFC' : '#334155',
        variant: isLight ? '#F1F5F9' : '#475569',
        elevated: isLight ? '#FFFFFF' : '#1E293B',
      },
      text: {
        primary: isLight ? '#0F172A' : '#F8FAFC',
        secondary: isLight ? '#64748B' : '#CBD5E1',
        disabled: isLight ? '#94A3B8' : '#64748B',
      },
      outline: {
        main: isLight ? '#E2E8F0' : '#475569',
        variant: isLight ? '#CBD5E1' : '#334155',
      },
      action: {
        hover: isLight ? 'rgba(37, 99, 235, 0.04)' : 'rgba(96, 165, 250, 0.08)',
        selected: isLight
          ? 'rgba(37, 99, 235, 0.08)'
          : 'rgba(96, 165, 250, 0.12)',
        focus: isLight ? 'rgba(37, 99, 235, 0.12)' : 'rgba(96, 165, 250, 0.16)',
      },
    },
    typography: {
      fontFamily:
        '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h1: {
        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
        fontWeight: 800,
        lineHeight: 1.1,
        letterSpacing: '-0.025em',
        background: isLight
          ? 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)'
          : 'linear-gradient(135deg, #60A5FA 0%, #67E8F9 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      },
      h2: {
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontSize: 'clamp(1.5rem, 2.5vw, 1.875rem)',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.7,
        letterSpacing: '0.005em',
        fontWeight: 400,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
        letterSpacing: '0.01em',
        fontWeight: 400,
      },
      button: {
        fontSize: '0.875rem',
        fontWeight: 600,
        letterSpacing: '0.025em',
        textTransform: 'none',
      },
      caption: {
        fontSize: '0.75rem',
        fontWeight: 500,
        letterSpacing: '0.02em',
        color: isLight ? '#64748B' : '#94A3B8',
      },
      decorative: {
        fontFamily: '"Playfair Display", serif',
        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: '0.01em',
      },
    },
    shape: {
      borderRadius: 12,
    },
    spacing: 8,
    breakpoints: {
      values: {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        xxl: 1536,
      },
    },
    shadows: [
      'none',
      '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '0 4px 8px 0 rgba(0, 0, 0, 0.08)',
      '0 6px 12px 0 rgba(0, 0, 0, 0.1)',
      '0 8px 16px 0 rgba(0, 0, 0, 0.12)',
      '0 10px 20px 0 rgba(0, 0, 0, 0.14)',
      '0 12px 24px 0 rgba(0, 0, 0, 0.16)',
      '0 14px 28px 0 rgba(0, 0, 0, 0.18)',
      '0 16px 32px 0 rgba(0, 0, 0, 0.2)',
      '0 18px 36px 0 rgba(0, 0, 0, 0.22)',
      '0 20px 40px 0 rgba(0, 0, 0, 0.24)',
      '0 22px 44px 0 rgba(0, 0, 0, 0.26)',
      '0 24px 48px 0 rgba(0, 0, 0, 0.28)',
      '0 26px 52px 0 rgba(0, 0, 0, 0.3)',
      '0 28px 56px 0 rgba(0, 0, 0, 0.32)',
      '0 30px 60px 0 rgba(0, 0, 0, 0.34)',
      '0 32px 64px 0 rgba(0, 0, 0, 0.36)',
      '0 34px 68px 0 rgba(0, 0, 0, 0.38)',
      '0 36px 72px 0 rgba(0, 0, 0, 0.4)',
      '0 38px 76px 0 rgba(0, 0, 0, 0.42)',
    ] as const,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            scrollBehavior: 'smooth',
          },
          body: {
            fontFamily:
              '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            background: isLight
              ? 'radial-gradient(ellipse at top, rgba(37, 99, 235, 0.02) 0%, transparent 50%)'
              : 'radial-gradient(ellipse at top, rgba(96, 165, 250, 0.05) 0%, transparent 50%)',
          },
          '*': {
            boxSizing: 'border-box',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 16,
            border: `1px solid ${isLight ? 'rgba(226, 232, 240, 0.8)' : 'rgba(71, 85, 105, 0.3)'}`,
            backdropFilter: 'blur(8px)',
            background: isLight
              ? 'rgba(255, 255, 255, 0.8)'
              : 'rgba(30, 41, 59, 0.8)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: isLight
                ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
              borderColor: theme.palette.primary.main,
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
            fontSize: '0.875rem',
            padding: '12px 24px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
              transition: 'left 0.5s',
            },
            '&:hover::before': {
              left: '100%',
            },
            [theme.breakpoints.down('sm')]: {
              padding: '10px 20px',
              fontSize: '0.8125rem',
            },
          }),
          contained: ({ theme }) => ({
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            boxShadow: `0 4px 14px 0 rgba(37, 99, 235, 0.3)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              boxShadow: `0 6px 20px 0 rgba(37, 99, 235, 0.4)`,
              transform: 'translateY(-2px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }),
          outlined: ({ theme }) => ({
            borderWidth: '1.5px',
            borderColor: theme.palette.primary.main,
            '&:hover': {
              borderWidth: '1.5px',
              backgroundColor: theme.palette.action.hover,
              borderColor: theme.palette.primary.dark,
            },
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 20,
            fontWeight: 500,
            backdropFilter: 'blur(8px)',
            border: `1px solid ${isLight ? 'rgba(226, 232, 240, 0.5)' : 'rgba(71, 85, 105, 0.5)'}`,
            '&.MuiChip-filled': {
              background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
            },
          }),
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: () => ({
            backgroundColor: isLight
              ? 'rgba(255, 255, 255, 0.85)'
              : 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${isLight ? 'rgba(226, 232, 240, 0.5)' : 'rgba(71, 85, 105, 0.3)'}`,
            boxShadow: 'none',
          }),
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: ({ theme }) => ({
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              backgroundColor: isLight
                ? 'rgba(248, 250, 252, 0.5)'
                : 'rgba(51, 65, 85, 0.3)',
              backdropFilter: 'blur(8px)',
              '&:hover': {
                backgroundColor: isLight
                  ? 'rgba(241, 245, 249, 0.7)'
                  : 'rgba(71, 85, 105, 0.4)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused': {
                backgroundColor: isLight
                  ? 'rgba(255, 255, 255, 0.9)'
                  : 'rgba(30, 41, 59, 0.9)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderWidth: '2px',
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 3px rgba(37, 99, 235, 0.1)`,
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
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${isLight ? 'rgba(226, 232, 240, 0.5)' : 'rgba(71, 85, 105, 0.3)'}`,
            backdropFilter: 'blur(8px)',
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: ({ theme }) => ({
            background: `linear-gradient(135deg, ${theme.palette.accent?.main || theme.palette.secondary.main}, ${theme.palette.accent?.dark || theme.palette.secondary.dark})`,
            boxShadow: `0 8px 32px rgba(245, 158, 11, 0.3)`,
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: `0 12px 48px rgba(245, 158, 11, 0.4)`,
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
    accent: Palette['primary'];
    surface: {
      main: string;
      variant: string;
      elevated: string;
    };
    outline: {
      main: string;
      variant: string;
    };
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
    accent?: PaletteOptions['primary'];
    surface?: {
      main: string;
      variant: string;
      elevated: string;
    };
    outline?: {
      main: string;
      variant: string;
    };
  }

  interface BreakpointOverrides {
    xxl: true;
  }

  interface TypographyVariants {
    decorative: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    decorative?: React.CSSProperties;
  }
}

// Augmenter le module Typography pour les nouvelles variantes
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    decorative: true;
  }
}

export { createCustomTheme };
export const lightTheme = createCustomTheme('light');
export const darkTheme = createCustomTheme('dark');
export default lightTheme;
