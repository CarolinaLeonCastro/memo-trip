import React, { useState } from 'react';
import { Dialog, DialogContent, IconButton, Box, Chip } from '@mui/material';
import {
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

interface PhotoGalleryProps {
  photos: string[];
  onClose: () => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') onClose();
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'rgba(0, 0, 0, 0.9)',
          boxShadow: 'none',
          maxHeight: '100vh',
          m: 0,
        },
      }}
      onKeyDown={handleKeyDown}
    >
      <DialogContent
        sx={{
          p: 0,
          position: 'relative',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
            zIndex: 10,
          }}
        >
          <CloseIcon />
        </IconButton>

        {photos.length > 1 && (
          <>
            <IconButton
              onClick={goToPrevious}
              sx={{
                position: 'absolute',
                left: 16,
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
                zIndex: 10,
              }}
            >
              <ChevronLeftIcon />
            </IconButton>

            <IconButton
              onClick={goToNext}
              sx={{
                position: 'absolute',
                right: 16,
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
                zIndex: 10,
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </>
        )}

        <Box
          component="img"
          src={photos[currentIndex]}
          alt={`Photo ${currentIndex + 1}`}
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />

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
                onClick={() => setCurrentIndex(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor:
                    index === currentIndex
                      ? 'white'
                      : 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
              />
            ))}
          </Box>
        )}

        {photos.length > 1 && (
          <Chip
            label={`${currentIndex + 1} / ${photos.length}`}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PhotoGallery;
