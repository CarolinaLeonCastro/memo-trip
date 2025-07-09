import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { Image } from '@mui/icons-material';

interface PlaceCardProps {
  title: string;
  location: string;
  images: string[];
  onClick: () => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  title,
  location,
  images,
  onClick,
}) => {
  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
      onClick={onClick}
    >
      <CardContent>
        <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {location}
        </Typography>

        {/* Grid d'images */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {images.slice(0, 3).map((image, index) => (
            <Box
              key={index}
              sx={{
                flex: 1,
                height: 80,
                backgroundColor: 'background.secondary',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
              }}
            >
              {image ? (
                <CardMedia
                  component="img"
                  height="100%"
                  width="100%"
                  image={image}
                  alt={`${title} ${index + 1}`}
                  sx={{ objectFit: 'cover' }}
                />
              ) : (
                <Image sx={{ color: 'text.disabled', fontSize: 24 }} />
              )}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PlaceCard;
