import React from 'react';
import { Box, Container, Typography, IconButton, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import { useNavigate } from 'react-router-dom';

interface JournalHeaderProps {
  title: string;
  subtitle: string;
  coverImage: string;
  tags: string[];
  isLiked: boolean;
  onLike: () => void;
}

export const JournalHeader: React.FC<JournalHeaderProps> = ({
  title,
  subtitle,
  coverImage,
  tags,
  isLiked,
  onLike,
}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: '60vh',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${coverImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        position: 'relative',
      }}
    >
      {/* Boutons d'action en haut à droite */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          display: 'flex',
          gap: 1,
        }}
      >
        <IconButton
          onClick={onLike}
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            color: isLiked ? '#FF6B35' : 'white',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.3)',
            },
          }}
        >
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <IconButton
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.3)',
            },
          }}
        >
          <ShareIcon />
        </IconButton>
      </Box>

      {/* Bouton retour en haut à gauche */}
      <IconButton
        onClick={() => navigate(-1)}
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          bgcolor: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.3)',
          },
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Tags hashtag */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 150,
          left: 40,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={`#${tag}`}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
              },
            }}
          />
        ))}
      </Box>

      {/* Titre et sous-titre */}
      <Container maxWidth="xl" sx={{ pb: 6 }}>
        <Typography
          variant="h2"
          fontWeight="800"
          sx={{
            color: 'white',
            mb: 2,
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            fontSize: { xs: '2rem', md: '3rem' },
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: 'rgba(255,255,255,0.9)',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            fontSize: { xs: '1.2rem', md: '1.5rem' },
          }}
        >
          {subtitle}
        </Typography>
      </Container>
    </Box>
  );
};
