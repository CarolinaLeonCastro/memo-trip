import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Chip,
  Stack,
  Rating,
  Card,
  CardMedia,
  Grid,
  Modal,
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Photo as PhotoIcon,
  CalendarToday as DateIcon,
  CheckCircle as VisitedIcon,
  Schedule as PlannedIcon,
  StarRate as StarIcon,
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
} from '@mui/icons-material';
import type { PublicPlace } from '../public';

interface PublicPlaceModalProps {
  open: boolean;
  onClose: () => void;
  place: PublicPlace | null;
}

const PublicPlaceModal: React.FC<PublicPlaceModalProps> = ({
  open,
  onClose,
  place,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );

  if (!place) return null;

  const getImageUrl = (): string | undefined => {
    if (!place.coverImage) return undefined;

    if (typeof place.coverImage === 'string') {
      return place.coverImage;
    }

    if (
      place.coverImage &&
      typeof place.coverImage === 'object' &&
      place.coverImage.url
    ) {
      return place.coverImage.url;
    }
    return undefined;
  };

  const getLocationText = () => {
    if (place.city && place.country) {
      return `${place.city}, ${place.country}`;
    }
    if (place.city) return place.city;
    if (place.country) return place.country;
    return 'Lieu non précisé';
  };

  const getDateText = () => {
    if (place.visitPeriod) {
      const start = new Date(place.visitPeriod.start).toLocaleDateString(
        'fr-FR',
        {
          month: 'short',
          year: 'numeric',
        }
      );
      const end = new Date(place.visitPeriod.end).toLocaleDateString('fr-FR', {
        month: 'short',
        year: 'numeric',
      });
      return start === end ? start : `${start} - ${end}`;
    }
    if (place.dateVisited) {
      return new Date(place.dateVisited).toLocaleDateString('fr-FR', {
        month: 'short',
        year: 'numeric',
      });
    }
    return '';
  };

  const getStatusIcon = () => {
    return place.status === 'visited' ? (
      <VisitedIcon sx={{ fontSize: 20, color: 'success.main' }} />
    ) : (
      <PlannedIcon sx={{ fontSize: 20, color: 'warning.main' }} />
    );
  };

  const getStatusColor = () => {
    return place.status === 'visited' ? 'success' : 'warning';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
          zIndex: 9999,
        },
      }}
      sx={{
        zIndex: 9998,
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="600"
          sx={{ color: 'text.primary' }}
        >
          {place.name}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        {/* Status et localisation */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <Chip
              icon={getStatusIcon()}
              label={place.status === 'visited' ? 'Visité' : 'Planifié'}
              color={getStatusColor()}
              variant="filled"
              sx={{ fontWeight: 600 }}
            />

            {place.photosCount > 0 && (
              <Chip
                icon={<PhotoIcon sx={{ fontSize: 16 }} />}
                label={`${place.photosCount} photo${place.photosCount > 1 ? 's' : ''}`}
                variant="outlined"
                size="small"
              />
            )}
          </Stack>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationIcon
              sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }}
            />
            <Typography variant="body1" color="text.secondary">
              {getLocationText()}
            </Typography>
          </Box>

          {getDateText() && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DateIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {getDateText()}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Image de couverture */}
        {getImageUrl() && (
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardMedia
              component="img"
              height="300"
              image={getImageUrl()}
              alt={place.name}
              sx={{
                objectFit: 'cover',
                backgroundColor: 'grey.100',
              }}
            />
          </Card>
        )}

        {/* Galerie d'images supplémentaires */}
        {place.photos && place.photos.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              fontWeight="600"
              sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
            >
              <PhotoIcon sx={{ fontSize: 18, mr: 1 }} />
              Photos ({place.photos.length})
            </Typography>
            <Grid container spacing={2}>
              {place.photos
                .slice(0, 6)
                .map(
                  (photo: { url: string; caption?: string }, index: number) => (
                    <Grid key={index} size={{ xs: 4, sm: 3 }}>
                      <Card
                        sx={{
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: 2,
                          },
                        }}
                        onClick={() => setSelectedPhotoIndex(index)}
                      >
                        <CardMedia
                          component="img"
                          height="100"
                          image={photo.url}
                          alt={photo.caption || `Photo ${index + 1}`}
                          sx={{
                            objectFit: 'cover',
                            backgroundColor: 'grey.100',
                          }}
                        />
                      </Card>
                    </Grid>
                  )
                )}
              {place.photos.length > 6 && (
                <Grid size={{ xs: 4, sm: 3 }}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      cursor: 'pointer',
                      height: 100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                      },
                    }}
                    onClick={() => setSelectedPhotoIndex(6)}
                  >
                    <Typography variant="body2" fontWeight="600">
                      +{place.photos.length - 6}
                    </Typography>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Rating */}
        {place.rating && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <StarIcon sx={{ fontSize: 18, color: 'warning.main', mr: 1 }} />
              <Typography variant="subtitle2" fontWeight="600">
                Évaluation
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating
                value={place.rating}
                readOnly
                size="small"
                sx={{ mr: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {place.rating.toFixed(1)}/5
              </Typography>
            </Box>
          </Box>
        )}

        {/* Description */}
        {place.description && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
              Description
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.6,
                textAlign: 'justify',
              }}
            >
              {place.description}
            </Typography>
          </Box>
        )}

        {/* Tags */}
        {place.tags.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
              Tags
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{ flexWrap: 'wrap', gap: 1 }}
            >
              {place.tags.map((tag: string, index: number) => (
                <Chip
                  key={index}
                  label={tag}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Coordonnées (pour debug, peut être enlevé) */}
        {place.coordinates && place.coordinates.length === 2 && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Coordonnées : {place.coordinates[1]?.toFixed(4)},{' '}
              {place.coordinates[0]?.toFixed(4)}
            </Typography>
          </Box>
        )}
      </DialogContent>

      {/* Modal pour voir les photos en plein écran */}
      {selectedPhotoIndex !== null && place.photos && (
        <Modal
          open={selectedPhotoIndex !== null}
          onClose={() => setSelectedPhotoIndex(null)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setSelectedPhotoIndex(null)}
          >
            <Box
              sx={{
                position: 'relative',
                maxWidth: '90vw',
                maxHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  color: 'white',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
                onClick={() => setSelectedPhotoIndex(null)}
              >
                <CloseIcon />
              </IconButton>

              {selectedPhotoIndex > 0 && (
                <IconButton
                  sx={{
                    position: 'absolute',
                    left: 20,
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                  }}
                  onClick={() =>
                    setSelectedPhotoIndex(Math.max(0, selectedPhotoIndex - 1))
                  }
                >
                  <ArrowBackIcon />
                </IconButton>
              )}

              {selectedPhotoIndex < place.photos.length - 1 && (
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: 20,
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                  }}
                  onClick={() =>
                    setSelectedPhotoIndex(
                      Math.min(place.photos!.length - 1, selectedPhotoIndex + 1)
                    )
                  }
                >
                  <ArrowForwardIcon />
                </IconButton>
              )}

              <Box
                component="img"
                src={place.photos[selectedPhotoIndex].url}
                alt={
                  place.photos[selectedPhotoIndex].caption ||
                  `Photo ${selectedPhotoIndex + 1}`
                }
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: 2,
                }}
              />

              {place.photos[selectedPhotoIndex].caption && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: '80%',
                  }}
                >
                  <Typography variant="body2" textAlign="center">
                    {place.photos[selectedPhotoIndex].caption}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Modal>
      )}
    </Dialog>
  );
};

export default PublicPlaceModal;
