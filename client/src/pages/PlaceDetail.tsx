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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import { useJournals } from '../context/JournalContext';
import { placeApi } from '../services/place-api';
import type { Place } from '../services/place-api';
import PhotoGallery from '../components/PhotoGallery';

const PlaceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { journals } = useJournals();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les données du lieu via l'API
  useEffect(() => {
    const fetchPlace = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // D'abord essayer de trouver dans le contexte local pour avoir une référence rapide
        const localPlace = journals
          .flatMap((journal) => journal.places)
          .find((p) => p.id === id);

        if (localPlace) {
          // Convertir les données locales vers le format API pour l'appel
          const apiPlace = await placeApi.getPlaceById(id);
          setPlace(apiPlace);
        } else {
          // Si pas trouvé localement, essayer directement l'API
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
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement des données du lieu...
        </Typography>
      </Box>
    );
  }

  if (error || !place) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary">
          {error || 'Lieu non trouvé'}
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Retour
        </Button>
      </Box>
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: 3,
          py: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ color: 'text.secondary' }}
            >
              Retour
            </Button>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {place.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {place.location?.city && place.location?.country
                    ? `${place.location.city}, ${place.location.country}`
                    : place.location?.country || 'Localisation non spécifiée'}
                </Typography>
                {place.tags && place.tags.length > 0 && (
                  <Chip
                    label={place.tags[0]}
                    size="small"
                    sx={{
                      bgcolor: '#FFF3E0',
                      color: '#E65100',
                      fontWeight: 500,
                    }}
                  />
                )}
                <Chip
                  label={`Visité le ${new Date(place.date_visited).toLocaleDateString('fr-FR')}`}
                  size="small"
                  sx={{
                    bgcolor: '#E8F5E8',
                    color: '#2E7D32',
                    fontWeight: 500,
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              sx={{
                color: place.is_favorite ? 'error.main' : 'text.secondary',
              }}
            >
              <FavoriteIcon />
            </IconButton>
            <IconButton sx={{ color: 'text.secondary' }}>
              <ShareIcon />
            </IconButton>
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              sx={{ ml: 1 }}
              onClick={() => navigate(`/place/${place._id}/edit`)}
            >
              Modifier
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Contenu principal */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Grid container spacing={3}>
          {/* Galerie photos principale */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ mb: 2 }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="400"
                  image={photos[selectedPhotoIndex]}
                  alt={place.name}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setShowGallery(true)}
                />

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
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor:
                            selectedPhotoIndex === index
                              ? 'white'
                              : 'rgba(255,255,255,0.5)',
                          cursor: 'pointer',
                        }}
                        onClick={() => setSelectedPhotoIndex(index)}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Card>

            {/* Miniatures */}
            {photos.length > 1 && (
              <Grid container spacing={1} sx={{ mb: 3 }}>
                {photos.map((photo, index) => (
                  <Grid size={3} key={index}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: selectedPhotoIndex === index ? 2 : 0,
                        borderColor: 'primary.main',
                      }}
                      onClick={() => setSelectedPhotoIndex(index)}
                    >
                      <CardMedia
                        component="img"
                        height="80"
                        image={photo}
                        alt={`${place.name} ${index + 1}`}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>

          {/* Sidebar droite - Informations pratiques */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Informations pratiques
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {place.description}
                  </Typography>
                </Box>

                {place.rating && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      Note
                    </Typography>
                    <Rating value={place.rating} readOnly size="small" />
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
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
                      Budget : {place.budget}€
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

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<MapIcon />}
                  sx={{
                    mb: 3,
                    borderColor: 'error.main',
                    color: 'error.main',
                    '&:hover': {
                      borderColor: 'error.dark',
                      color: 'error.dark',
                    },
                  }}
                >
                  Voir sur la carte
                </Button>

                {place.tags && place.tags.length > 0 && (
                  <>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                      Tags
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {place.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{
                            bgcolor: [
                              '#E3F2FD',
                              '#F3E5F5',
                              '#E8F5E8',
                              '#FFF3E0',
                            ][index % 4],
                            color: ['#1976D2', '#7B1FA2', '#2E7D32', '#E65100'][
                              index % 4
                            ],
                          }}
                        />
                      ))}
                    </Box>
                  </>
                )}

                {place.notes && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
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
      </Box>

      {/* Modal galerie photos */}
      {showGallery && (
        <PhotoGallery photos={photos} onClose={() => setShowGallery(false)} />
      )}
    </Box>
  );
};

export default PlaceDetail;
