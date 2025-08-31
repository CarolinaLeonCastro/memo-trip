import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';

interface JournalStatsProps {
  likes: number;
  comments: number;
  views: number;
  shares: number;
}

export const JournalStats: React.FC<JournalStatsProps> = ({
  likes,
  views,
  shares,
}) => {
  return (
    <Box
      sx={{ bgcolor: 'white', px: 3, py: 3, borderTop: '1px solid #F3F4F6' }}
    >
      <Container maxWidth="xl">
        {/* Statistiques */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            justifyContent: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FavoriteIcon sx={{ fontSize: 20, color: '#FF6B35' }} />
            <Typography
              variant="body2"
              fontWeight="600"
              sx={{ color: '#1F2937' }}
            >
              {likes} likes
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VisibilityIcon sx={{ fontSize: 20, color: '#6B7280' }} />
            <Typography
              variant="body2"
              fontWeight="600"
              sx={{ color: '#1F2937' }}
            >
              {views} vues
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShareIcon sx={{ fontSize: 20, color: '#6B7280' }} />
            <Typography
              variant="body2"
              fontWeight="600"
              sx={{ color: '#1F2937' }}
            >
              {shares} partages
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
