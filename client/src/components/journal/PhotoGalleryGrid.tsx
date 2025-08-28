import React from 'react';
import { Box, Typography, Grid, Card } from '@mui/material';

interface Photo {
  url: string;
  caption: string;
}

interface PhotoGalleryGridProps {
  photos: Photo[];
  title?: string;
}

export const PhotoGalleryGrid: React.FC<PhotoGalleryGridProps> = ({
  photos,
  title = 'Galerie photo',
}) => {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h4"
        fontWeight="700"
        sx={{ color: '#1F2937', mb: 4 }}
      >
        {title}
      </Typography>
      <Grid container spacing={2}>
        {photos.map((photo, index) => (
          <Grid key={index} size={{ xs: 6, md: 3 }}>
            <Card
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.2s ease-in-out',
                },
                cursor: 'pointer',
              }}
            >
              <Box
                component="img"
                src={photo.url}
                alt={photo.caption}
                sx={{
                  width: '100%',
                  height: 200,
                  objectFit: 'cover',
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
