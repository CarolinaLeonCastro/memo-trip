import React from 'react';
import { Box, Typography, Grid, useTheme } from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Route as RouteIcon,
  WbSunny as WbSunnyIcon,
  Euro as EuroIcon,
} from '@mui/icons-material';
import { DiscoverStatsCard } from '../discover/DiscoverStatsCard';

interface TravelStats {
  duration: number;
  distance: number;
  season: string;
  budget: number;
}

interface JournalTravelInfoProps {
  travelStats: TravelStats;
}

export const JournalTravelInfo: React.FC<JournalTravelInfoProps> = ({
  travelStats,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{
          mb: 3,
          color: 'primary.main',
          fontFamily: '"Chau Philomene One", cursive',
        }}
      >
        Informations de voyage
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 6, md: 3 }}>
          <DiscoverStatsCard
            icon={<AccessTimeIcon sx={{ fontSize: 24, color: '#4F86F7' }} />}
            label="Durée en jours"
            value={travelStats.duration}
            color="79, 134, 247"
          />
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <DiscoverStatsCard
            icon={<RouteIcon sx={{ fontSize: 24, color: '#FF8A00' }} />}
            label="Distance en km"
            value={travelStats.distance}
            color="255, 138, 0"
          />
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <Box
            sx={{
              p: 3,

              borderRadius: 1,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              bgcolor: 'background.paper',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                transform: 'translateY(-2px)',
              },
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: 'rgba(76, 175, 80, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}
              >
                <WbSunnyIcon sx={{ fontSize: 24, color: '#4CAF50' }} />
              </Box>
              <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                Saison
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight="bold">
              {travelStats.season || 'Non définie'}
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <DiscoverStatsCard
            icon={<EuroIcon sx={{ fontSize: 24, color: '#F44336' }} />}
            label="Budget"
            value={travelStats.budget}
            color="244, 67, 54"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
