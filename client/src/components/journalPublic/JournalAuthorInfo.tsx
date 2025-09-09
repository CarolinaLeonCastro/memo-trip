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
              sx={{ width: 64, height: 64 }}
              alt={user.name}
            />
            <Box>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>
                {user.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOnIcon
                  sx={{ fontSize: 16, color: 'text.secondary' }}
                />
                <Typography variant="body2" color="text.secondary">
                  {user.location}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, maxWidth: '400px' }}
              >
                {user.bio}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">
              Publié le
            </Typography>
            <Typography variant="body2" fontWeight="600">
              {new Date(publishedDate).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
