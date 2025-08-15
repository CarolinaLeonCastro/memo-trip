import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  Grid,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  PhotoCamera as PhotoCameraIcon,
  LocationOn as LocationIcon,
  Public as PublicIcon,
  CalendarToday as CalendarIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useJournals } from '../../context/JournalContext';

const AchievementsTab: React.FC = () => {
  const { journals } = useJournals();

  // Calculs pour les badges
  const totalPlaces = journals.reduce(
    (sum, journal) => sum + journal.places.length,
    0
  );

  const totalPhotos = journals.reduce(
    (sum, journal) =>
      sum +
      journal.places.reduce(
        (placeSum, place) => placeSum + place.photos.length,
        0
      ),
    0
  );

  const visitedCountries = new Set(
    journals.flatMap((journal) => journal.places.map((place) => place.country))
  ).size;

  // Définition des badges
  const badges = [
    {
      id: 'first_journal',
      title: 'Premier Voyage',
      description: 'Créer votre premier journal de voyage',
      icon: CalendarIcon,
      color: 'primary',
      bgcolor: 'primary.light',
      unlocked: journals.length >= 1,
      progress: Math.min(journals.length, 1),
      target: 1,
    },
    {
      id: 'photo_collector',
      title: 'Collectionneur de Photos',
      description: 'Partager 50 photos',
      icon: PhotoCameraIcon,
      color: 'secondary',
      bgcolor: 'secondary.light',
      unlocked: totalPhotos >= 50,
      progress: totalPhotos,
      target: 50,
    },
    {
      id: 'explorer',
      title: 'Explorateur',
      description: 'Visiter 10 lieux différents',
      icon: LocationIcon,
      color: 'success',
      bgcolor: 'success.light',
      unlocked: totalPlaces >= 10,
      progress: totalPlaces,
      target: 10,
    },
    {
      id: 'world_traveler',
      title: 'Voyageur du Monde',
      description: 'Visiter 5 pays différents',
      icon: PublicIcon,
      color: 'info',
      bgcolor: 'info.light',
      unlocked: visitedCountries >= 5,
      progress: visitedCountries,
      target: 5,
    },
    {
      id: 'journal_master',
      title: 'Maître des Journaux',
      description: 'Créer 10 journaux',
      icon: CalendarIcon,
      color: 'warning',
      bgcolor: 'warning.light',
      unlocked: journals.length >= 10,
      progress: journals.length,
      target: 10,
    },
    {
      id: 'legend',
      title: 'Légende du Voyage',
      description: 'Débloquer tous les autres badges',
      icon: TrophyIcon,
      color: 'error',
      bgcolor: 'error.light',
      unlocked: false, // Badge spécial
      progress: 0,
      target: 1,
    },
  ];

  const unlockedBadges = badges.filter((badge) => badge.unlocked);
  const lockedBadges = badges.filter((badge) => !badge.unlocked);

  return (
    <Box>
      {/* Section des badges débloqués */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <TrophyIcon sx={{ color: 'warning.main', mr: 1, fontSize: 28 }} />
            <Typography
              variant="h5"
              sx={{ fontFamily: 'Chau Philomene One, cursive' }}
            >
              Réussites Débloquées
            </Typography>
            <Chip
              label={`${unlockedBadges.length}/${badges.length}`}
              color="primary"
              sx={{ ml: 2 }}
            />
          </Box>

          {unlockedBadges.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Aucune réussite débloquée pour le moment. Commencez à voyager
                pour débloquer vos premiers badges !
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {unlockedBadges.map((badge) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={badge.id}>
                  <Box
                    sx={{
                      p: 3,
                      border: '2px solid',
                      borderColor: `${badge.color}.main`,
                      borderRadius: 0.5,
                      bgcolor: 'background.paper',
                      textAlign: 'center',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3,
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    {/* Badge débloqué indicator */}
                    <Chip
                      label="DÉBLOQUÉ"
                      color={badge.color as 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: 8,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                      }}
                    />

                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: badge.bgcolor,
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <badge.icon
                        sx={{ fontSize: 20, color: `${badge.color}.main` }}
                      />
                    </Avatar>

                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                      {badge.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {badge.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StarIcon sx={{ color: 'warning.main', fontSize: 16 }} />
                      <Typography variant="caption" color="text.secondary">
                        Complété le {new Date().toLocaleDateString('fr-FR')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Section des badges en cours */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <LockIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <Typography
              variant="h5"
              sx={{ fontFamily: 'Chau Philomene One, cursive' }}
            >
              Réussites en Cours
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {lockedBadges.map((badge) => {
              const progressPercent = Math.min(
                (badge.progress / badge.target) * 100,
                100
              );

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={badge.id}>
                  <Box
                    sx={{
                      p: 3,
                      border: '2px dashed',
                      borderColor: 'divider',
                      borderRadius: 1,
                      bgcolor: 'grey.50',
                      textAlign: 'center',
                      opacity: 0.7,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: 'grey.200',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <badge.icon sx={{ fontSize: 20, color: 'grey.500' }} />
                    </Avatar>

                    <Typography
                      variant="body1"
                      fontWeight={600}
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {badge.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {badge.description}
                    </Typography>

                    {/* Progress bar */}
                    <Box sx={{ mb: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={progressPercent}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            bgcolor: `${badge.color}.main`,
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, display: 'block' }}
                      >
                        {badge.progress} / {badge.target}
                      </Typography>
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                      {Math.round(progressPercent)}% complété
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AchievementsTab;
