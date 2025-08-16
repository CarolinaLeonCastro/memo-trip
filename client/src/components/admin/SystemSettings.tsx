import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

import {
  adminService,
  type SystemSettings as SystemSettingsType,
} from '../../services/admin.service';

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settingsData = await adminService.getSystemSettings();
      setSettings(settingsData);
      setError(null);
    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      await adminService.updateSystemSettings(settings);
      setSuccess('Paramètres sauvegardés avec succès');
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (
    section: string,
    field: string,
    value: string | number | boolean
  ) => {
    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: {
          ...prev[section as keyof SystemSettingsType],
          [field]: value,
        },
      };
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!settings) {
    return (
      <Alert severity="error">
        Impossible de charger les paramètres système
      </Alert>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6">Paramètres système</Typography>
        <Box display="flex" gap={2}>
          <Button
            startIcon={<RefreshIcon />}
            onClick={loadSettings}
            disabled={loading}
          >
            Actualiser
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </Box>
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

      <Grid container spacing={3}>
        {/* Paramètres de l'application */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Application
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Nom de l'application"
                    value={settings.app.name}
                    onChange={(e) =>
                      updateSetting('app', 'name', e.target.value)
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Version"
                    value={settings.app.version}
                    onChange={(e) =>
                      updateSetting('app', 'version', e.target.value)
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Description"
                    value={settings.app.description}
                    onChange={(e) =>
                      updateSetting('app', 'description', e.target.value)
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Limites système */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Limites système
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Nombre max de lieux par journal"
                    value={settings.limits.maxPlacesPerJournal}
                    onChange={(e) =>
                      updateSetting(
                        'limits',
                        'maxPlacesPerJournal',
                        parseInt(e.target.value)
                      )
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Nombre max de photos par lieu"
                    value={settings.limits.maxPhotosPerPlace}
                    onChange={(e) =>
                      updateSetting(
                        'limits',
                        'maxPhotosPerPlace',
                        parseInt(e.target.value)
                      )
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Taille max des fichiers
                    </Typography>
                    <Chip
                      label={formatBytes(settings.limits.maxFileSize)}
                      variant="outlined"
                    />
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 1 }}
                    >
                      Modifiable dans la configuration serveur
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Fonctionnalités */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fonctionnalités
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.features.publicJournals}
                      onChange={(e) =>
                        updateSetting(
                          'features',
                          'publicJournals',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Journaux publics activés"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.features.userRegistration}
                      onChange={(e) =>
                        updateSetting(
                          'features',
                          'userRegistration',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Inscription utilisateur activée"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.features.guestAccess}
                      onChange={(e) =>
                        updateSetting(
                          'features',
                          'guestAccess',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Accès visiteur activé"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Informations système */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informations système
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      <SettingsIcon fontSize="large" />
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Version {settings.app.version}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      Dernière mise à jour
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {new Date().toLocaleDateString('fr-FR')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      Environnement
                    </Typography>
                    <Chip label="development" color="success" size="small" />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      Base de données
                    </Typography>
                    <Chip label="MongoDB" color="info" size="small" />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemSettings;
