import React from 'react';
import { Box, Container, Typography, Grid, CardMedia } from '@mui/material';

interface Photo {
  url: string;
  alt?: string;
}

interface PhotoGalleryGridProps {
  photos: Photo[];
  onPhotoClick?: (photo: Photo, index: number) => void;
}

export const PhotoGalleryGrid: React.FC<PhotoGalleryGridProps> = ({
  photos,
  onPhotoClick,
}) => {
  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <Box sx={{ bgcolor: 'white', px: 3, py: 4 }}>
      <Container maxWidth="xl">
        <Typography
          variant="h5"
          fontWeight="700"
          sx={{ color: '#1F2937', mb: 3, textAlign: 'center' }}
        >
          Photos du voyage ({photos.length})
        </Typography>
        <Grid container spacing={2}>
          {photos.map((photo, index) => (
            <Grid key={index} size={{ xs: 6, sm: 4, md: 3 }}>
              <CardMedia
                component="img"
                sx={{
                  width: '100%',
                  height: 200,
                  borderRadius: 2,
                  objectFit: 'cover',
                  cursor: onPhotoClick ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  '&:hover': onPhotoClick
                    ? {
                        transform: 'scale(1.02)',
                        boxShadow: 2,
                      }
                    : {},
                }}
                image={photo.url}
                alt={photo.alt || `Photo ${index + 1}`}
                onClick={() => onPhotoClick?.(photo, index)}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
