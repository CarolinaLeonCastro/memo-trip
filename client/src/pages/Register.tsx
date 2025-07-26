import React, { useState } from 'react';
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
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      return;
    }
    const success = await register(email, password, confirmPassword);
    if (success) {
      navigate('/journals');
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const isFormValid = email && password && confirmPassword && acceptTerms;

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
                  onClose={() => {
                    /* TODO: Gérer la fermeture de l'erreur */
                  }}
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
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                placeholder="exemple@email.com"
                helperText="Nous n'enverrons pas de spam, promis !"
              />

              <TextField
                fullWidth
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
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
                helperText="Minimum 6 caractères"
              />

              <TextField
                fullWidth
                label="Confirmer le mot de passe"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
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
                error={confirmPassword !== '' && password !== confirmPassword}
                helperText={
                  confirmPassword !== '' && password !== confirmPassword
                    ? 'Les mots de passe ne correspondent pas'
                    : 'Doit correspondre au mot de passe ci-dessus'
                }
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
                sx={{ mb: 3, alignItems: 'flex-start' }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading || !isFormValid}
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
