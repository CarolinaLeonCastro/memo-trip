import React from 'react';
import { Box, Chip } from '@mui/material';

interface JournalTagsProps {
  tags?: string[];
}

export const JournalTags: React.FC<JournalTagsProps> = ({ tags }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap' }}>
      {tags && tags.length > 0 ? (
        tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            sx={{
              backgroundColor: 'tertiary.main',
              color: 'primary.main',
              fontWeight: 500,
            }}
          />
        ))
      ) : (
        <Chip
          label="Aucun tag"
          sx={{
            backgroundColor: 'grey.100',
            color: 'grey.600',
            fontWeight: 500,
          }}
        />
      )}
    </Box>
  );
};
