import React from 'react';
import { Box, Container, Typography, Avatar } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface JournalAuthorInfoProps {
  user: {
    name: string;
    location: string;
    bio: string;
    avatar?: { url: string };
  };
  publishedDate: string;
}

export const JournalAuthorInfo: React.FC<JournalAuthorInfoProps> = ({
  user,
  publishedDate,
}) => {
  return (
    <Box sx={{ bgcolor: 'white', px: 3, py: 4 }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              src={user.avatar?.url}
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#4F86F7',
                fontSize: '2rem',
                fontWeight: '600',
              }}
            >
              {user.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                fontWeight="700"
                sx={{ color: '#1F2937', mb: 1 }}
              >
                {user.name}
              </Typography>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
              >
                <LocationOnIcon sx={{ fontSize: 16, color: '#6B7280' }} />
                <Typography variant="body1" sx={{ color: '#6B7280' }}>
                  {user.location}
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{ color: '#6B7280', maxWidth: 500, lineHeight: 1.6 }}
              >
                {user.bio}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography
              variant="body2"
              sx={{ color: '#9CA3AF', fontSize: '0.9rem' }}
            >
              Publié le
            </Typography>
            <Typography variant="h6" fontWeight="600" sx={{ color: '#1F2937' }}>
              {new Date(publishedDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
