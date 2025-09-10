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
import { useThemeMode } from '../../context/ThemeContext';

const SettingsTab: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useThemeMode();

  const [settings, setSettings] = useState({
    journalPublic: false,
    darkMode: isDarkMode, // Utiliser la valeur du contexte
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
        console.log(
          '🔄 useEffect: Rechargement des paramètres depuis le serveur - STACK:',
          new Error().stack?.split('\n').slice(0, 5)
        );

        // Ne pas recharger si on est en train de mettre à jour
        if (updating) {
          console.log('⏸️ useEffect bloqué : mise à jour en cours');
          return;
        }

        setLoading(true);
        const userSettings = await userService.getSettings();
        console.log('📥 useEffect: Paramètres reçus:', userSettings);
        setSettings((prev) => {
          console.log('📝 useEffect: Anciens paramètres:', prev);
          const newSettings = {
            ...prev,
            journalPublic: userSettings?.areJournalsPublic ?? false,
            darkMode: isDarkMode, // Synchroniser avec le contexte de thème
          };
          console.log('📝 useEffect: Nouveaux paramètres:', newSettings);
          return newSettings;
        });
      } catch (err) {
        console.error('Erreur lors du chargement des paramètres:', err);
        setError('Erreur lors du chargement des paramètres');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [isDarkMode]); // Ajouter isDarkMode comme dépendance

  // Synchroniser le state local quand le contexte de thème change
  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      darkMode: isDarkMode,
    }));
  }, [isDarkMode]);

  const handleSettingChange = async (setting: string, value: boolean) => {
    if (setting === 'journalPublic') {
      // Éviter les appels multiples
      if (updating) {
        console.log('⏸️ Mise à jour déjà en cours, ignorer');
        return;
      }

      try {
        setUpdating(true);
        setError('');

        console.log('🚀 Début de la mise à jour des paramètres');

        // Mettre à jour les paramètres côté serveur
        await userService.updateSettings({
          areJournalsPublic: value,
        });

        // Mettre à jour l'état local avec la réponse du serveur
        setSettings((prev) => ({
          ...prev,
          [setting]: value,
        }));

        console.log('🔄 Paramètres mis à jour localement:', {
          [setting]: value,
        });

        console.log('✅ Sauvegarde terminée avec succès!');

        setSuccess('Paramètres mis à jour avec succès');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Erreur lors de la mise à jour des paramètres:', err);
        setError('Erreur lors de la mise à jour des paramètres');
        setTimeout(() => setError(''), 5000);
      } finally {
        setUpdating(false);
      }
    } else if (setting === 'darkMode') {
      // Gérer le changement de mode sombre via le contexte
      toggleDarkMode();
      setSuccess("Mode d'affichage mis à jour");
      setTimeout(() => setSuccess(''), 3000);
    } else {
      // Pour les autres paramètres (language), garder la logique locale pour l'instant
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
                            onChange={(e) => {
                              console.log(
                                '🎛️ Switch clicked:',
                                e.target.checked
                              );
                              handleSettingChange(
                                setting.key,
                                e.target.checked
                              );
                            }}
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
