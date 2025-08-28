import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface VisitedPlace {
  _id: string;
  name: string;
  country: string;
  days: number;
  photos: Array<{ url: string }>;
}

interface VisitedPlaceCardProps {
  place: VisitedPlace;
}

export const VisitedPlaceCard: React.FC<VisitedPlaceCardProps> = ({
  place,
}) => {
  const getDescription = (name: string) => {
    const descriptions: { [key: string]: string } = {
      Rome: '"Ancient amphitheatre in the centre of Rome"',
      Florence: '"Renaissance art and stunning architecture"',
      Santorini: '"Beautiful Greek island with stunning sunsets"',
      Paris: '"Iconic iron lattice tower and symbol of Paris"',
      Amsterdam: '"Historic canals and charming architecture"',
      Prague: '"Medieval city with fairytale atmosphere"',
      Vienna: '"Imperial elegance and classical music heritage"',
      Budapest: '"Dramatic setting along the Danube River"',
    };
    return descriptions[name] || '"A beautiful destination to explore"';
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0',
        position: 'relative',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          transform: 'translateY(-4px)',
        },
        transition: 'all 0.3s ease',
      }}
    >
      {/* Image avec badge "Visité" */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={place.photos[0]?.url}
          alt={place.name}
          sx={{ objectFit: 'cover' }}
        />

        {/* Badge "Visité" */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: '#22C55E',
            color: 'white',
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            fontSize: '0.75rem',
            fontWeight: '600',
            boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
          }}
        >
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              bgcolor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#22C55E',
              fontSize: '10px',
              fontWeight: 'bold',
            }}
          >
            ✓
          </Box>
          Visité
        </Box>

        {/* Icône oeil pour voir plus */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'rgba(255,255,255,0.9)',
            color: '#6B7280',
            width: 32,
            height: 32,
            '&:hover': {
              bgcolor: 'white',
              color: '#4F86F7',
            },
          }}
        >
          <VisibilityIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {/* Contenu */}
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          fontWeight="700"
          sx={{
            color: '#1F2937',
            mb: 0.5,
            fontSize: '1.1rem',
          }}
        >
          {place.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationOnIcon sx={{ fontSize: 16, color: '#9CA3AF', mr: 0.5 }} />
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '0.9rem' }}
          >
            {place.country}
          </Typography>
        </Box>

        {/* Description courte basée sur le lieu */}
        <Typography
          variant="body2"
          sx={{
            color: '#6B7280',
            mb: 2,
            fontSize: '0.85rem',
            fontStyle: 'italic',
            lineHeight: 1.4,
          }}
        >
          {getDescription(place.name)}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              bgcolor: '#F1F5F9',
              color: '#4F86F7',
              fontWeight: '600',
              fontSize: '0.75rem',
              height: 24,
              px: 1.5,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {place.days} jour{place.days > 1 ? 's' : ''}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
