import React from 'react';
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
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Photo as PhotoIcon,
  CalendarToday as DateIcon,
  CheckCircle as VisitedIcon,
  Schedule as PlannedIcon,
  StarRate as StarIcon,
} from '@mui/icons-material';
import type { PublicPlace } from './PublicPlaceCard';

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
  if (!place) return null;

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
        },
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
        {place.coverImage && (
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardMedia
              component="img"
              height="300"
              image={place.coverImage}
              alt={place.name}
              sx={{
                objectFit: 'cover',
                backgroundColor: 'grey.100',
              }}
            />
          </Card>
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
              Catégories
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{ flexWrap: 'wrap', gap: 1 }}
            >
              {place.tags.map((tag, index) => (
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
    </Dialog>
  );
};

export default PublicPlaceModal;
