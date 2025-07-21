import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useJournals } from '../context/JournalContext';

import { formatWithOptions } from 'date-fns/fp';
import { fr } from 'date-fns/locale';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  PhotoCamera as PhotoCameraIcon,
  Add as AddIcon,
  Map as MapIcon,
  Download as DownloadIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import AddPlaceModal from '../components/AddPlaceModal';
import PhotoGallery from '../components/PhotoGallery';

export interface AddPlaceModalProps {
  journalId: string;
  onClose: () => void;
}

const JournalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getJournal, deleteJournal, deletePlace } = useJournals();
  const [showAddPlace, setShowAddPlace] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const journal = id ? getJournal(id) : undefined;

  if (!journal) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box textAlign="center">
          <Typography variant="h4" gutterBottom>
            Journal non trouvé
          </Typography>
          <Button
            component={Link}
            to="/journals"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
          >
            Retour aux journaux
          </Button>
        </Box>
      </Container>
    );
  }

  const handleDelete = () => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer le journal "${journal.title}" ?`
      )
    ) {
      deleteJournal(journal.id);
      navigate('/journals');
    }
  };

  const handlePlaceMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    placeId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedPlaceId(placeId);
  };

  const handlePlaceMenuClose = () => {
    setAnchorEl(null);
    setSelectedPlaceId(null);
  };

  const handleDeletePlace = () => {
    if (selectedPlaceId) {
      setDeleteDialogOpen(true);
    }
    handlePlaceMenuClose();
  };

  const confirmDeletePlace = () => {
    if (selectedPlaceId) {
      deletePlace(journal.id, selectedPlaceId);
    }
    setDeleteDialogOpen(false);
    setSelectedPlaceId(null);
  };

  const allPhotos = journal.places.flatMap((place) => place.photos);

  const openGallery = (photos: string[]) => {
    setSelectedPhotos(photos);
    setShowGallery(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Button
          component={Link}
          to="/journals"
          startIcon={<ArrowBackIcon />}
          variant="outlined"
        >
          Retour aux journaux
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component={Link}
            to={`/journals/${journal.id}/edit`}
            startIcon={<EditIcon />}
            variant="outlined"
          >
            Modifier
          </Button>
          <Button
            onClick={handleDelete}
            startIcon={<DeleteIcon />}
            variant="outlined"
            color="error"
          >
            Supprimer
          </Button>
        </Box>
      </Box>

      {/* Journal Info */}
      <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden' }}>
        <Box sx={{ position: 'relative', height: 300 }}>
          <CardMedia
            component="img"
            height="300"
            image={
              journal.places[0]?.photos[0] ||
              'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1200'
            }
            alt={journal.title}
            sx={{ filter: 'brightness(0.7)' }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 4,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              color: 'white',
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom>
              {journal.title}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
              {journal.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Chip
                icon={<CalendarTodayIcon />}
                label={`${formatWithOptions({ locale: fr }, 'dd MMM')(journal.startDate)} - ${formatWithOptions({ locale: fr }, 'dd MMM yyyy')(journal.endDate)}`}
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
              />
              <Chip
                icon={<LocationOnIcon />}
                label={`${journal.places.length} lieu${journal.places.length !== 1 ? 'x' : ''} visité${journal.places.length !== 1 ? 's' : ''}`}
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
              />
              <Chip
                icon={<PhotoCameraIcon />}
                label={`${allPhotos.length} photo${allPhotos.length !== 1 ? 's' : ''}`}
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <Button
          onClick={() => setShowAddPlace(true)}
          startIcon={<AddIcon />}
          variant="contained"
          size="large"
        >
          Ajouter un lieu
        </Button>

        <Button
          component={Link}
          to={`/map?journal=${journal.id}`}
          startIcon={<MapIcon />}
          variant="contained"
          color="success"
          size="large"
        >
          Voir sur la carte
        </Button>

        {allPhotos.length > 0 && (
          <Button
            onClick={() => openGallery(allPhotos)}
            startIcon={<PhotoCameraIcon />}
            variant="contained"
            color="secondary"
            size="large"
          >
            Galerie photos
          </Button>
        )}

        <Button startIcon={<DownloadIcon />} variant="outlined" size="large">
          Exporter PDF
        </Button>
      </Box>

      {/* Places */}
      <Box>
        <Typography variant="h4" component="h2" gutterBottom>
          Lieux visités
        </Typography>

        {journal.places.length === 0 ? (
          <Paper
            elevation={1}
            sx={{ p: 6, textAlign: 'center', bgcolor: 'grey.50' }}
          >
            <LocationOnIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Aucun lieu ajouté
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Commencez à documenter votre voyage en ajoutant des lieux
            </Typography>
            <Button
              onClick={() => setShowAddPlace(true)}
              startIcon={<AddIcon />}
              variant="contained"
              size="large"
            >
              Ajouter le premier lieu
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {journal.places
              .sort(
                (a, b) =>
                  new Date(a.dateVisited).getTime() -
                  new Date(b.dateVisited).getTime()
              )
              .map((place) => (
                <Grid size={12} key={place.id}>
                  <Card elevation={2}>
                    <Grid container>
                      <Grid size={{ xs: 12, md: 4 }}>
                        {place.photos.length > 0 ? (
                          <Box sx={{ position: 'relative' }}>
                            <CardMedia
                              component="img"
                              height="200"
                              image={place.photos[0]}
                              alt={place.name}
                              sx={{
                                cursor: 'pointer',
                                '&:hover': { opacity: 0.9 },
                              }}
                              onClick={() => openGallery(place.photos)}
                            />
                            {place.photos.length > 1 && (
                              <Chip
                                label={`+${place.photos.length - 1}`}
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  bottom: 8,
                                  right: 8,
                                  bgcolor: 'rgba(0,0,0,0.7)',
                                  color: 'white',
                                }}
                              />
                            )}
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              height: 200,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: 'grey.200',
                            }}
                          >
                            <PhotoCameraIcon
                              sx={{ fontSize: 60, color: 'grey.400' }}
                            />
                          </Box>
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, md: 8 }}>
                        <CardContent>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              mb: 2,
                            }}
                          >
                            <Box>
                              <Typography
                                variant="h5"
                                component="h3"
                                gutterBottom
                              >
                                {place.name}
                              </Typography>
                              <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ mb: 2 }}
                              >
                                {place.description}
                              </Typography>
                            </Box>

                            <IconButton
                              onClick={(e) => handlePlaceMenuClick(e, place.id)}
                              size="small"
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Box>

                          <Box
                            sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}
                          >
                            <Chip
                              label={formatWithOptions(
                                { locale: fr },
                                'dd MMM yyyy'
                              )(place.dateVisited)}
                              size="small"
                            />
                            <Chip
                              icon={<LocationOnIcon />}
                              label={`${place.latitude.toFixed(4)}, ${place.longitude.toFixed(4)}`}
                              size="small"
                            />
                            {place.photos.length > 0 && (
                              <Chip
                                icon={<PhotoCameraIcon />}
                                label={`${place.photos.length} photo${place.photos.length !== 1 ? 's' : ''}`}
                                size="small"
                              />
                            )}
                          </Box>
                        </CardContent>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              ))}
          </Grid>
        )}
      </Box>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handlePlaceMenuClose}
      >
        <MenuItem onClick={handlePlaceMenuClose}>
          <EditIcon sx={{ mr: 1 }} />
          Modifier
        </MenuItem>
        <MenuItem onClick={handleDeletePlace} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Supprimer
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer ce lieu ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={confirmDeletePlace}
            color="error"
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modals */}
      {showAddPlace && (
        <AddPlaceModal
          open={showAddPlace}
          onClose={() => setShowAddPlace(false)}
        />
      )}

      {showGallery && (
        <PhotoGallery
          photos={selectedPhotos}
          onClose={() => setShowGallery(false)}
        />
      )}
    </Container>
  );
};

export default JournalDetail;
