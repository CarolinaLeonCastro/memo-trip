import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useNavigate } from 'react-router-dom';

interface JournalCardProps {
  journal: {
    _id: string;
    title: string;
    description: string;
    cover_image: string;
    tags: string[];
    places_count: number;
    start_date?: string;
    end_date?: string;
  };
  user: {
    _id: string;
    name: string;
    avatar?: { url: string };
  };
  likes: number;
  views: number;
  isLiked: boolean;
  onLike: () => void;
  currentUserId?: string;
}

const getImageUrl = (image: string) => {
  if (typeof image === 'string') {
    return image;
  }
  return '/api/placeholder/400/250';
};

export const JournalCard: React.FC<JournalCardProps> = ({
  journal,
  user,
  likes,
  views,
  currentUserId,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Configuration responsive [8][11]
  const getCardLayout = () => {
    if (isMobile) {
      return {
        flexDirection: 'column' as const,
        height: 'auto',
        imageWidth: '100%',
        imageHeight: 200,
        padding: 2,
      };
    }
    if (isTablet) {
      return {
        flexDirection: 'row' as const,
        height: 160,
        imageWidth: 200,
        imageHeight: 160,
        padding: 2,
      };
    }
    return {
      flexDirection: 'row' as const,
      height: 250,
      imageWidth: 240,
      imageHeight: 180,
      padding: 3,
    };
  };

  const layout = getCardLayout();

  return (
    <Card
      sx={{
        borderRadius: 1,
        overflow: 'hidden',
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 4px 20px rgba(0,0,0,0.3)'
            : '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: layout.flexDirection,
        height: layout.height,
        cursor: 'pointer',
        '&:hover': {
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0,0,0,0.4)'
              : '0 8px 32px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)',
          '& .card-image': {
            transform: 'scale(1.02)',
          },
        },
      }}
    >
      {/* Image */}
      <Box
        sx={{
          position: 'relative',
          width: isMobile ? '100%' : layout.imageWidth,
          height: layout.imageHeight,
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <CardMedia
          component="img"
          height="100%"
          image={getImageUrl(journal.cover_image)}
          alt={journal.title}
          className="card-image"
          sx={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            transition: 'transform 0.3s ease',
          }}
          onClick={() => navigate(`/public/journals/${journal._id}`)}
        />
      </Box>

      {/* Contenu */}
      <CardContent
        sx={{
          p: layout.padding,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 0, // Fix pour flexbox
        }}
      >
        <Box sx={{ flex: 1 }}>
          {/* Header avec titre et avatar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              mb: 1.5,
              gap: 2,
            }}
          >
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              fontWeight="700"
              sx={{
                fontSize: isMobile ? '1rem' : '1.1rem',
                color: theme.palette.text.primary,
                lineHeight: 1.3,
                flex: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {journal.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ textAlign: 'right', minWidth: 0 }}>
                <Typography
                  variant="body2"
                  fontWeight="600"
                  sx={{
                    fontSize: '0.8rem',
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {currentUserId === user._id ? 'Moi' : user.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.7rem',
                    color: theme.palette.text.secondary,
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {journal.start_date && journal.end_date
                    ? `${Math.ceil(
                        (new Date(journal.end_date).getTime() -
                          new Date(journal.start_date).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )} jours`
                    : journal.start_date
                      ? `${Math.ceil(
                          (new Date().getTime() -
                            new Date(journal.start_date).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )} jours`
                      : 'Nouveau'}
                </Typography>
              </Box>
              <Avatar
                src={user.avatar?.url}
                sx={{
                  width: isMobile ? 28 : 32,
                  height: isMobile ? 28 : 32,
                  bgcolor: theme.palette.primary.main,
                  fontSize: '0.8rem',
                  border: `2px solid ${theme.palette.background.paper}`,
                  boxShadow: theme.shadows[2],
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
            </Box>
          </Box>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.875rem',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: isMobile ? 3 : 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 2,
              color: theme.palette.text.secondary,
            }}
          >
            {journal.description}
          </Typography>

          {/* Tags */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {journal.tags.slice(0, isMobile ? 2 : 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  height: 20,
                  bgcolor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(79, 134, 247, 0.15)'
                      : '#F1F5F9',
                  color: theme.palette.primary.main,
                  borderRadius: 1.5,
                  '& .MuiChip-label': { px: 1 },
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(79, 134, 247, 0.25)'
                        : '#E2E8F0',
                  },
                }}
              />
            ))}
          </Box>

          {/* Nombre de lieux */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <MenuBookIcon
              sx={{
                fontSize: 16,
                color: theme.palette.text.secondary,
                mr: 0.5,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.8rem',
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              {journal.places_count} lieu{journal.places_count > 1 ? 'x' : ''}
            </Typography>
          </Box>
        </Box>

        {/* Footer avec stats */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: isMobile ? 1 : 1.5,
            pt: 1,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
            <FavoriteIcon sx={{ fontSize: 16, color: '#FF6B3C' }} />
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.75rem',
                color: theme.palette.text.secondary,
                fontWeight: '600',
              }}
            >
              {likes}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
            <VisibilityIcon
              sx={{ fontSize: 16, color: theme.palette.text.secondary }}
            />
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.75rem',
                color: theme.palette.text.secondary,
                fontWeight: '600',
              }}
            >
              {views}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
