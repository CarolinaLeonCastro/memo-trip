import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useJournals } from '../context/JournalContext';
import { placeApi } from '../services/place-api';
import type { Place as ApiPlace } from '../services/place-api';

import { formatWithOptions } from 'date-fns/fp';
import { fr } from 'date-fns/locale';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Chip,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  CheckCircle as CheckCircleIcon,
  Share as ShareIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import PhotoGallery from '../components/PhotoGallery';

const JournalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getJournal } = useJournals();
  const [selectedPhotos] = useState<string[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [placesDetails, setPlacesDetails] = useState<Map<string, ApiPlace>>(
    new Map()
  );
  const theme = useTheme();
  const journal = id ? getJournal(id) : undefined;

  // Charger les données complètes des lieux depuis l'API
  useEffect(() => {
    const loadPlacesDetails = async () => {
      if (!journal || journal.places.length === 0) return;

      const newPlacesDetails = new Map<string, ApiPlace>();

      for (const place of journal.places) {
        try {
          const apiPlace = await placeApi.getPlaceById(place.id);
          newPlacesDetails.set(place.id, apiPlace);
        } catch (error) {
          console.error(
            `Erreur lors du chargement du lieu ${place.name}:`,
            error
          );
        }
      }

      setPlacesDetails(newPlacesDetails);
    };

    loadPlacesDetails();
  }, [journal]);

  // Calculer le nombre de jours pour un lieu
  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  if (!journal) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4">Journal non trouvé</Typography>
        <Button
          onClick={() => navigate('/journals')}
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Retour aux journaux
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header avec navigation */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
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
            <CalendarTodayIcon
              sx={{ color: 'text.secondary', fontSize: '1.2rem' }}
            />
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

      {/* Image principale */}
      <Box sx={{ mb: 4 }}>
        <CardMedia
          component="img"
          sx={{
            width: '100%',
            height: 400,
            borderRadius: 2,
            objectFit: 'cover',
          }}
          image={
            journal.mainPhoto ||
            'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1200'
          }
          alt={journal.title}
        />
      </Box>

      {/* Section Lieux visités */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <LocationOnIcon sx={{ color: 'error.main' }} />
          <Typography
            variant="h6"
            sx={{ fontFamily: '"Chau Philomene One", cursive' }}
          >
            Lieux visités ({journal.places.length})
          </Typography>
          {journal.places.length > 0 && (
            <Button
              component={Link}
              to={`/place/new?journalId=${journal.id}`}
              variant="outlined"
              startIcon={<AddIcon />}
              size="small"
              sx={{ ml: 'auto' }}
            >
              Ajouter un lieu
            </Button>
          )}
        </Box>

        {journal.places.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              border: '2px dashed',
              borderColor: 'grey.300',
              borderRadius: 2,
              bgcolor: 'grey.50',
            }}
          >
            <LocationOnIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aucun lieu visité
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Commencez à planifier votre voyage en ajoutant des lieux à visiter
            </Typography>
            <Button
              component={Link}
              to={`/place/new?journalId=${journal.id}`}
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                mr: 2,
                background: `linear-gradient(45deg, ${theme.palette.error.main} 30%, ${theme.palette.error.light} 90%)`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.error.dark} 30%, ${theme.palette.error.main} 90%)`,
                },
              }}
            >
              Ajouter un lieu
            </Button>
            <Button
              onClick={() => navigate(`/journals/${journal.id}/edit`)}
              variant="outlined"
              startIcon={<EditIcon />}
            >
              Modifier le journal
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {journal.places.map((place) => {
              const placeDetails = placesDetails.get(place.id);
              const mainPhoto =
                placeDetails?.photos?.[0]?.url ||
                place.photos[0] ||
                'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&q=80&w=400';

              // Calculer le nombre de jours si on a les dates
              const days = placeDetails
                ? calculateDays(placeDetails.start_date, placeDetails.end_date)
                : 1;

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={place.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                      },
                    }}
                    onClick={() => navigate(`/place/${place.id}`)}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="150"
                        image={mainPhoto}
                        alt={placeDetails?.name || place.name}
                      />

                      {/* Badge Visité */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: '#4CAF50',
                          color: 'white',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CheckCircleIcon sx={{ fontSize: '1rem' }} />
                      </Box>

                      {/* Badge Visité texte */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8,
                          bgcolor: 'primary.main',
                          color: 'white',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontWeight: 500,
                        }}
                      >
                        Visité
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 2 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{ mb: 0.5 }}
                      >
                        {(placeDetails?.name || place.name).split(',')[0]}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          mb: 1,
                        }}
                      >
                        <LocationOnIcon
                          sx={{ fontSize: '0.875rem', color: 'text.secondary' }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {placeDetails?.location?.country ||
                            place.country ||
                            'Lieu non spécifié'}
                        </Typography>
                      </Box>

                      {/* Description avec données API */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontStyle: 'italic',
                          color: 'text.secondary',
                          fontSize: '0.8rem',
                          lineHeight: 1.3,
                          mb: 1,
                        }}
                      >
                        "
                        {placeDetails?.description ||
                          place.description ||
                          'Une expérience inoubliable dans ce lieu magnifique.'}
                        "
                      </Typography>

                      {/* Nombre de jours */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          color: 'primary.main',
                          textTransform: 'uppercase',
                        }}
                      >
                        {days} jour{days > 1 ? 's' : ''}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>

      {/* Description et Notes personnelles */}
      <Box sx={{ mb: 4 }}>
        {journal.description && (
          <Box sx={{ p: 3, mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Chau Philomene One", cursive',
                mb: 2,
                color: 'primary.main',
              }}
            >
              Description du voyage
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
              {journal.description}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Notes personnelles */}
      <Box sx={{ mb: 4 }}>
        {journal.personalNotes && (
          <Box sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Chau Philomene One", cursive',
                mb: 2,
                color: 'text.primary',
              }}
            >
              Notes personnelles
            </Typography>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.7,
                fontStyle: 'italic',
                color: 'text.primary',
              }}
            >
              {journal.personalNotes}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Tags */}
      <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap' }}>
        {journal.tags && journal.tags.length > 0 ? (
          journal.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              sx={{
                backgroundColor: 'tertiary.main',
                color: 'primary.main',
                fontWeight: 500,
              }}
            />
          ))
        ) : (
          <Chip
            label="Aucun tag"
            sx={{
              backgroundColor: 'grey.100',
              color: 'grey.600',
              fontWeight: 500,
            }}
          />
        )}
      </Box>

      {/* Modal galerie photos */}
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
