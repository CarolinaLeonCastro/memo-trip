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
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Photo as PhotoIcon,
  CalendarToday as DateIcon,
  CheckCircle as VisitedIcon,
  Schedule as PlannedIcon,
} from '@mui/icons-material';
// import { format } from 'date-fns';
// import { fr } from 'date-fns/locale';

export interface PublicPlace {
  _id: string;
  name: string;
  city: string;
  country: string;
  description?: string;
  coverImage?:
    | {
        url: string;
        uploadedAt?: string;
        _id?: string;
      }
    | string
    | null;
  photos?: Array<{
    url: string;
    caption?: string;
  }>;
  photosCount: number;
  rating?: number;
  budget?: number;
  dateVisited?: string;
  visitPeriod?: {
    start: string;
    end: string;
  } | null;
  tags: string[];
  status: 'visited' | 'planned';
  coordinates?: number[];
}

interface PublicPlaceCardProps {
  place: PublicPlace;
  onClick?: (place: PublicPlace) => void;
  showStatus?: boolean;
  compact?: boolean;
}

const PublicPlaceCard: React.FC<PublicPlaceCardProps> = ({
  place,
  onClick,
  showStatus = true,
  compact = false,
}) => {
  const getImageUrl = () => {
    if (!place.coverImage) return '/api/placeholder/300/160';

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

    return '/api/placeholder/300/160';
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
      <VisitedIcon sx={{ fontSize: 16, color: 'success.main' }} />
    ) : (
      <PlannedIcon sx={{ fontSize: 16, color: 'warning.main' }} />
    );
  };

  const getStatusColor = () => {
    return place.status === 'visited' ? 'success' : 'warning';
  };

  const cardHeight = compact ? 200 : 280;
  const imageHeight = compact ? 120 : 160;

  return (
    <Card
      onClick={onClick ? () => onClick(place) : undefined}
      sx={{
        height: cardHeight,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': onClick
          ? {
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              transform: 'translateY(-2px)',
              borderColor: 'primary.main',
            }
          : {},
      }}
    >
      {/* Image */}
      <Box sx={{ position: 'relative', height: imageHeight }}>
        <CardMedia
          component="img"
          height={imageHeight}
          image={getImageUrl()}
          alt={place.name}
          sx={{
            objectFit: 'cover',
            backgroundColor: 'grey.100',
          }}
        />

        {/* Badge de statut */}
        {showStatus && (
          <Chip
            icon={getStatusIcon()}
            label={place.status === 'visited' ? 'Visité' : 'Planifié'}
            size="small"
            color={getStatusColor()}
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(4px)',
              fontWeight: 600,
            }}
          />
        )}

        {/* Badge photos */}
        {place.photosCount > 0 && (
          <Chip
            icon={<PhotoIcon sx={{ fontSize: 14 }} />}
            label={place.photosCount}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              fontWeight: 600,
              '& .MuiChip-icon': {
                color: 'white',
              },
            }}
          />
        )}
      </Box>

      {/* Contenu */}
      <CardContent
        sx={{
          flex: 1,
          p: compact ? 1.5 : 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          {/* Titre */}
          <Typography
            variant={compact ? 'subtitle2' : 'subtitle1'}
            fontWeight="600"
            sx={{
              color: 'text.primary',
              mb: 0.5,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.2,
            }}
          >
            {place.name}
          </Typography>

          {/* Localisation */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <LocationIcon
              sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {getLocationText()}
            </Typography>
          </Box>

          {/* Description */}
          {place.description && !compact && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.3,
                fontSize: '0.875rem',
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
              sx={{ mb: 1, flexWrap: 'wrap', gap: 0.5 }}
            >
              {place.tags.slice(0, compact ? 2 : 3).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '0.7rem',
                    height: 20,
                    borderColor: 'divider',
                    color: 'text.secondary',
                  }}
                />
              ))}
              {place.tags.length > (compact ? 2 : 3) && (
                <Chip
                  label={`+${place.tags.length - (compact ? 2 : 3)}`}
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
        </Box>

        {/* Footer */}
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
                sx={{ fontSize: compact ? '0.875rem' : '1rem' }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 0.5, fontWeight: 500 }}
              >
                {place.rating.toFixed(1)}
              </Typography>
            </Box>
          )}

          {/* Date */}
          {getDateText() && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DateIcon
                sx={{ fontSize: 12, color: 'text.secondary', mr: 0.5 }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {getDateText()}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PublicPlaceCard;
