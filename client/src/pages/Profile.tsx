import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import {
  Person as PersonIcon,
  LocationOn as LocationIcon,
  PhotoCamera as PhotoCameraIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useJournals } from '../context/JournalContext';

const Profile: React.FC = () => {
  const { journals } = useJournals();

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

  const stats = [
    {
      label: 'Journaux créés',
      value: journals.length,
      icon: CalendarIcon,
      color: 'primary.main',
      bgcolor: 'primary.light',
    },
    {
      label: 'Lieux visités',
      value: totalPlaces,
      icon: LocationIcon,
      color: 'success.main',
      bgcolor: 'success.light',
    },
    {
      label: 'Photos partagées',
      value: totalPhotos,
      icon: PhotoCameraIcon,
      color: 'secondary.main',
      bgcolor: 'secondary.light',
    },
  ];

  return (
    <Box>
      {/* Profile Header */}
      <Card sx={{ mb: 4 }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #3D5A80 0%, #98C1D9 100%)',
            p: 4,
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'white' }}>
              <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            </Avatar>
            <Box>
              <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                Voyageur Passionné
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                voyageur@example.com
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Stats */}
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {stats.map((stat) => (
              <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: stat.bgcolor,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <stat.icon sx={{ fontSize: 32, color: stat.color }} />
                  </Avatar>
                  <Typography
                    variant="h3"
                    fontWeight={700}
                    color={stat.color}
                    sx={{ mb: 1 }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Recent Journals */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
            Mes Derniers Voyages
          </Typography>

          {journals.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Aucun voyage enregistré pour le moment
              </Typography>
            </Box>
          ) : (
            <List>
              {journals.slice(0, 3).map((journal, index) => (
                <ListItem
                  key={journal.id}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    mb: index < 2 ? 2 : 0,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={
                        journal.places[0]?.photos[0] ||
                        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=100'
                      }
                      alt={journal.title}
                      sx={{ width: 64, height: 64 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="h6" fontWeight={600}>
                        {journal.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {journal.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <LocationIcon
                              sx={{ fontSize: 16, color: 'text.secondary' }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {journal.places.length} lieu
                              {journal.places.length !== 1 ? 'x' : ''}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <PhotoCameraIcon
                              sx={{ fontSize: 16, color: 'text.secondary' }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {journal.places.reduce(
                                (sum, place) => sum + place.photos.length,
                                0
                              )}{' '}
                              photo
                              {journal.places.reduce(
                                (sum, place) => sum + place.photos.length,
                                0
                              ) !== 1
                                ? 's'
                                : ''}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
