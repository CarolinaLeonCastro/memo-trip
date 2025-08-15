import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

const SettingsTab: React.FC = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    journalPublic: false,
    darkMode: false,
    language: 'fr',
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [success, setSuccess] = useState('');

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));

    // Ici vous ajouteriez l'appel API pour sauvegarder
    setSuccess('Paramètres mis à jour avec succès');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleExportData = () => {
    // Logique pour exporter les données
    console.log('Export des données');
    setSuccess('Export des données en cours...');
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
      title: 'Notifications',
      icon: NotificationsIcon,
      color: 'primary.main',
      settings: [
        {
          key: 'emailNotifications',
          label: 'Notifications par email',
          description: 'Recevoir des notifications par email',
          value: settings.emailNotifications,
        },
        {
          key: 'pushNotifications',
          label: 'Notifications push',
          description: 'Recevoir des notifications sur votre appareil',
          value: settings.pushNotifications,
        },
      ],
    },
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

  return (
    <Box>
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Sections de paramètres */}
      {settingsSections.map((section, sectionIndex) => (
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
                    <FormControlLabel
                      control={
                        <Switch
                          checked={setting.value}
                          onChange={(e) =>
                            handleSettingChange(setting.key, e.target.checked)
                          }
                          color="primary"
                        />
                      }
                      label=""
                      sx={{ ml: 2 }}
                    />
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
            {/* Export des données */}
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    Exporter mes données
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Télécharger toutes vos données en format JSON
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportData}
                  sx={{ ml: 2 }}
                >
                  Exporter
                </Button>
              </Box>
            </Box>

            <Divider />

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
