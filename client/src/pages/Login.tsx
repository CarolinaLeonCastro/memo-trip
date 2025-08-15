import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Container,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Explore as ExploreIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

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
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 3,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          {/* Logo et titre */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <ExploreIcon sx={{ color: 'primary.main', fontSize: 40, mr: 1 }} />
            <Typography variant="h4" fontWeight={700} color="text.primary">
              MemoTrip
            </Typography>
          </Box>
          <Typography
            variant="h5"
            fontWeight={600}
            color="text.primary"
            gutterBottom
          >
            Bon retour !
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Connectez-vous pour accéder à vos carnets de voyage
          </Typography>
        </Box>

        <Card
          sx={{
            p: { xs: 2, sm: 3 },

            boxShadow: (theme) =>
              theme.palette.mode === 'light'
                ? '0 4px 20px rgba(61, 90, 128, 0.08)'
                : '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          <CardContent>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: '100%' }}
            >
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
                label="Adresse email"
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
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                placeholder="exemple@email.com"
              />

              <TextField
                fullWidth
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                error={!!formErrors.password}
                helperText={formErrors.password}
                sx={{ mb: 4 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        disabled={isLoading}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                placeholder="Votre mot de passe"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading || !email || !password}
                sx={{
                  py: 1.5,
                  mb: 3,
                  fontSize: '1rem',
                  fontWeight: 600,
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

              <Divider sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OU
                </Typography>
              </Divider>

              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Vous n'avez pas encore de compte ?
                </Typography>
                <Button
                  component={Link}
                  to="/register"
                  variant="outlined"
                  size="large"
                  fullWidth
                  disabled={isLoading}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  Créer un compte
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            En vous connectant, vous acceptez nos{' '}
            <Typography
              component="span"
              color="primary.main"
              sx={{ cursor: 'pointer' }}
            >
              conditions d'utilisation
            </Typography>{' '}
            et notre{' '}
            <Typography
              component="span"
              color="primary.main"
              sx={{ cursor: 'pointer' }}
            >
              politique de confidentialité
            </Typography>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
