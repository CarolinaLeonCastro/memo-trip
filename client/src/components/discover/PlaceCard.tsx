import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Avatar,
  IconButton,
  Chip,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

interface PlaceCardProps {
  place: {
    _id: string;
    name: string;
    description: string;
    country: string;
    photos: Array<{ url: string }>;
    tags: string[];
    date_visited: string;
  };
  user: {
    _id: string;
    name: string;
    avatar?: { url: string };
  };
  likes: number;
  comments: number;
  views: number;
  isLiked: boolean;
  onLike: () => void;
}

const getImageUrl = (photos: Array<{ url: string }> | string) => {
  if (Array.isArray(photos) && photos.length > 0) {
    return photos[0].url;
  }
  if (typeof photos === 'string') {
    return photos;
  }
  return '/api/placeholder/400/250';
};

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  user,
  likes,
  comments,
  views,
  isLiked,
  onLike,
}) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        borderRadius: 1,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        backgroundColor: 'white',
        border: '1px solid #f0f0f0',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* Image */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="240"
          image={getImageUrl(place.photos)}
          alt={place.name}
          sx={{
            objectFit: 'cover',
            cursor: 'pointer',
          }}
          onClick={() => navigate(`/public/place/${place._id}`)}
        />

        {/* Heart overlay sur l'image */}
        <IconButton
          onClick={onLike}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            backgroundColor: 'rgba(255,255,255,0.95)',
            color: isLiked ? '#FF6B35' : '#9CA3AF',
            backdropFilter: 'blur(8px)',
            '&:hover': {
              backgroundColor: 'white',
              color: '#FF6B35',
            },
            width: 36,
            height: 36,
          }}
        >
          {isLiked ? (
            <FavoriteIcon sx={{ fontSize: 18 }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 18 }} />
          )}
        </IconButton>
      </Box>

      {/* Contenu */}
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          fontWeight="700"
          gutterBottom
          sx={{
            fontSize: '1.1rem',
            color: '#2E3A59',
            mb: 0.5,
          }}
        >
          {place.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.875rem',
            color: '#9CA3AF',
            mb: 2,
            fontWeight: '500',
          }}
        >
          {place.country}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: '0.875rem',
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2,
            color: '#6B7280',
          }}
        >
          {place.description}
        </Typography>

        {/* Tags */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {place.tags.slice(0, 3).map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{
                fontSize: '0.7rem',
                height: 20,
                bgcolor: '#F1F5F9',
                color: '#4F86F7',
                borderRadius: 1,
                '& .MuiChip-label': { px: 1 },
              }}
            />
          ))}
        </Box>

        {/* Footer avec utilisateur et stats */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pt: 2,
            borderTop: '1px solid #F1F5F9',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={user.avatar?.url}
              sx={{
                width: 32,
                height: 32,
                mr: 1.5,
                bgcolor: '#4F86F7',
                fontSize: '0.8rem',
              }}
            >
              {user.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography
                variant="body2"
                fontWeight="600"
                sx={{ fontSize: '0.875rem', color: '#2E3A59' }}
              >
                {user.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: '0.75rem', color: '#9CA3AF' }}
              >
                {new Date(place.date_visited).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                })}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FavoriteIcon sx={{ fontSize: 16, color: '#FF6B35' }} />
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.8rem',
                  color: '#6B7280',
                  fontWeight: '500',
                }}
              >
                {likes}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CommentIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.8rem',
                  color: '#6B7280',
                  fontWeight: '500',
                }}
              >
                {comments}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <VisibilityIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.8rem',
                  color: '#6B7280',
                  fontWeight: '500',
                }}
              >
                {views}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
