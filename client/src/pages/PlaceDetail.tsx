import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Rating,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Container,
  Fab,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  Map as MapIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useJournals } from '../context/JournalContext';
import { placeApi } from '../services/place-api';
import type { Place } from '../services/place-api';
import PhotoGallery from '../components/PhotoGallery';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configuration des icônes Leaflet par défaut
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Icônes personnalisées pour les marqueurs
const visitedIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const toVisitIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Déterminer le statut de visite d'un lieu
const getVisitStatus = (place: Place | null) => {
  if (!place?.date_visited) return null;

  const visitDate = new Date(place.date_visited);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  visitDate.setHours(0, 0, 0, 0);

  if (visitDate <= today) {
    return 'visited';
  } else {
    return 'to_visit';
  }
};

// Formater la plage de dates
const formatDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const end = new Date(endDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (startDate === endDate) {
    return `le ${start}`;
  }
  return `du ${start} au ${end}`;
};

const PlaceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { journals } = useJournals();
  const theme = useTheme();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  // Styles pour le scroll personnalisé avec support dark/light
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
    scrollbarWidth: 'thin',
    scrollbarColor:
      theme.palette.mode === 'dark' ? '#555 #2b2b2b' : '#c1c1c1 #f1f1f1',
  };

  // Fonction pour ouvrir le lieu sur la carte
  const openPlaceMap = () => {
    if (!place?.location?.coordinates) return;
    setShowMap(true);
  };

  const closePlaceMap = () => {
    setShowMap(false);
  };

  // Navigation des photos
  const handlePrevPhoto = () => {
    setSelectedPhotoIndex((prev) =>
      prev === 0 ? photos.length - 1 : prev - 1
    );
  };

  const handleNextPhoto = () => {
    setSelectedPhotoIndex((prev) =>
      prev === photos.length - 1 ? 0 : prev + 1
    );
  };

  // Récupérer les données du lieu via l'API
  useEffect(() => {
    const fetchPlace = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const localPlace = journals
          .flatMap((journal) => journal.places)
          .find((p) => p.id === id);

        if (localPlace) {
          const apiPlace = await placeApi.getPlaceById(id);
          setPlace(apiPlace);
        } else {
          const apiPlace = await placeApi.getPlaceById(id);
          setPlace(apiPlace);
        }
      } catch (err) {
        console.error('Erreur lors du chargement du lieu:', err);
        setError('Impossible de charger les données du lieu');
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [id, journals]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          p: 3,
        }}
      >
        <CircularProgress size={48} />
        <Typography
          variant={isMobile ? 'body1' : 'h6'}
          sx={{ mt: 2, textAlign: 'center' }}
        >
          Chargement des données du lieu...
        </Typography>
      </Box>
    );
  }

  if (error || !place) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {error || 'Lieu non trouvé'}
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            variant="contained"
          >
            Retour
          </Button>
        </Box>
      </Container>
    );
  }

  // Photos du lieu avec fallback
  const photos =
    place.photos && place.photos.length > 0
      ? place.photos.map((photo) =>
          typeof photo === 'string' ? photo : photo.url
        )
      : [
          'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&q=80&w=800',
        ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        ...scrollStyles,
      }}
    >
      {/* Header responsive FIXED */}
      <Card
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          position: 'sticky',
          top: 0,
          zIndex: 1200,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: { xs: 56, sm: 64 },
              py: { xs: 1, sm: 1.5 },
            }}
          >
            {/* Section gauche - Navigation et titre */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 2 },
                flex: 1,
                minWidth: 0,
              }}
            >
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{
                  minWidth: 'auto',
                  px: 1,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
                size={isMobile ? 'small' : 'medium'}
              >
                {isMobile ? '' : ''}
              </Button>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant={isMobile ? 'subtitle1' : 'h6'}
                  fontWeight={600}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {place.name}
                </Typography>

                {!isMobile && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {place.location?.city && place.location?.country
                      ? `${place.location.city}, ${place.location.country}`
                      : place.location?.country || 'Localisation non spécifiée'}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Section droite - Actions */}
            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
              <IconButton
                sx={{
                  color: place.is_favorite ? 'error.main' : 'text.secondary',
                }}
                size={isMobile ? 'small' : 'medium'}
              >
                <FavoriteIcon />
              </IconButton>
              <Button
                startIcon={!isMobile && <EditIcon />}
                variant="outlined"
                onClick={() => navigate(`/place/${place._id}/edit`)}
                size={isMobile ? 'small' : 'medium'}
                sx={{ minWidth: { xs: 'auto', sm: 'auto' } }}
              >
                {isMobile ? <EditIcon /> : 'Modifier'}
              </Button>
            </Box>
          </Box>
        </Container>
      </Card>

      {/* Contenu principal avec margin-top pour compenser le header fixed */}
      <Box sx={{ pt: { xs: 7, sm: 9 } }}>
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Galerie photos principale */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Card
                sx={{
                  mb: 2,
                  bgcolor: 'background.paper',
                  boxShadow: theme.shadows[2],
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height={isMobile ? '250' : isTablet ? '350' : '400'}
                    image={photos[selectedPhotoIndex]}
                    alt={place.name}
                    sx={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.01)',
                      },
                    }}
                    onClick={() => setShowGallery(true)}
                  />

                  {/* Boutons de navigation transparents */}
                  {photos.length > 1 && (
                    <>
                      <Fab
                        size={isMobile ? 'small' : 'medium'}
                        onClick={handlePrevPhoto}
                        sx={{
                          position: 'absolute',
                          left: { xs: 8, sm: 16 },
                          top: '50%',
                          transform: 'translateY(-50%)',
                          bgcolor: 'rgba(255, 255, 255, 0.3)',
                          backdropFilter: 'blur(4px)',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.4)',
                          },
                        }}
                      >
                        <ChevronLeftIcon />
                      </Fab>

                      <Fab
                        size={isMobile ? 'small' : 'medium'}
                        onClick={handleNextPhoto}
                        sx={{
                          position: 'absolute',
                          right: { xs: 8, sm: 16 },
                          top: '50%',
                          transform: 'translateY(-50%)',
                          bgcolor: 'rgba(255, 255, 255, 0.3)',
                          backdropFilter: 'blur(4px)',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.4)',
                          },
                        }}
                      >
                        <ChevronRightIcon />
                      </Fab>
                    </>
                  )}

                  {/* Indicateurs de photos */}
                  {photos.length > 1 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: 1,
                      }}
                    >
                      {photos.map((_, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: { xs: 6, sm: 8 },
                            height: { xs: 6, sm: 8 },
                            borderRadius: '50%',
                            bgcolor:
                              selectedPhotoIndex === index
                                ? 'white'
                                : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            border:
                              selectedPhotoIndex === index
                                ? '1px solid rgba(0,0,0,0.3)'
                                : 'none',
                            '&:hover': {
                              bgcolor: 'white',
                              transform: 'scale(1.2)',
                            },
                          }}
                          onClick={() => setSelectedPhotoIndex(index)}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Card>

              {/* Miniatures responsive */}
              {photos.length > 1 && (
                <Grid container spacing={{ xs: 1, sm: 1.5 }} sx={{ mb: 3 }}>
                  {photos
                    .slice(0, isMobile ? 4 : isTablet ? 6 : 8)
                    .map((photo, index) => (
                      <Grid key={index} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
                        <Card
                          sx={{
                            cursor: 'pointer',
                            border: selectedPhotoIndex === index ? 2 : 1,
                            borderColor:
                              selectedPhotoIndex === index
                                ? 'primary.main'
                                : theme.palette.mode === 'dark'
                                  ? 'grey.700'
                                  : 'grey.300',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: 'primary.main',
                              transform: 'translateY(-2px)',
                              boxShadow: theme.shadows[15],
                            },
                          }}
                          onClick={() => setSelectedPhotoIndex(index)}
                        >
                          <CardMedia
                            component="img"
                            height={isMobile ? '60' : '80'}
                            image={photo}
                            alt={`${place.name} ${index + 1}`}
                            sx={{ objectFit: 'cover' }}
                          />
                        </Card>
                      </Grid>
                    ))}

                  {photos.length > (isMobile ? 4 : isTablet ? 6 : 8) && (
                    <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: 1,
                          borderColor:
                            theme.palette.mode === 'dark'
                              ? 'grey.700'
                              : 'grey.300',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: isMobile ? 60 : 80,
                          bgcolor:
                            theme.palette.mode === 'dark'
                              ? 'grey.800'
                              : 'grey.100',
                          '&:hover': {
                            bgcolor:
                              theme.palette.mode === 'dark'
                                ? 'grey.700'
                                : 'grey.200',
                            transform: 'translateY(-2px)',
                          },
                        }}
                        onClick={() => setShowGallery(true)}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={600}
                        >
                          +{photos.length - (isMobile ? 4 : isTablet ? 6 : 8)}
                        </Typography>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              )}

              {/* Tags repositionnés sous les photos en desktop */}
              {!isMobile && place.tags && place.tags.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {place.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="medium"
                        sx={{
                          bgcolor: [
                            theme.palette.mode === 'dark'
                              ? 'rgba(33, 150, 243, 0.16)'
                              : '#E3F2FD',
                            theme.palette.mode === 'dark'
                              ? 'rgba(156, 39, 176, 0.16)'
                              : '#F3E5F5',
                            theme.palette.mode === 'dark'
                              ? 'rgba(76, 175, 80, 0.16)'
                              : '#E8F5E8',
                            theme.palette.mode === 'dark'
                              ? 'rgba(255, 152, 0, 0.16)'
                              : '#FFF3E0',
                          ][index % 4],
                          color: [
                            theme.palette.mode === 'dark'
                              ? '#90CAF9'
                              : '#1976D2',
                            theme.palette.mode === 'dark'
                              ? '#CE93D8'
                              : '#7B1FA2',
                            theme.palette.mode === 'dark'
                              ? '#81C784'
                              : '#2E7D32',
                            theme.palette.mode === 'dark'
                              ? '#FFB74D'
                              : '#E65100',
                          ][index % 4],
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>

            {/* Sidebar droite - Informations pratiques responsive */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Card
                sx={{
                  bgcolor: 'background.paper',
                  boxShadow: theme.shadows[2],
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography
                    variant={isMobile ? 'subtitle1' : 'h6'}
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Informations pratiques
                  </Typography>

                  {/* Status et dates avec chips */}
                  {(() => {
                    const visitStatus = getVisitStatus(place);
                    if (place.start_date && place.end_date) {
                      return (
                        <Box sx={{ mb: 2 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            {visitStatus === 'visited'
                              ? 'Dates de visite'
                              : 'Dates prévues'}
                          </Typography>
                          <Chip
                            icon={
                              visitStatus === 'visited' ? (
                                <CheckCircleIcon />
                              ) : (
                                <ScheduleIcon />
                              )
                            }
                            label={formatDateRange(
                              place.start_date,
                              place.end_date
                            )}
                            color={
                              visitStatus === 'visited' ? 'success' : 'warning'
                            }
                            sx={{
                              bgcolor:
                                visitStatus === 'visited'
                                  ? theme.palette.mode === 'dark'
                                    ? 'rgba(76, 175, 80, 0.16)'
                                    : '#E8F5E8'
                                  : theme.palette.mode === 'dark'
                                    ? 'rgba(255, 152, 0, 0.16)'
                                    : '#FFF3E0',
                              color:
                                visitStatus === 'visited'
                                  ? theme.palette.mode === 'dark'
                                    ? '#81C784'
                                    : '#2E7D32'
                                  : theme.palette.mode === 'dark'
                                    ? '#FFB74D'
                                    : '#F57C00',
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      );
                    }
                    return null;
                  })()}

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {place.description || 'Aucune description disponible'}
                    </Typography>
                  </Box>

                  {place.weather && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Météo : {place.weather}
                      </Typography>
                    </Box>
                  )}

                  {place.budget && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Budget : {place.budget} €
                      </Typography>
                    </Box>
                  )}

                  {place.visit_duration && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Durée de visite : {place.visit_duration} minutes
                      </Typography>
                    </Box>
                  )}

                  {place.rating && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        Note
                      </Typography>
                      <Rating
                        value={place.rating}
                        readOnly
                        size={isMobile ? 'small' : 'medium'}
                      />
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Typography
                    variant={isMobile ? 'subtitle1' : 'h6'}
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Localisation
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {place.location?.address ||
                      `${place.location?.city || ''}, ${place.location?.country || ''}`.replace(
                        /^,\s*|,\s*$/g,
                        ''
                      ) ||
                      'Adresse non spécifiée'}
                  </Typography>

                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<MapIcon />}
                    onClick={openPlaceMap}
                    disabled={!place.location?.coordinates}
                    sx={{
                      mb: 3,
                      borderColor: 'error.main',
                      color: 'error.main',
                      '&:hover': {
                        borderColor: 'error.dark',
                        color: 'error.dark',
                        bgcolor: 'rgba(244, 67, 54, 0.04)',
                      },
                      '&:disabled': {
                        borderColor: 'grey.300',
                        color: 'grey.400',
                      },
                    }}
                  >
                    {place.location?.coordinates
                      ? 'Voir sur la carte'
                      : 'Coordonnées non disponibles'}
                  </Button>

                  {/* Tags en mobile dans la sidebar */}
                  {isMobile && place.tags && place.tags.length > 0 && (
                    <>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{ mb: 2 }}
                      >
                        Tags
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1,
                          flexWrap: 'wrap',
                          mb: 2,
                        }}
                      >
                        {place.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            sx={{
                              bgcolor: [
                                theme.palette.mode === 'dark'
                                  ? 'rgba(33, 150, 243, 0.16)'
                                  : '#E3F2FD',
                                theme.palette.mode === 'dark'
                                  ? 'rgba(156, 39, 176, 0.16)'
                                  : '#F3E5F5',
                                theme.palette.mode === 'dark'
                                  ? 'rgba(76, 175, 80, 0.16)'
                                  : '#E8F5E8',
                                theme.palette.mode === 'dark'
                                  ? 'rgba(255, 152, 0, 0.16)'
                                  : '#FFF3E0',
                              ][index % 4],
                              color: [
                                theme.palette.mode === 'dark'
                                  ? '#90CAF9'
                                  : '#1976D2',
                                theme.palette.mode === 'dark'
                                  ? '#CE93D8'
                                  : '#7B1FA2',
                                theme.palette.mode === 'dark'
                                  ? '#81C784'
                                  : '#2E7D32',
                                theme.palette.mode === 'dark'
                                  ? '#FFB74D'
                                  : '#E65100',
                              ][index % 4],
                            }}
                          />
                        ))}
                      </Box>
                    </>
                  )}

                  {place.notes && (
                    <Box sx={{ mt: 3 }}>
                      <Typography
                        variant={isMobile ? 'subtitle1' : 'h6'}
                        fontWeight={600}
                        sx={{ mb: 2 }}
                      >
                        Notes
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {place.notes}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Modal galerie photos */}
      {showGallery && (
        <PhotoGallery photos={photos} onClose={() => setShowGallery(false)} />
      )}

      {/* Modal carte responsive */}
      <Dialog
        open={showMap}
        onClose={closePlaceMap}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        sx={scrollStyles}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={600}>
            {place?.name}
          </Typography>
          <IconButton onClick={closePlaceMap}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            p: 0,
            height: { xs: 'calc(100vh - 200px)', sm: 400 },
            bgcolor: 'background.paper',
          }}
        >
          {place?.location?.coordinates && (
            <MapContainer
              center={[
                place.location.coordinates[1], // latitude
                place.location.coordinates[0], // longitude
              ]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={[
                  place.location.coordinates[1],
                  place.location.coordinates[0],
                ]}
                icon={
                  getVisitStatus(place) === 'visited'
                    ? visitedIcon
                    : toVisitIcon
                }
              >
                <Popup>
                  <Box sx={{ p: 1, minWidth: isMobile ? 150 : 200 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {place.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {place.description || 'Aucune description disponible'}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: 'block' }}
                    >
                      GPS: {place.location.coordinates[1].toFixed(4)},{' '}
                      {place.location.coordinates[0].toFixed(4)}
                    </Typography>
                    {getVisitStatus(place) === 'visited' && (
                      <Box
                        sx={{
                          bgcolor:
                            theme.palette.mode === 'dark'
                              ? 'rgba(76, 175, 80, 0.16)'
                              : '#E8F5E8',
                          color:
                            theme.palette.mode === 'dark'
                              ? '#81C784'
                              : '#2E7D32',
                          borderRadius: 1,
                          px: 1,
                          py: 0.5,
                          mt: 1,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        <CheckCircleIcon sx={{ fontSize: '0.875rem' }} />
                        <Typography variant="caption" fontWeight={600}>
                          Visité
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Popup>
              </Marker>
            </MapContainer>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'background.paper' }}>
          <Button onClick={closePlaceMap}>Fermer</Button>
          <Button
            variant="contained"
            onClick={() => {
              closePlaceMap();
              navigate(`/place/${place?._id}/edit`);
            }}
          >
            Modifier le lieu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlaceDetail;
