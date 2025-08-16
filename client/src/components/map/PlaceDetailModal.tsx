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
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface PlaceWithJournal {
  id: string;
  name: string;
  description: string;
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
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
      <DialogContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Journal
            </Typography>
            <Chip label={place.journalTitle} color="primary" />
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1">
              {place.description || 'Aucune description fournie.'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box>
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
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Statut
              </Typography>
              <Chip
                label={place.isVisited ? 'Visité' : 'À visiter'}
                color={place.isVisited ? 'success' : 'warning'}
                icon={place.isVisited ? <LocationIcon /> : <CalendarIcon />}
              />
            </Box>
          </Box>

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
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {place.photos.slice(0, 4).map((photo, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={photo}
                    alt={`${place.name} ${index + 1}`}
                    sx={{
                      width: '100%',
                      height: 150,
                      objectFit: 'cover',
                      borderRadius: 1,
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
        <Button variant="contained" onClick={handleViewDetails}>
          Voir les détails complets
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlaceDetailModal;
