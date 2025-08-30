import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface Photo {
  url: string;
  caption?: string;
}

interface PlaceImageGalleryProps {
  photos: Photo[];
  height?: number;
}

export const PlaceImageGallery: React.FC<PlaceImageGalleryProps> = ({
  photos,
  height = 400,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: height,
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: '#f5f5f5',
      }}
    >
      {/* Image principale */}
      <Box
        component="img"
        src={photos[currentImageIndex]?.url}
        alt={
          photos[currentImageIndex]?.caption || `Image ${currentImageIndex + 1}`
        }
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Boutons de navigation */}
      {photos.length > 1 && (
        <>
          <IconButton
            onClick={handlePrevImage}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.9)',
              color: '#1976d2',
              '&:hover': { bgcolor: 'white' },
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            onClick={handleNextImage}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.9)',
              color: '#1976d2',
              '&:hover': { bgcolor: 'white' },
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </>
      )}

      {/* Indicateurs de pagination */}
      {photos.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
          }}
        >
          {photos.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor:
                  index === currentImageIndex
                    ? 'white'
                    : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': { bgcolor: 'white' },
              }}
            />
          ))}
        </Box>
      )}

      {/* Compteur d'images */}
      {photos.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: 'rgba(0,0,0,0.6)',
            color: 'white',
            px: 2,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.875rem',
            fontWeight: '500',
          }}
        >
          {currentImageIndex + 1} / {photos.length}
        </Box>
      )}
    </Box>
  );
};
