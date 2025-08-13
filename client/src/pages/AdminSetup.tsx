import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../config/api.config';

const AdminSetup: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasAdmin, setHasAdmin] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    try {
      setLoading(true);
      const response = await api.get('/setup/check-admin');
      setHasAdmin(response.data.hasAdmin);
    } catch (err) {
      console.error('Error checking admin:', err);
      setError('Erreur lors de la vérification');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      // Effacer les erreurs quand l'utilisateur tape
      if (error) setError(null);
    };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('Tous les champs sont requis');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez entrer un email valide');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setCreating(true);
      setError(null);

      const response = await api.post('/setup/create-admin', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setSuccess(
        'Administrateur créé avec succès ! Vous pouvez maintenant vous connecter.'
      );

      // Redirection vers la page de connexion après 2 secondes
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Error creating admin:', err);
      setError(
        err.response?.data?.message ||
          "Erreur lors de la création de l'administrateur"
      );
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (hasAdmin) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CheckIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Système déjà configuré
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Un administrateur existe déjà dans le système. Vous pouvez vous
            connecter avec vos identifiants.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            size="large"
          >
            Aller à la connexion
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={4}>
            <AdminIcon color="primary" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Configuration initiale
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Créez le premier compte administrateur pour MemoTrip
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nom complet"
              value={formData.name}
              onChange={handleInputChange('name')}
              margin="normal"
              required
              autoFocus
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              margin="normal"
              required
              helperText="Au moins 6 caractères"
            />

            <TextField
              fullWidth
              label="Confirmer le mot de passe"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              margin="normal"
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={creating}
              sx={{ mt: 3, mb: 2 }}
            >
              {creating ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Création en cours...
                </>
              ) : (
                "Créer l'administrateur"
              )}
            </Button>
          </form>

          <Box mt={3} p={3} bgcolor="grey.50" borderRadius={1}>
            <Typography variant="body2" color="text.secondary">
              <strong>Note:</strong> Ce compte aura tous les privilèges
              d'administration. Vous pourrez créer d'autres administrateurs
              depuis le panel d'administration.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminSetup;
