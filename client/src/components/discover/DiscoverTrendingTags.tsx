import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface DiscoverTrendingTagsProps {
  tags: string[];
  selectedTags: string[];
  onTagClick: (tag: string) => void;
}

export const DiscoverTrendingTags: React.FC<DiscoverTrendingTagsProps> = ({
  tags,
  selectedTags,
  onTagClick,
}) => {
  return (
    <Box
      sx={{
        p: 3,
        mb: 4,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TrendingUpIcon sx={{ fontSize: 20, color: '#4F86F7', mr: 1 }} />
        <Typography
          variant="h6"
          fontWeight="600"
          sx={{ color: '#2E3A59', fontSize: '1.1rem' }}
        >
          Tags tendance
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            onClick={() => onTagClick(tag)}
            sx={{
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: '500',
              height: 32,
              bgcolor: selectedTags.includes(tag) ? '#4F86F7' : '#F8FAFC',
              color: selectedTags.includes(tag) ? 'white' : '#6B7280',
              border: `1px solid ${selectedTags.includes(tag) ? '#4F86F7' : '#E5E7EB'}`,
              borderRadius: 2,
              '&:hover': {
                bgcolor: selectedTags.includes(tag) ? '#3B82F6' : '#4F86F7',
                color: 'white',
                border: '1px solid #4F86F7',
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 8px rgba(79, 134, 247, 0.2)',
              },
              transition: 'all 0.2s ease',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};
