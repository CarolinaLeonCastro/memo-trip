import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  Chip,
  useTheme,
  useMediaQuery,
  Grid,
} from '@mui/material';
import {
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface PlaceWithJournal {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  dateVisited: string;
  photos: string[];
  category?: string;
  isVisited: boolean;
  journalTitle: string;
  journalId: string;
}

interface PlaceDetailModalProps {
  open: boolean;
  place: PlaceWithJournal | null;
  onClose: () => void;
}

const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  open,
  place,
  onClose,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!place) return null;

  const handleViewDetails = () => {
    navigate(`/place/${place.id}`);
    onClose();
  };

  // Styles pour le scroll personnalisé
  const scrollStyles = {
    '& ::-webkit-scrollbar': {
      width: '6px',
    },
    '& ::-webkit-scrollbar-track': {
      backgroundColor: theme.palette.mode === 'dark' ? '#2b2b2b' : '#f1f1f1',
      borderRadius: '3px',
    },
    '& ::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#c1c1c1',
      borderRadius: '3px',
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? '#666' : '#a8a8a8',
      },
    },
    // Pour Firefox
    scrollbarWidth: 'thin',
    scrollbarColor:
      theme.palette.mode === 'dark' ? '#555 #2b2b2b' : '#c1c1c1 #f1f1f1',
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      sx={scrollStyles}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {place.name}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'grey.500' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={scrollStyles}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Journal
            </Typography>
            <Chip
              label={place.journalTitle}
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                fontWeight: 500,
              }}
            />
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1">
              {place.description || 'Aucune description fournie.'}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Date de visite
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon fontSize="small" />
                <Typography variant="body1">
                  {new Date(place.dateVisited).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Statut
              </Typography>
              <Chip
                label={place.isVisited ? 'Visité' : 'À visiter'}
                color={place.isVisited ? 'success' : 'warning'}
                sx={{
                  bgcolor: place.isVisited ? '#E8F5E8' : '#FFF3E0',
                  color: place.isVisited ? '#2E7D32' : '#F57C00',
                }}
              />
            </Grid>
          </Grid>

          {place.category && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Catégorie
              </Typography>
              <Chip label={place.category} variant="outlined" />
            </Box>
          )}

          {place.photos && place.photos.length > 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Photos ({place.photos.length})
              </Typography>

              <Grid container spacing={2}>
                {place.photos.map((photo, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <Box
                      component="img"
                      src={photo}
                      alt={`${place.name} ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: {
                          xs: 200,
                          sm: 180,
                          md: 160,
                        },
                        objectFit: 'cover',
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition:
                          'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: theme.shadows[8],
                        },
                        // Responsive pour les très petits écrans
                        [theme.breakpoints.down('sm')]: {
                          height: 250,
                        },
                        // Responsive pour les écrans moyens et grands
                        [theme.breakpoints.up('lg')]: {
                          height: 180,
                        },
                      }}
                      loading="lazy"
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Fermer
        </Button>
        <Button variant="contained" onClick={handleViewDetails}>
          Voir les détails complets
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlaceDetailModal;
