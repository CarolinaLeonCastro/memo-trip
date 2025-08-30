import React from 'react';
import { Container, Typography, Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

interface PlaceHeaderProps {
  name: string;
  city: string;
  country: string;
  description: string;
}

export const PlaceHeader: React.FC<PlaceHeaderProps> = ({
  name,
  city,
  country,
  description,
}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{ bgcolor: 'white', px: 3, py: 4, borderBottom: '1px solid #f0f0f0' }}
    >
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              mr: 2,
              bgcolor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': { bgcolor: 'white' },
            }}
          >
            <ArrowBackIcon sx={{ color: '#1976d2' }} />
          </IconButton>
          <Box>
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{ color: '#1976d2', mb: 0.5 }}
            >
              {name}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {city}, {country}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="body1"
          sx={{
            color: '#6B7280',
            lineHeight: 1.6,
            fontSize: '1.1rem',
            maxWidth: '800px',
          }}
        >
          {description}
        </Typography>
      </Container>
    </Box>
  );
};
