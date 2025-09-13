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
  useTheme,
  useMediaQuery,
  Fade,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Photo as PhotoIcon,
  CalendarToday as DateIcon,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Hauteurs fixes responsives pour garantir l'uniformité
  const cardHeight = {
    xs: 520, // Mobile
    sm: 580, // Tablet
    md: 500, // Desktop
  };

  const imageHeight = {
    xs: 200, // Mobile
    sm: 240, // Tablet
    md: 200, // Desktop
  };

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

  return (
    <Fade in timeout={600}>
      <Card
        sx={{
          // Hauteur fixe responsive pour uniformité
          height: cardHeight,
          borderRadius: 1,
          overflow: 'hidden',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0,0,0,0.3)'
              : '0 8px 32px rgba(0,0,0,0.08)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: onClick ? 'pointer' : 'default',
          border: `1px solid ${theme.palette.divider}`,
          position: 'relative',
          background: theme.palette.background.paper,
          display: 'flex', // Flexbox pour contrôler la structure
          flexDirection: 'column', // Direction verticale
          '&:hover': onClick
            ? {
                boxShadow:
                  theme.palette.mode === 'dark'
                    ? '0 20px 60px rgba(0,0,0,0.4)'
                    : '0 20px 60px rgba(0,0,0,0.15)',
                transform: 'translateY(-8px)',
                '& .place-image': {
                  transform: 'scale(1.05)',
                },
                '& .place-overlay': {
                  opacity: 1,
                },
              }
            : {},
        }}
      >
        {/* Image avec hauteur fixe */}
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0, // Empêche la compression
          }}
        >
          <CardMedia
            component="img"
            image={getImageUrl()}
            alt={place.name}
            className="place-image"
            sx={{
              height: {
                xs: imageHeight.xs,
                sm: imageHeight.sm,
                md: imageHeight.md,
              },
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
          />

          {/* Overlay gradient */}
          <Box
            className="place-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            }}
          />

          {/* Badge photos */}
          {place.photosCount > 0 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                bgcolor: 'rgba(0,0,0,0.7)',
                color: 'white',
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                backdropFilter: 'blur(8px)',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              <PhotoIcon sx={{ fontSize: 14 }} />
              <Typography
                variant="caption"
                sx={{ color: 'white', fontWeight: 600 }}
              >
                {place.photosCount}
              </Typography>
            </Box>
          )}

          {/* Badge durée */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              bgcolor: theme.palette.primary.main,
              color: 'white',
              px: 2,
              py: 0.75,
              borderRadius: 2,
              fontSize: '0.8rem',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(79, 134, 247, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <DateIcon sx={{ fontSize: 16 }} />
            {getDays()} jour{getDays() > 1 ? 's' : ''}
          </Box>
        </Box>

        {/* Contenu avec flex-grow pour remplir l'espace restant */}
        <CardContent
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
            display: 'flex',
            flexDirection: 'column',
            flex: 1, // Prend tout l'espace restant
            minHeight: 0, // Important pour que le contenu puisse se comprimer
          }}
        >
          {/* Header avec titre et rating */}
          <Box sx={{ mb: 1.5, flexShrink: 0 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 1,
                gap: 1,
              }}
            >
              <Typography
                variant="h6"
                fontWeight="700"
                sx={{
                  color: theme.palette.text.primary,
                  lineHeight: 1.2,
                  fontSize: { xs: '0.95rem', sm: '1rem', md: '1.125rem' },
                  flex: 1,
                  // Limiter à 2 lignes maximum
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {place.name}
              </Typography>
              {place.rating && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    flexShrink: 0,
                  }}
                >
                  <Rating
                    value={place.rating}
                    size="small"
                    readOnly
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: '#FFB400',
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  >
                    {place.rating.toFixed(1)}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Localisation */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mb: 0.5,
                flexShrink: 0,
              }}
            >
              <LocationIcon
                sx={{
                  fontSize: 16,
                  color: theme.palette.primary.main,
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {getLocationText()}
              </Typography>
            </Box>

            {/* Date */}
            {getDateText() && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  flexShrink: 0,
                }}
              >
                <DateIcon
                  sx={{
                    fontSize: 16,
                    color: theme.palette.text.secondary,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                    fontSize: '0.85rem',
                  }}
                >
                  {getDateText()}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Description - zone flexible */}
          {place.description && (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                mb: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: { xs: 2, sm: 3, md: 3 }, // Responsive line clamp
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.5,
                fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                flex: 1, // Prend l'espace disponible
                minHeight: 0,
              }}
            >
              {place.description.length > 50
                ? `${place.description.substring(0, 50)}...`
                : place.description}
            </Typography>
          )}

          {/* Tags - zone flexible */}
          {place.tags.length > 0 && (
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                mb: 1.5,
                flexWrap: 'wrap',
                gap: 0.5,
                flexShrink: 0,
              }}
            >
              {place.tags.slice(0, isMobile ? 2 : 3).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    height: 22,
                    bgcolor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(79, 134, 247, 0.15)'
                        : 'rgba(79, 134, 247, 0.08)',
                    color: theme.palette.primary.main,
                    border: `1px solid ${theme.palette.primary.main}20`,
                    fontWeight: 600,
                    borderRadius: 1.5,
                  }}
                />
              ))}
              {place.tags.length > (isMobile ? 2 : 3) && (
                <Chip
                  label={`+${place.tags.length - (isMobile ? 2 : 3)}`}
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    height: 22,
                    color: theme.palette.text.secondary,
                    fontWeight: 600,
                    borderRadius: 1.5,
                  }}
                />
              )}
            </Stack>
          )}

          {/* Bouton d'action - toujours en bas */}
          {showViewButton && (
            <Box sx={{ mt: 'auto', flexShrink: 0 }}>
              <Button
                onClick={
                  onClick
                    ? (e) => {
                        e.stopPropagation();
                        onClick(place);
                      }
                    : undefined
                }
                variant="contained"
                fullWidth
                startIcon={<ViewIcon sx={{ fontSize: 16 }} />}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  py: { xs: 1, sm: 1.25 },
                  borderRadius: 2.5,
                  fontWeight: 700,
                  fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                  textTransform: 'none',
                  boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                    boxShadow: `0 6px 20px ${theme.palette.primary.main}40`,
                    transform: 'translateY(-1px)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
              >
                Découvrir ce lieu
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Fade>
  );
};

export default PublicPlaceDetailCard;
