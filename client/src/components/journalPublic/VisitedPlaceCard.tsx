import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Rating,
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarIcon,
  Euro as EuroIcon,
} from '@mui/icons-material';

interface VisitedPlace {
  _id: string;
  name: string;
  location?: {
    city?: string;
    country?: string;
  };
  description?: string;
  photos?: Array<{ url: string }>;
  rating?: number;
  budget?: number;
  start_date?: string;
  end_date?: string;
  date_visited?: string;
  tags?: string[];
}

interface VisitedPlaceCardProps {
  place: VisitedPlace;
  onClick?: (place: VisitedPlace) => void;
}

export const VisitedPlaceCard: React.FC<VisitedPlaceCardProps> = ({
  place,
  onClick,
}) => {
  const mainPhoto =
    place.photos?.[0]?.url ||
    'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&q=80&w=400';

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getDateRange = () => {
    if (place.date_visited) {
      return formatDate(place.date_visited);
    }
    if (place.start_date && place.end_date) {
      const startFormatted = formatDate(place.start_date);
      const endFormatted = formatDate(place.end_date);
      return startFormatted === endFormatted
        ? startFormatted
        : `${startFormatted} - ${endFormatted}`;
    }
    return '';
  };

  return (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        '&:hover': onClick
          ? {
              transform: 'translateY(-2px)',
              boxShadow: 4,
            }
          : {},
      }}
      onClick={() => onClick?.(place)}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={mainPhoto}
          alt={place.name}
        />

        {/* Badge de date */}
        {getDateRange() && (
          <Chip
            icon={<CalendarIcon sx={{ fontSize: '0.9rem' }} />}
            label={getDateRange()}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              fontWeight: 600,
            }}
          />
        )}
      </Box>

      <CardContent sx={{ p: 2 }}>
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ mb: 1, fontSize: '1.1rem' }}
          noWrap
        >
          {place.name}
        </Typography>

        {/* Localisation */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <LocationOnIcon sx={{ fontSize: '1rem', color: 'error.main' }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {place.location?.city && place.location?.country
              ? `${place.location.city}, ${place.location.country}`
              : place.location?.country || 'Localisation non définie'}
          </Typography>
        </Box>

        {/* Description */}
        {place.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
            }}
          >
            {place.description}
          </Typography>
        )}

        {/* Rating et Budget */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          {place.rating && place.rating > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Rating
                value={place.rating}
                readOnly
                size="small"
                precision={0.5}
              />
              <Typography variant="caption" color="text.secondary">
                ({place.rating}/5)
              </Typography>
            </Box>
          )}

          {place.budget && place.budget > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <EuroIcon sx={{ fontSize: '0.9rem', color: 'success.main' }} />
              <Typography variant="body2" fontWeight={600} color="success.main">
                {place.budget}€
              </Typography>
            </Box>
          )}
        </Box>

        {/* Tags */}
        {place.tags && place.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {place.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  height: 20,
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                }}
              />
            ))}
            {place.tags.length > 3 && (
              <Chip
                label={`+${place.tags.length - 3}`}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  height: 20,
                  bgcolor: 'grey.300',
                  color: 'text.secondary',
                }}
              />
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
