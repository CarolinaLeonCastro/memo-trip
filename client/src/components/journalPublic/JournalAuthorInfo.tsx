import React from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ px: 3, py: 4 }}>
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
                width: isMobile ? 48 : 64,
                height: isMobile ? 48 : 64,
                bgcolor: theme.palette.primary.main,
                fontSize: isMobile ? '1.2rem' : '1.5rem',
                border: `2px solid ${theme.palette.background.paper}`,
                boxShadow: theme.shadows[2],
              }}
              alt={user.name}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>
                {user.name}
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
