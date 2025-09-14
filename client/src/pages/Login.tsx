import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';

import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import CarouselSlides from '../components/auth/CarouselSlides';
import { useThemeMode } from '../context/ThemeContext';

interface FormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const { login, isLoading, error, clearError, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useThemeMode();
  // Récupérer la page d'origine depuis le state de navigation
  const from = location.state?.from?.pathname || '/';

  // Rediriger si déjà connecté
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Nettoyer l'erreur quand l'utilisateur tape
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [email, password, clearError, error]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Validation email
    if (!email) {
      errors.email = "L'email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Format email invalide';
    }

    // Validation mot de passe
    if (!password) {
      errors.password = 'Le mot de passe est obligatoire';
    } else if (password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Side - Login Form */}
      <Box
        sx={{
          flex: { xs: 1, lg: '0 0 41.666667%' }, // 5/12 = 41.666667%
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: 'background.paper',
          padding: { xs: 3, sm: 6, lg: 8 },
        }}
      >
        <Box sx={{ maxWidth: 400, mx: 'auto', width: '100%' }}>
          {/* Logo et titre */}
          <Box sx={{ mb: 6 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 1 },
              }}
            >
              <img
                src={isDarkMode ? '/assets/icon-white.png' : '/assets/icon.png'}
                alt="Logo"
                style={{ width: 40, height: 40 }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Chau Philomene One", cursive',
                }}
              >
                <Box component="span" sx={{ color: 'error.main' }}>
                  MEMO
                </Box>
                <Box component="span" sx={{ color: 'primary.main' }}>
                  TRIP
                </Box>
              </Typography>
            </Box>
            <Typography variant="h3" color="text.primary" gutterBottom sx={{}}>
              Organisez vos voyages nouvelle génération
            </Typography>
            <Typography
              variant="h6"
              color="text.primary"
              sx={{ mb: 1, fontWeight: 500 }}
            >
              Bienvenue à nouveau
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 3, borderRadius: 2 }}
                onClose={clearError}
              >
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              error={!!formErrors.email}
              helperText={formErrors.email}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              placeholder="memotrip@exemple.com"
              variant="outlined"
            />

            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              error={!!formErrors.password}
              helperText={formErrors.password}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      disabled={isLoading}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              placeholder="mot de passe"
              variant="outlined"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading || !email || !password}
              sx={{
                py: 1.5,
                mb: 4,
                fontSize: '1rem',
                fontWeight: 600,

                '&:hover': {
                  backgroundColor: '#5A6875',
                },
              }}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Connexion...
                </Box>
              ) : (
                'Se connecter'
              )}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Vous n'avez pas encore de compte ?{' '}
                <Link
                  to="/register"
                  style={{
                    color: '#6C7B8A',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Créer un compte
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right Side - Carousel (Desktop only) */}
      <Box
        sx={{
          flex: { lg: '0 0 58.333333%' }, // 7/12 = 58.333333%
          display: { xs: 'none', lg: 'flex' },
          position: 'relative',
          minHeight: '100vh',
        }}
      >
        <CarouselSlides />
      </Box>
    </Box>
  );
};

export default Login;
