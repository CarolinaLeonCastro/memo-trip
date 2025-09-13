import React, { useState, useEffect } from 'react';
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
  Skeleton,
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
  EditNote as EditNoteIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/user.service';
import type { UserActivity } from '../../services/user.service';

const ProfileTab: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [recentActivities, setRecentActivities] = useState<UserActivity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  // États pour les champs modifiables
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: "Passionnée de voyage et de découvertes culturelles. J'aime explorer de nouveaux horizons et partager mes expériences à travers mes journaux de voyage.",
    location: 'Paris, France',
    instagram: '@carolina_travels',
    memberSince: user?.created_at || 'Mars 2025',
  });

  // Charger l'activité récente au montage du composant
  useEffect(() => {
    const loadRecentActivity = async () => {
      try {
        setActivitiesLoading(true);

        const activities = await userService.getUserActivity(8);

        setRecentActivities(activities);
      } catch (error) {
        // En cas d'erreur, garder un tableau vide
        setRecentActivities([]);
      } finally {
        setActivitiesLoading(false);
      }
    };

    loadRecentActivity();
  }, []);

  // Mapper les icônes depuis les chaînes vers les composants React
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ElementType } = {
      ArticleIcon,
      LocationIcon,
      CameraIcon,
      FavoriteIcon,
      EditNoteIcon,
    };
    return iconMap[iconName] || ArticleIcon;
  };

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
      memberSince: user?.created_at || 'Mars 2025',
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
      <Card sx={{ borderRadius: 1, mb: 3 }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #3D5A80 0%, #98C1D9 100%)',
            p: { xs: 2, sm: 4 }, // Padding responsive
            color: 'white',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' }, // Stack sur mobile
              gap: { xs: 2, sm: 0 }, // Espacement sur mobile
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 2, sm: 3 },
                flexDirection: { xs: 'column', sm: 'row' }, // Stack sur mobile
                textAlign: { xs: 'center', sm: 'left' },
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src="/api/placeholder/120/120"
                  alt={formData.name}
                  sx={{
                    width: { xs: 80, sm: 100 },
                    height: { xs: 80, sm: 100 },
                    border: '4px solid white',
                  }}
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
                      width: { xs: 32, sm: 40 },
                      height: { xs: 32, sm: 40 },
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                    }}
                  >
                    <PhotoCameraIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                  </IconButton>
                )}
              </Box>

              <Box>
                {isEditing ? (
                  <TextField
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    variant="standard"
                    fullWidth
                    InputProps={{
                      style: {
                        color: 'white',
                        fontSize: '1.25rem',
                      },
                    }}
                    sx={{ mb: 1 }}
                  />
                ) : (
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 1,
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    }}
                  >
                    {formData.name}
                  </Typography>
                )}

                {isEditing ? (
                  <TextField
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    variant="standard"
                    type="email"
                    fullWidth
                    InputProps={{
                      style: {
                        color: 'rgba(255,255,255,0.9)',
                      },
                    }}
                  />
                ) : (
                  <Typography
                    variant="body1"
                    sx={{
                      opacity: 0.9,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    }}
                  >
                    {formData.email}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Boutons Modifier/Sauvegarder - Section responsive améliorée */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexDirection: { xs: 'column', sm: 'row' }, // Stack verticalement sur mobile
                width: { xs: '100%', sm: 'auto' }, // Pleine largeur sur mobile
                '& > button': {
                  width: { xs: '100%', sm: 'auto' }, // Boutons pleine largeur sur mobile
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  py: { xs: 1.5, sm: 1 }, // Plus de padding vertical sur mobile
                },
              }}
            >
              {isEditing ? (
                <>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={isLoading}
                    sx={{
                      '&:hover': {
                        bgcolor: 'grey.100',
                      },
                      '&:disabled': {
                        bgcolor: 'rgba(255,255,255,0.7)',
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
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
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
                sx={{
                  lineHeight: 1.6,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                }}
              >
                {formData.bio}
              </Typography>
            )}
          </Box>

          {/* Informations avec icônes */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 2, sm: 3 },
              mb: 2,
              flexDirection: { xs: 'column', sm: 'row' }, // Stack sur mobile
            }}
          >
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
                  fullWidth
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
                  fullWidth
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
            {activitiesLoading ? (
              // Skeleton loader pendant le chargement
              Array.from({ length: 4 }).map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: '12px',
                  }}
                >
                  <Skeleton variant="circular" width={32} height={32} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="text" width="40%" height={16} />
                  </Box>
                </Box>
              ))
            ) : !recentActivities || recentActivities.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 4,
                  textAlign: 'center',
                }}
              >
                <TrendingUpIcon
                  sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  Aucune activité récente
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Commencez à créer des journaux et ajouter des lieux pour voir
                  votre activité ici
                </Typography>
              </Box>
            ) : (
              recentActivities.map((activity, index) => {
                const IconComponent = getIconComponent(activity.icon);
                return (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      p: 2,
                      bgcolor: 'background.paper',
                      borderRadius: '12px',
                      border: 'none',
                      borderColor: 'divider',
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
                      <IconComponent
                        sx={{ fontSize: 16, color: activity.color }}
                      />
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        sx={{ mb: 0.5 }}
                      >
                        {activity.title}
                      </Typography>
                      {activity.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          {activity.description}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {activity.formattedDate}
                      </Typography>
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfileTab;
