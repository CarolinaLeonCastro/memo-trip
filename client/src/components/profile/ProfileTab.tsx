import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Skeleton,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
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
  const [recentActivities, setRecentActivities] = useState<UserActivity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  // Charger l'activité récente au montage du composant
  useEffect(() => {
    const loadRecentActivity = async () => {
      try {
        setActivitiesLoading(true);

        const activities = await userService.getUserActivity(8);

        setRecentActivities(activities);
      } catch {
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

  return (
    <Box>
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
              <Avatar
                src={user?.avatar?.url}
                sx={{
                  width: { xs: 80, sm: 100 },
                  height: { xs: 80, sm: 100 },
                  bgcolor: '#4F86F7',
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  border: '4px solid white',
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>

              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 1,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  }}
                >
                  {user?.name || 'Nom non disponible'}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.9,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                  }}
                >
                  {user?.email || 'Email non disponible'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
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
