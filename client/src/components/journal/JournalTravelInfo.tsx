import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RouteIcon from '@mui/icons-material/Route';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface TravelInfo {
  duration: string;
  distance: string;
  season: string;
  budget: string;
}

interface JournalTravelInfoProps {
  travelInfo: TravelInfo;
}

export const JournalTravelInfo: React.FC<JournalTravelInfoProps> = ({
  travelInfo,
}) => {
  const travelData = [
    {
      icon: <AccessTimeIcon sx={{ fontSize: 24, color: '#4F86F7' }} />,
      label: 'Durée',
      value: travelInfo.duration,
    },
    {
      icon: <RouteIcon sx={{ fontSize: 24, color: '#10B981' }} />,
      label: 'Distance',
      value: travelInfo.distance,
    },
    {
      icon: <WbSunnyIcon sx={{ fontSize: 24, color: '#F59E0B' }} />,
      label: 'Saison',
      value: travelInfo.season,
    },
    {
      icon: <AttachMoneyIcon sx={{ fontSize: 24, color: '#EF4444' }} />,
      label: 'Budget',
      value: travelInfo.budget,
    },
  ];

  return (
    <Box
      sx={{ bgcolor: 'white', px: 3, py: 3, borderTop: '1px solid #F3F4F6' }}
    >
      <Container maxWidth="xl">
        {/* Informations de voyage */}
        <Typography
          variant="h5"
          fontWeight="700"
          sx={{ color: '#1F2937', mb: 3, textAlign: 'center' }}
        >
          Informations de voyage
        </Typography>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {travelData.map((item, index) => (
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
