import React from 'react';
import { Box, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MenuBookIcon from '@mui/icons-material/MenuBook';

interface DiscoverTabsProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
}

export const DiscoverTabs: React.FC<DiscoverTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Box
          onClick={() => onTabChange(0)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: activeTab === 0 ? '#2E3A59' : '#9CA3AF',
            cursor: 'pointer',
            borderBottom:
              activeTab === 0 ? '2px solid #4F86F7' : '2px solid transparent',
            pb: 1,
            transition: 'all 0.2s ease',
            '&:hover': {
              color: '#2E3A59',
            },
          }}
        >
          <LocationOnIcon sx={{ fontSize: 20 }} />
          <Typography variant="h6" fontWeight="600" sx={{ fontSize: '1rem' }}>
            Lieux
          </Typography>
        </Box>
        <Box
          onClick={() => onTabChange(1)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: activeTab === 1 ? '#2E3A59' : '#9CA3AF',
            cursor: 'pointer',
            borderBottom:
              activeTab === 1 ? '2px solid #4F86F7' : '2px solid transparent',
            pb: 1,
            transition: 'all 0.2s ease',
            '&:hover': {
              color: '#2E3A59',
            },
          }}
        >
          <MenuBookIcon sx={{ fontSize: 20 }} />
          <Typography variant="h6" fontWeight="600" sx={{ fontSize: '1rem' }}>
            Journaux
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
