import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Stack,
  Rating,
  Button,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Photo as PhotoIcon,
  CalendarToday as DateIcon,
  CheckCircle as VisitedIcon,
  Schedule as PlannedIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import type { PublicPlace } from '../public/PublicPlaceCard';

interface PublicPlaceDetailCardProps {
  place: PublicPlace;
  onClick?: (place: PublicPlace) => void;
  showViewButton?: boolean;
}

const PublicPlaceDetailCard: React.FC<PublicPlaceDetailCardProps> = ({
  place,
  onClick,
  showViewButton = true,
}) => {
  const getImageUrl = () => {
    if (!place.coverImage) return '/api/placeholder/400/240';

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

    return '/api/placeholder/400/240';
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
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }
      );
      const end = new Date(place.visitPeriod.end).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      return start === end ? start : `${start} - ${end}`;
    }
    if (place.dateVisited) {
      return new Date(place.dateVisited).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
    return '';
  };

  const getDays = () => {
    if (place.visitPeriod) {
      const start = new Date(place.visitPeriod.start);
      const end = new Date(place.visitPeriod.end);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 1;
  };

  const getStatusIcon = () => {
    return place.status === 'visited' ? (
      <VisitedIcon sx={{ fontSize: 18, color: 'success.main' }} />
    ) : (
      <PlannedIcon sx={{ fontSize: 18, color: 'warning.main' }} />
    );
  };

  const getStatusColor = () => {
    return place.status === 'visited' ? 'success' : 'warning';
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': onClick
          ? {
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              transform: 'translateY(-2px)',
              borderColor: 'primary.main',
            }
          : {},
      }}
    >
      {/* Image */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="240"
          image={getImageUrl()}
          alt={place.name}
          sx={{
            objectFit: 'cover',
            backgroundColor: 'grey.100',
          }}
        />

        {/* Badge de statut */}
        <Chip
          icon={getStatusIcon()}
          label={place.status === 'visited' ? 'Visité' : 'À visiter'}
          size="small"
          color={getStatusColor()}
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            fontWeight: 600,
          }}
        />

        {/* Badge photos */}
        {place.photosCount > 0 && (
          <Chip
            icon={<PhotoIcon sx={{ fontSize: 14 }} />}
            label={place.photosCount}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              fontWeight: 600,
              '& .MuiChip-icon': {
                color: 'white',
              },
            }}
          />
        )}

        {/* Badge durée */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            backgroundColor: 'rgba(79, 134, 247, 0.9)',
            color: 'white',
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {getDays()} jour{getDays() > 1 ? 's' : ''}
        </Box>
      </Box>

      {/* Contenu */}
      <CardContent sx={{ p: 3 }}>
        {/* Titre et localisation */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            fontWeight="700"
            sx={{
              color: 'text.primary',
              mb: 0.5,
              lineHeight: 1.2,
            }}
          >
            {place.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationIcon
              sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }}
            />
            <Typography variant="body2" color="text.secondary">
              {getLocationText()}
            </Typography>
          </Box>
          {getDateText() && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DateIcon
                sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }}
              />
              <Typography variant="body2" color="text.secondary">
                {getDateText()}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Description */}
        {place.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
            }}
          >
            {place.description}
          </Typography>
        )}

        {/* Tags */}
        {place.tags.length > 0 && (
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}
          >
            {place.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.7rem',
                  height: 20,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                }}
              />
            ))}
            {place.tags.length > 3 && (
              <Chip
                label={`+${place.tags.length - 3}`}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.7rem',
                  height: 20,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                }}
              />
            )}
          </Stack>
        )}

        {/* Rating et bouton d'action */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Rating */}
          {place.rating && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating
                value={place.rating}
                size="small"
                readOnly
                sx={{ mr: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {place.rating.toFixed(1)}
              </Typography>
            </Box>
          )}

          {/* Bouton Voir */}
          {showViewButton && (
            <Button
              onClick={
                onClick
                  ? () => {
                      console.log(
                        '🔍 PublicPlaceDetailCard: Button clicked for place:',
                        place.name
                      );
                      onClick(place);
                    }
                  : undefined
              }
              variant="outlined"
              size="small"
              startIcon={<ViewIcon sx={{ fontSize: 16 }} />}
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  borderColor: 'primary.main',
                },
              }}
            >
              Voir
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PublicPlaceDetailCard;
