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
        display: 'flex',
        height: '180px',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Image à gauche */}
      <Box sx={{ position: 'relative', width: 240, flexShrink: 0 }}>
        <CardMedia
          component="img"
          height="100%"
          image={getImageUrl(journal.cover_image)}
          alt={journal.title}
          sx={{
            objectFit: 'cover',
            cursor: 'pointer',
            width: '100%',
            height: '100%',
          }}
          onClick={() => navigate(`/public/journals/${journal._id}`)}
        />

        {/* Heart overlay sur l'image */}
        <IconButton
          onClick={onLike}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: 'rgba(255,255,255,0.95)',
            color: isLiked ? '#FF6B35' : '#9CA3AF',
            backdropFilter: 'blur(8px)',
            '&:hover': {
              backgroundColor: 'white',
              color: '#FF6B35',
            },
            width: 32,
            height: 32,
          }}
        >
          {isLiked ? (
            <FavoriteIcon sx={{ fontSize: 16 }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 16 }} />
          )}
        </IconButton>
      </Box>

      {/* Contenu à droite */}
      <CardContent
        sx={{
          p: 3,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight="700"
            sx={{
              fontSize: '1.1rem',
              color: '#2E3A59',
              mb: 1,
              lineHeight: 1.3,
            }}
          >
            {journal.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: '0.875rem',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 2,
              color: '#6B7280',
            }}
          >
            {journal.description}
          </Typography>

          {/* Tags */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {journal.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  height: 18,
                  bgcolor: '#F1F5F9',
                  color: '#4F86F7',
                  borderRadius: 1,
                  '& .MuiChip-label': { px: 0.8 },
                }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <MenuBookIcon sx={{ fontSize: 14, color: '#9CA3AF', mr: 0.5 }} />
            <Typography
              variant="body2"
              sx={{ fontSize: '0.8rem', color: '#9CA3AF' }}
            >
              {journal.places_count} lieux
            </Typography>
          </Box>
        </Box>

        {/* Footer avec info utilisateur et stats */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={user.avatar?.url}
              sx={{
                width: 28,
                height: 28,
                mr: 1,
                bgcolor: '#4F86F7',
                fontSize: '0.75rem',
              }}
            >
              {user.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography
                variant="body2"
                fontWeight="600"
                sx={{ fontSize: '0.8rem', color: '#2E3A59' }}
              >
                {user.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: '0.7rem', color: '#9CA3AF' }}
              >
                1 semaine
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <FavoriteIcon sx={{ fontSize: 14, color: '#FF6B35' }} />
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  fontWeight: '500',
                }}
              >
                {likes}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <CommentIcon sx={{ fontSize: 14, color: '#9CA3AF' }} />
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  fontWeight: '500',
                }}
              >
                {comments}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <VisibilityIcon sx={{ fontSize: 14, color: '#9CA3AF' }} />
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.75rem',
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
