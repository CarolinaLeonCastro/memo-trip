import React from 'react';
import { Box, Typography } from '@mui/material';

interface JournalContentProps {
  content: string;
  title?: string;
}

export const JournalContent: React.FC<JournalContentProps> = ({
  content,
  title = 'Journal de voyage',
}) => {
  // Diviser le contenu en paragraphes
  const paragraphs = content.split('\n').filter((p) => p.trim() !== '');

  return (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h4"
        fontWeight="700"
        sx={{ color: '#1F2937', mb: 4 }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          bgcolor: 'white',
          p: 4,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0',
        }}
      >
        {paragraphs.map((paragraph, index) => {
          // Vérifier si c'est un titre de section (commence par "Day" ou contient " - ")
          const isTitle =
            paragraph.includes(' - ') || paragraph.startsWith('Day');

          return (
            <Typography
              key={index}
              variant={isTitle ? 'h6' : 'body1'}
              fontWeight={isTitle ? '700' : '400'}
              sx={{
                color: isTitle ? '#1F2937' : '#4B5563',
                mb: isTitle ? 2 : 1.5,
                lineHeight: 1.7,
                fontSize: isTitle ? '1.1rem' : '1rem',
                mt: isTitle && index > 0 ? 3 : 0,
              }}
            >
              {paragraph}
            </Typography>
          );
        })}
      </Box>
    </Box>
  );
};
