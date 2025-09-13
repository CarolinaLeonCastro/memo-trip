import React from 'react';
import { Box, Typography } from '@mui/material';

interface JournalContentProps {
  journal: {
    description?: string;
    personalNotes?: string;
  };
}

export const JournalContent: React.FC<JournalContentProps> = ({ journal }) => {
  return (
    <>
      {/* Description */}
      {journal.description && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Chau Philomene One", cursive',
                mb: 2,
                color: 'primary.main',
              }}
            >
              Description du voyage
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
              {journal.description}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Notes personnelles */}
      {journal.personalNotes && (
        <Box sx={{ mb: 4 }}>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Chau Philomene One", cursive',
                mb: 2,
                color: 'text.primary',
              }}
            >
              Notes personnelles
            </Typography>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.7,
                fontStyle: 'italic',
                color: 'text.primary',
              }}
            >
              {journal.personalNotes}
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};
