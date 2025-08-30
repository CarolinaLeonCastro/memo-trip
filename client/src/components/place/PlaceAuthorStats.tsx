import React from 'react';
import { Container, Typography, Box, Avatar } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface PlaceAuthorStatsProps {
  user: {
    name: string;
    avatar?: { url: string };
  };
  dateVisited: string;
  likes: number;
  comments: number;
  views: number;
  isLiked: boolean;
  onLike: () => void;
}

export const PlaceAuthorStats: React.FC<PlaceAuthorStatsProps> = ({
  user,
  dateVisited,
  likes,
  comments,
  views,
  isLiked,
  onLike,
}) => {
  return (
    <Box sx={{ bgcolor: 'white', px: 3, py: 3 }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={user.avatar?.url}
              sx={{
                width: 48,
                height: 48,
                bgcolor: '#4F86F7',
                fontSize: '1.1rem',
                fontWeight: '600',
              }}
            >
              {user.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                fontWeight="600"
                sx={{ color: '#1F2937', fontSize: '1.1rem' }}
              >
                {user.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#9CA3AF', fontSize: '0.9rem' }}
              >
                Publié le{' '}
                {new Date(dateVisited).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                p: 1,
                borderRadius: 1,
                '&:hover': { bgcolor: 'rgba(255, 107, 53, 0.04)' },
                transition: 'all 0.2s ease',
              }}
              onClick={onLike}
            >
              {isLiked ? (
                <FavoriteIcon sx={{ fontSize: 18, color: '#FF6B35' }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
              )}
              <Typography
                variant="body2"
                fontWeight="600"
                sx={{
                  color: isLiked ? '#FF6B35' : '#6B7280',
                  fontSize: '0.9rem',
                }}
              >
                {likes}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CommentIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
              <Typography
                variant="body2"
                fontWeight="600"
                sx={{ color: '#6B7280', fontSize: '0.9rem' }}
              >
                {comments}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <VisibilityIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
              <Typography
                variant="body2"
                fontWeight="600"
                sx={{ color: '#6B7280', fontSize: '0.9rem' }}
              >
                {views}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
