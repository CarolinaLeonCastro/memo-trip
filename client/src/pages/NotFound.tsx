import React from 'react';
import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import { Home, ArrowBack, Explore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../context/ThemeContext';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isDarkMode } = useThemeMode();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleExplore = () => {
    navigate('/discover');
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          py: 4,
        }}
      >
        {/* Logo et icône */}
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <img
            src={isDarkMode ? '/assets/icon-white.png' : '/assets/icon.png'}
            alt="MemoTrip"
            style={{
              width: 80,
              height: 80,
              filter: isDarkMode
                ? 'none'
                : 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
            }}
          />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              fontFamily: 'Chau Philomene One, sans-serif',
              letterSpacing: 1,
            }}
          >
            <Box component="span" sx={{ color: 'error.main' }}>
              Memo
            </Box>
            <Box component="span" sx={{ color: 'primary.main' }}>
              Trip
            </Box>
          </Typography>
        </Box>

        {/* Message d'erreur 404 */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '4rem', md: '6rem' },
            fontWeight: 800,
            color: theme.palette.primary.main,
            mb: 2,
            textShadow: isDarkMode
              ? '0 0 20px rgba(187, 134, 252, 0.3)'
              : '0 4px 8px rgba(25, 118, 210, 0.2)',
          }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 2,
            fontSize: { xs: '1.5rem', md: '2rem' },
          }}
        >
          Page non trouvée
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            mb: 4,
            maxWidth: 500,
            fontSize: '1.1rem',
            lineHeight: 1.6,
          }}
        >
          Oups ! La page que vous recherchez semble avoir pris des vacances.
          Elle explore peut-être de nouveaux horizons... 🌍
        </Typography>

        {/* Boutons d'action */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<Home />}
            onClick={handleGoHome}
            sx={{
              minWidth: 160,
              py: 1.5,
              borderRadius: 1,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: isDarkMode
                ? '0 4px 12px rgba(187, 134, 252, 0.3)'
                : '0 4px 12px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: isDarkMode
                  ? '0 6px 16px rgba(187, 134, 252, 0.4)'
                  : '0 6px 16px rgba(25, 118, 210, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Accueil
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBack />}
            onClick={handleGoBack}
            sx={{
              minWidth: 160,
              py: 1.5,
              borderRadius: 1,
              fontWeight: 600,
              textTransform: 'none',
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Retour
          </Button>

          <Button
            variant="text"
            size="large"
            startIcon={<Explore />}
            onClick={handleExplore}
            sx={{
              minWidth: 160,
              py: 1.5,
              borderRadius: 1,
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Explorer
          </Button>
        </Box>

        {/* Illustration décorative */}
        <Box
          sx={{
            mt: 6,
            opacity: 0.3,
            fontSize: '4rem',
            animation: 'float 3s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': {
                transform: 'translateY(0px)',
              },
              '50%': {
                transform: 'translateY(-10px)',
              },
            },
          }}
        >
          🗺️
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;
