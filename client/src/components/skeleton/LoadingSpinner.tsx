import React from 'react';
import { Box, Typography, CircularProgress, Fade } from '@mui/material';
import { useThemeMode } from '../../context/ThemeContext';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  showLogo?: boolean;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Chargement...',
  size = 'medium',
  showLogo = true,
  fullScreen = false,
}) => {
  const { isDarkMode } = useThemeMode();

  const getSizes = () => {
    switch (size) {
      case 'small':
        return { logo: 32, spinner: 24, typography: 'body2' as const };
      case 'large':
        return { logo: 80, spinner: 48, typography: 'h6' as const };
      default:
        return { logo: 56, spinner: 32, typography: 'body1' as const };
    }
  };

  const sizes = getSizes();

  const containerSx = fullScreen
    ? {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        zIndex: 9999,
      }
    : {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: 2,
        p: 3,
      };

  return (
    <Fade in timeout={300}>
      <Box sx={containerSx}>
        {showLogo && (
          <Box
            sx={{
              mb: 2,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Logo avec animation de pulsation */}
            <Box
              sx={{
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': {
                    transform: 'scale(1)',
                    opacity: 1,
                  },
                  '50%': {
                    transform: 'scale(1.05)',
                    opacity: 0.8,
                  },
                },
              }}
            >
              <img
                src={isDarkMode ? '/assets/icon-white.png' : '/assets/icon.png'}
                alt="MemoTrip"
                style={{
                  width: sizes.logo,
                  height: sizes.logo,
                  filter: isDarkMode
                    ? 'drop-shadow(0 0 20px rgba(187, 134, 252, 0.3))'
                    : 'drop-shadow(0 4px 12px rgba(25, 118, 210, 0.2))',
                }}
              />
            </Box>

            {/* Spinner circulaire autour du logo */}
            <CircularProgress
              size={sizes.logo + 16}
              thickness={2}
              sx={{
                position: 'absolute',
                color: 'primary.main',
                opacity: 0.7,
                animation: 'rotate 2s linear infinite',
                '@keyframes rotate': {
                  '0%': {
                    transform: 'rotate(0deg)',
                  },
                  '100%': {
                    transform: 'rotate(360deg)',
                  },
                },
              }}
            />
          </Box>
        )}

        {!showLogo && (
          <CircularProgress
            size={sizes.spinner}
            sx={{
              color: 'primary.main',
              mb: 2,
            }}
          />
        )}

        {/* Nom de l'application avec gradient */}
        {showLogo && size !== 'small' && (
          <Box sx={{ display: 'flex', mb: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'error.main',
                letterSpacing: 1,
              }}
            >
              Memo
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'primary.main', // Blue color
                letterSpacing: 1,
              }}
            >
              Trip
            </Typography>
          </Box>
        )}

        {/* Message de chargement */}
        <Typography
          variant={sizes.typography}
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            animation: 'fadeInOut 1.5s ease-in-out infinite',
            '@keyframes fadeInOut': {
              '0%, 100%': {
                opacity: 0.6,
              },
              '50%': {
                opacity: 1,
              },
            },
          }}
        >
          {message}
        </Typography>

        {/* Points de chargement animés */}
        <Box
          sx={{
            display: 'flex',
            gap: 0.5,
            mt: 1,
          }}
        >
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                animation: `bounce 1.4s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`,
                '@keyframes bounce': {
                  '0%, 80%, 100%': {
                    transform: 'scale(0.8)',
                    opacity: 0.5,
                  },
                  '40%': {
                    transform: 'scale(1)',
                    opacity: 1,
                  },
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Fade>
  );
};

export default LoadingSpinner;
