import React from 'react';
import { Box, Typography } from '@mui/material';

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
    <Box
      sx={{
        p: 3,
        bgcolor: 'white',
        borderRadius: 1,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)',
        },
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
      <Typography variant="h4" fontWeight="bold" sx={{ color: '#2E3A59' }}>
        {value.toLocaleString()}
      </Typography>
    </Box>
  );
};
