import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  TextField,
  Button,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Instagram as InstagramIcon,
  Article as ArticleIcon,
  FavoriteOutlined as FavoriteIcon,
  CameraAlt as CameraIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const ProfileTab: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // États pour les champs modifiables
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: "Passionnée de voyage et de découvertes culturelles. J'aime explorer de nouveaux horizons et partager mes expériences à travers mes journaux de voyage.",
    location: 'Paris, France',
    instagram: '@carolina_travels',
    memberSince: 'Mars 2023',
  });

  // Activité récente
  const recentActivities = [
    {
      type: 'new_journal',
      title: 'Nouveau journal : Rome antique',
      date: 'Il y a 2 jours',
      icon: ArticleIcon,
      color: 'primary.main',
    },
    {
      type: 'new_place',
      title: 'Lieu ajouté : Coliseum, Rome',
      date: 'Il y a 3 jours',
      icon: LocationIcon,
      color: 'success.main',
    },
    {
      type: 'photos_added',
      title: '12 photos ajoutées',
      date: 'Il y a 5 jours',
      icon: CameraIcon,
      color: 'secondary.main',
    },
    {
      type: 'journal_liked',
      title: 'Journal aimé par 5 personnes',
      date: 'Il y a 1 semaine',
      icon: FavoriteIcon,
      color: 'error.main',
    },
  ];

  const handleEdit = () => {
    setIsEditing(true);
    setSuccess(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    setFormData({
      name: user?.name || 'Carolina Leon',
      email: user?.email || 'leoncarolina36@gmail.com',
      bio: "Passionnée de voyage et de découvertes culturelles. J'aime explorer de nouveaux horizons et partager mes expériences à travers mes journaux de voyage.",
      location: 'Paris, France',
      instagram: '@carolina_travels',
      memberSince: 'Mars 2023',
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Ici, vous ajouteriez l'appel API pour sauvegarder les données
      // await userService.updateProfile(formData);

      // Simulation d'un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsEditing(false);
      setSuccess(true);

      // Cacher le message de succès après 3 secondes
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarChange = () => {
    // Ici, vous ajouteriez la logique pour changer l'avatar
    console.log("Changer l'avatar");
  };

  return (
    <Box>
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profil mis à jour avec succès !
        </Alert>
      )}

      {/* Header avec avatar et informations principales */}
      <Card sx={{ borderRadius: 1, border: 'none', mb: 3 }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #3D5A80 0%, #98C1D9 100%)',
            p: 4,
            color: 'white',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src="/api/placeholder/120/120"
                  alt={formData.name}
                  sx={{ width: 100, height: 100, border: '4px solid white' }}
                />
                {isEditing && (
                  <IconButton
                    onClick={handleAvatarChange}
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'primary.main',
                      color: 'white',
                      width: 40,
                      height: 40,
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                    }}
                  >
                    <PhotoCameraIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                )}
              </Box>

              <Box>
                {isEditing ? (
                  <TextField
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    variant="standard"
                    InputProps={{
                      style: {
                        color: 'white',
                      },
                    }}
                  />
                ) : (
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    {formData.name}
                  </Typography>
                )}

                {isEditing ? (
                  <TextField
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    variant="standard"
                    type="email"
                    InputProps={{
                      style: {
                        color: 'rgba(255,255,255,0.9)',
                      },
                    }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {formData.email}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Bouton Modifier */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {isEditing ? (
                <>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={isLoading}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'grey.100',
                      },
                    }}
                  >
                    {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Annuler
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                  }}
                >
                  Modifier
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {/* Biographie et informations */}
        <CardContent sx={{ p: 4 }}>
          {/* Biographie */}
          <Box sx={{ mb: 4 }}>
            {isEditing ? (
              <TextField
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                multiline
                rows={3}
                fullWidth
                variant="outlined"
                placeholder="Parlez-nous de vous et de votre passion pour les voyages..."
                label="À propos de moi"
              />
            ) : (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.6 }}
              >
                {formData.bio}
              </Typography>
            )}
          </Box>

          {/* Informations avec icônes */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              {isEditing ? (
                <TextField
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange('location', e.target.value)
                  }
                  variant="standard"
                  size="small"
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {formData.location}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                Membre depuis {formData.memberSince}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InstagramIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              {isEditing ? (
                <TextField
                  value={formData.instagram}
                  onChange={(e) =>
                    handleInputChange('instagram', e.target.value)
                  }
                  variant="standard"
                  size="small"
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {formData.instagram}
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Section Activité récente */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <TrendingUpIcon sx={{ color: 'info.main', mr: 1 }} />
            <Typography
              variant="h5"
              sx={{ fontFamily: 'Chau Philomene One, cursive' }}
            >
              Activité récente
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recentActivities.map((activity, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  p: 2,
                  bgcolor: 'grey.100',
                  borderRadius: '12px',
                  border: 'none',
                  borderColor: 'grey.200',
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'background.paper',
                    border: '2px solid',
                    borderColor: activity.color,
                  }}
                >
                  <activity.icon sx={{ fontSize: 16, color: activity.color }} />
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                    {activity.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {activity.date}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfileTab;
