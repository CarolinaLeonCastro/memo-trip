import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { userService } from '../../services/user.service';

const SettingsTab: React.FC = () => {
  const [settings, setSettings] = useState({
    journalPublic: false,
    darkMode: false,
    language: 'fr',
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Charger les paramètres utilisateur au montage du composant
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const userSettings = await userService.getSettings();
        setSettings((prev) => ({
          ...prev,
          journalPublic: userSettings.areJournalsPublic,
        }));
      } catch (err) {
        console.error('Erreur lors du chargement des paramètres:', err);
        setError('Erreur lors du chargement des paramètres');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSettingChange = async (setting: string, value: boolean) => {
    if (setting === 'journalPublic') {
      try {
        setUpdating(true);
        setError('');

        // Mettre à jour les paramètres côté serveur
        await userService.updateSettings({
          areJournalsPublic: value,
        });

        // Mettre à jour l'état local
        setSettings((prev) => ({
          ...prev,
          [setting]: value,
        }));

        setSuccess('Paramètres mis à jour avec succès');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Erreur lors de la mise à jour des paramètres:', err);
        setError('Erreur lors de la mise à jour des paramètres');
        setTimeout(() => setError(''), 5000);
      } finally {
        setUpdating(false);
      }
    } else {
      // Pour les autres paramètres (darkMode, language), garder la logique locale pour l'instant
      setSettings((prev) => ({
        ...prev,
        [setting]: value,
      }));

      setSuccess('Paramètres mis à jour avec succès');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation === 'SUPPRIMER') {
      // Logique pour supprimer le compte
      console.log('Suppression du compte');
      setShowDeleteDialog(false);
      setDeleteConfirmation('');
    }
  };

  const settingsSections = [
    {
      title: 'Confidentialité',
      icon: SecurityIcon,
      color: 'success.main',
      settings: [
        {
          key: 'journalPublic',
          label: 'Journaux publics',
          description: 'Rendre vos journaux visibles par tous',
          value: settings.journalPublic,
        },
      ],
    },
    {
      title: 'Apparence',
      icon: PaletteIcon,
      color: 'secondary.main',
      settings: [
        {
          key: 'darkMode',
          label: 'Mode sombre',
          description: 'Utiliser le thème sombre',
          value: settings.darkMode,
        },
      ],
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Sections de paramètres */}
      {settingsSections.map((section) => (
        <Card key={section.title} sx={{ borderRadius: 1, mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <section.icon
                sx={{ color: section.color, mr: 1, fontSize: 24 }}
              />
              <Typography variant="h5" fontWeight={600}>
                {section.title}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {section.settings.map((setting, settingIndex) => (
                <Box key={setting.key}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" fontWeight={500}>
                        {setting.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {setting.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                      {updating && setting.key === 'journalPublic' && (
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                      )}
                      <FormControlLabel
                        control={
                          <Switch
                            checked={setting.value}
                            onChange={(e) =>
                              handleSettingChange(setting.key, e.target.checked)
                            }
                            color="primary"
                            disabled={
                              updating && setting.key === 'journalPublic'
                            }
                          />
                        }
                        label=""
                      />
                    </Box>
                  </Box>
                  {settingIndex < section.settings.length - 1 && (
                    <Divider sx={{ mt: 2 }} />
                  )}
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* Actions de compte */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SecurityIcon sx={{ color: 'warning.main', mr: 1, fontSize: 24 }} />
            <Typography variant="h5" fontWeight={600}>
              Gestion du compte
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Suppression du compte */}
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    color="error.main"
                  >
                    Supprimer mon compte
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supprimer définitivement votre compte et toutes vos données
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setShowDeleteDialog(true)}
                  sx={{ ml: 2 }}
                >
                  Supprimer
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main' }}>
          Supprimer définitivement votre compte
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Cette action est irréversible. Toutes vos données, journaux, photos
            et informations personnelles seront définitivement supprimées.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Pour confirmer, tapez <strong>SUPPRIMER</strong> dans le champ
            ci-dessous :
          </Typography>
          <TextField
            fullWidth
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="Tapez SUPPRIMER"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Annuler</Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={deleteConfirmation !== 'SUPPRIMER'}
          >
            Supprimer définitivement
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsTab;
