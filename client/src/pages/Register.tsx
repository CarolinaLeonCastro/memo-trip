import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Explore as ExploreIcon,
  LockOutlined as LockOutlinedIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const { register, isLoading, error, clearError, user } = useAuth();
  const navigate = useNavigate();

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

    // Validation des conditions
    if (!acceptTerms) {
      errors.terms = "Vous devez accepter les conditions d'utilisation";
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
            Créez votre compte
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Rejoignez MemoTrip et commencez à documenter vos aventures
          </Typography>
        </Box>

        <Card
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
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
                label="Nom complet"
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
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                placeholder="Votre nom complet"
              />

              <TextField
                fullWidth
                label="Adresse email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                error={!!formErrors.email}
                helperText={
                  formErrors.email || "Nous n'enverrons pas de spam, promis !"
                }
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
                sx={{ mb: 3 }}
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
                placeholder="Au moins 6 caractères"
              />

              <TextField
                fullWidth
                label="Confirmer le mot de passe"
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
                      <LockOutlinedIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleToggleConfirmPasswordVisibility}
                        disabled={isLoading}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                placeholder="Répétez votre mot de passe"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    color="primary"
                    disabled={isLoading}
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    J'accepte les{' '}
                    <Typography
                      component="span"
                      color="primary.main"
                      sx={{ cursor: 'pointer' }}
                    >
                      conditions d'utilisation
                    </Typography>{' '}
                    et la{' '}
                    <Typography
                      component="span"
                      color="primary.main"
                      sx={{ cursor: 'pointer' }}
                    >
                      politique de confidentialité
                    </Typography>
                  </Typography>
                }
                sx={{
                  mb: 3,
                  alignItems: 'flex-start',
                  ...(formErrors.terms && {
                    '& .MuiFormControlLabel-label': {
                      color: 'error.main',
                    },
                  }),
                }}
              />
              {formErrors.terms && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mb: 2, display: 'block' }}
                >
                  {formErrors.terms}
                </Typography>
              )}

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
                  !confirmPassword ||
                  !acceptTerms
                }
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
                    Création du compte...
                  </Box>
                ) : (
                  'Créer mon compte'
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
                  Vous avez déjà un compte ?
                </Typography>
                <Button
                  component={Link}
                  to="/login"
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
                  Se connecter
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            🌍 Rejoignez des milliers de voyageurs qui documentent leurs
            aventures avec MemoTrip
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;
