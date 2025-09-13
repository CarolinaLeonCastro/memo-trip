import React from 'react';
import { Box, Typography, Card } from '@mui/material';

interface DiscoverStatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

export const DiscoverStatsCard: React.FC<DiscoverStatsCardProps> = ({
  icon,
  label,
  value,
  color,
}) => {
  return (
    <Card
      sx={{
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 1,

        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',

        transition: 'all 0.3s ease',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: `rgba(${color}, 0.1)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: '0.9rem' }}
        >
          {label}
        </Typography>
      </Box>
      <Typography variant="h4" fontWeight="bold">
        {value.toLocaleString()}
      </Typography>
    </Card>
  );
};
