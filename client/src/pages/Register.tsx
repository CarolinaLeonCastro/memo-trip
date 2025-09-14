import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  LockOutlined as LockOutlinedIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import CarouselSlides from '../components/auth/CarouselSlides';
import { useThemeMode } from '../context/ThemeContext';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const { register, isLoading, error, clearError, user } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useThemeMode();
  // Rediriger si déjà connecté
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Nettoyer l'erreur quand l'utilisateur tape
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [name, email, password, confirmPassword, clearError, error]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Validation nom
    if (!name.trim()) {
      errors.name = 'Le nom est obligatoire';
    } else if (name.trim().length < 2) {
      errors.name = 'Le nom doit contenir au moins 2 caractères';
    } else if (name.trim().length > 50) {
      errors.name = 'Le nom ne peut pas dépasser 50 caractères';
    }

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
    } else if (password.length > 100) {
      errors.password = 'Le mot de passe ne peut pas dépasser 100 caractères';
    }

    // Validation confirmation mot de passe
    if (!confirmPassword) {
      errors.confirmPassword =
        'La confirmation du mot de passe est obligatoire';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await register(
      name.trim(),
      email,
      password,
      confirmPassword
    );
    if (success) {
      navigate('/', { replace: true });
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Side - Register Form */}
      <Box
        sx={{
          flex: { xs: 1, lg: '0 0 41.666667%' }, // 5/12 = 41.666667%
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: 'background.paper',
          padding: { xs: 3, sm: 6, lg: 8 },
          overflowY: 'auto',
        }}
      >
        <Box sx={{ maxWidth: 400, mx: 'auto', width: '100%' }}>
          {/* Logo et titre */}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              error={!!formErrors.name}
              helperText={formErrors.name}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              placeholder="Votre nom complet"
              variant="outlined"
            />

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
              sx={{ mb: 3 }}
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

            <TextField
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleConfirmPasswordVisibility}
                      disabled={isLoading}
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              placeholder="confirmer le mot de passe"
              variant="outlined"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={
                isLoading ||
                !name.trim() ||
                !email ||
                !password ||
                !confirmPassword
              }
              sx={{
                py: 1.5,
                mb: 4,
                fontSize: '1rem',
                fontWeight: 600,

                backgroundColor: '#6C7B8A',
                '&:hover': {
                  backgroundColor: '#5A6875',
                },
              }}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Création du compte...
                </Box>
              ) : (
                'Créer mon compte'
              )}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Vous avez déjà un compte ?{' '}
                <Link
                  to="/login"
                  style={{
                    color: '#6C7B8A',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Se connecter
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

export default Register;
