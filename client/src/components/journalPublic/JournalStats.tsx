import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhotoIcon from '@mui/icons-material/Photo';

interface JournalStats {
  favorites: number;
  views: number;
  places: number;
  photos: number;
}

interface JournalStatsProps {
  stats: JournalStats;
}

export const JournalStats: React.FC<JournalStatsProps> = ({ stats }) => {
  const statsData = [
    {
      icon: <FavoriteIcon sx={{ fontSize: 24, color: '#EF4444' }} />,
      label: "J'aime",
      value: stats.favorites,
    },
    {
      icon: <VisibilityIcon sx={{ fontSize: 24, color: '#6366F1' }} />,
      label: 'Vues',
      value: stats.views,
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 24, color: '#10B981' }} />,
      label: 'Lieux',
      value: stats.places,
    },
    {
      icon: <PhotoIcon sx={{ fontSize: 24, color: '#F59E0B' }} />,
      label: 'Photos',
      value: stats.photos,
    },
  ];

  return (
    <Box
      sx={{ bgcolor: 'white', px: 3, py: 3, borderTop: '1px solid #F3F4F6' }}
    >
      <Container maxWidth="xl">
        {/* Statistiques */}
        <Typography
          variant="h5"
          fontWeight="700"
          sx={{ color: '#1F2937', mb: 3, textAlign: 'center' }}
        >
          Statistiques
        </Typography>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {statsData.map((item, index) => (
            <Grid key={index} size={{ xs: 6, md: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Box sx={{ mb: 1 }}>{item.icon}</Box>
                <Typography
                  variant="body2"
                  sx={{ color: '#6B7280', mb: 0.5, fontSize: '0.9rem' }}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="600"
                  sx={{ color: '#1F2937' }}
                >
                  {item.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
