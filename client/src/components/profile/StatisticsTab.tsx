import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  Grid,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  PhotoCamera as PhotoCameraIcon,
  CalendarToday as CalendarIcon,
  Public as PublicIcon,
  Star as StarIcon,
  Flight as FlightIcon,
} from '@mui/icons-material';
import { useJournals } from '../../context/JournalContext';

const StatisticsTab: React.FC = () => {
  const { journals } = useJournals();

  // Calculs des statistiques
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

  // Calcul des pays visités (basé sur les lieux)
  const visitedCountries = new Set(
    journals.flatMap((journal) => journal.places.map((place) => place.country))
  ).size;

  const stats = [
    {
      label: 'Journaux créés',
      value: journals.length,
      icon: CalendarIcon,
      color: 'primary.main',
      bgcolor: 'primary.light',
      description: 'Voyages documentés',
    },
    {
      label: 'Lieux visités',
      value: totalPlaces,
      icon: LocationIcon,
      color: 'success.main',
      bgcolor: 'success.light',
      description: 'Destinations explorées',
    },
    {
      label: 'Photos partagées',
      value: totalPhotos,
      icon: PhotoCameraIcon,
      color: 'secondary.main',
      bgcolor: 'secondary.light',
      description: 'Souvenirs capturés',
    },
    {
      label: 'Pays visités',
      value: visitedCountries,
      icon: PublicIcon,
      color: 'info.main',
      bgcolor: 'info.light',
      description: 'Cultures découvertes',
    },
  ];

  // Objectifs de voyage (simulation)
  const travelGoals = [
    {
      title: 'Visiter 10 pays',
      current: visitedCountries,
      target: 10,
      color: 'primary',
    },
    {
      title: 'Créer 20 journaux',
      current: journals.length,
      target: 20,
      color: 'secondary',
    },
    {
      title: 'Partager 500 photos',
      current: totalPhotos,
      target: 500,
      color: 'success',
    },
  ];

  return (
    <Box>
      {/* Statistiques principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: stat.bgcolor,
                      mr: 2,
                    }}
                  >
                    <stat.icon sx={{ fontSize: 24, color: stat.color }} />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      color={stat.color}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                  {stat.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Objectifs de voyage */}
        <Grid size={{ xs: 12, md: 12 }}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <StarIcon sx={{ color: 'warning.main', mr: 1 }} />
                <Typography
                  variant="h5"
                  fontWeight={600}
                  sx={{ fontFamily: 'Chau Philomene One, cursive' }}
                >
                  Objectifs de voyage
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {travelGoals.map((goal, index) => {
                  const progress = Math.min(
                    (goal.current / goal.target) * 100,
                    100
                  );

                  return (
                    <Box key={index}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2">{goal.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {goal.current} / {goal.target}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        color={
                          goal.color as 'primary' | 'secondary' | 'success'
                        }
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                          },
                        }}
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          mt: 0.5,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {Math.round(progress)}% complété
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tendances et insights */}
      <Card sx={{ mt: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            sx={{ mb: 3, fontFamily: 'Chau Philomene One, cursive' }}
          >
            Tendances de voyage
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Destinations préférées
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['France', 'Italie', 'Espagne', 'Portugal'].map(
                    (country) => (
                      <Chip
                        key={country}
                        label={country}
                        variant="filled"
                        icon={
                          <FlightIcon sx={{ fontSize: 16, color: '#fff' }} />
                        }
                        sx={{ mb: 1, bgcolor: 'tertiary.main' }}
                      />
                    )
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Période de voyage favorite
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vous voyagez principalement au <strong>printemps</strong> et
                  en <strong>été</strong>, profitant des beaux jours pour
                  explorer de nouvelles destinations.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StatisticsTab;
