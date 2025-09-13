import React from 'react';
import { Box, Typography } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

interface DiscoverTabsProps {
  // Props maintenues pour la compatibilité mais plus utilisées
  activeTab?: number;
  onTabChange?: (tab: number) => void;
}

export const DiscoverTabs: React.FC<DiscoverTabsProps> = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: '#2E3A59',
            borderBottom: '2px solid #4F86F7',
            pb: 1,
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
