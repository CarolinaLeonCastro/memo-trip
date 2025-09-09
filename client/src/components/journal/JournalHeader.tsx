import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { formatWithOptions } from 'date-fns/fp';
import { fr } from 'date-fns/locale';

interface JournalHeaderProps {
  journal: {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
  };
}

export const JournalHeader: React.FC<JournalHeaderProps> = ({ journal }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Header avec navigation */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Button
          onClick={() => navigate('/journals')}
          startIcon={<ArrowBackIcon />}
          sx={{ color: 'text.secondary' }}
        >
          Retour aux journaux
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={() => navigate(`/journals/${journal.id}/edit`)}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            <ShareIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Titre et métadonnées */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          {journal.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              {formatWithOptions(
                { locale: fr },
                'dd MMM yyyy'
              )(journal.startDate)}{' '}
              -{' '}
              {formatWithOptions(
                { locale: fr },
                'dd MMM yyyy'
              )(journal.endDate)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};
