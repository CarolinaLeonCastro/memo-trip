import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  CheckCircle as CheckCircleIcon,
  Share as ShareIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import PhotoGallery from '../components/PhotoGallery';

const JournalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getJournal } = useJournals();
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [showGallery, setShowGallery] = useState(false);

  const journal = id ? getJournal(id) : undefined;

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

  const openGallery = (photos: string[]) => {
    setSelectedPhotos(photos);
    setShowGallery(true);
  };

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
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
          sx={{ color: 'text.secondary' }}
        ></Button>

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
            <LocationOnIcon
              sx={{ color: 'primary.main', fontSize: '1.2rem' }}
            />
            <Typography variant="body2" color="primary.main" fontWeight={500}>
              {journal.places[0]?.name?.split(',').slice(-2).join(',').trim() ||
                'Paris, France'}
            </Typography>
          </Box>
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
            journal.places[0]?.photos[0] ||
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
        </Box>

        <Grid container spacing={2}>
          {journal.places.map((place) => (
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
                    image={
                      place.photos[0] ||
                      'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&q=80&w=400'
                    }
                    alt={place.name}
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

                  {/* Icône de vue */}
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      bgcolor: 'rgba(255,255,255,0.9)',
                      width: 32,
                      height: 32,
                      '&:hover': { bgcolor: 'white' },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (place.photos.length > 0) {
                        openGallery(place.photos);
                      }
                    }}
                  >
                    <VisibilityIcon sx={{ fontSize: '1rem' }} />
                  </IconButton>
                </Box>

                <CardContent sx={{ p: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 0.5 }}
                  >
                    {place.name.split(',')[0]}
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
                      {place.name.split(',').slice(1).join(',').trim() ||
                        'Paris, France'}
                    </Typography>
                  </Box>

                  {/* Note personnelle en italique */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontStyle: 'italic',
                      color: 'text.secondary',
                      fontSize: '0.8rem',
                      lineHeight: 1.3,
                    }}
                  >
                    "
                    {place.description ||
                      'Une expérience inoubliable dans ce lieu magnifique.'}
                    "
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Description du voyage */}
      <Box sx={{ mb: 4 }}>
        <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
          <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
            {journal.description ||
              `Notre voyage à Paris a commencé par une promenade matinale le long de la Seine. L'air était frais et la ville s'éveillait doucement. Nous avons pris le petit-déjeuner dans un café typiquement parisien près de Notre-Dame.

Après-midi, nous avons visité le Louvre où nous avons passé des heures à admirer les œuvres d'art. La Joconde était évidemment au rendez-vous, mais c'est la Vénus de Milo qui m'a le plus impressionnée.

Le soir, nous avons dîné dans un petit bistrot du Marais recommandé par notre hôte Airbnb. L'ambiance était parfaite et la cuisine délicieuse.`}
          </Typography>
        </Paper>
      </Box>

      {/* Tags */}
      <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap' }}>
        <Chip
          label="Romantique"
          sx={{
            backgroundColor: '#E3F2FD',
            color: '#1976D2',
            fontWeight: 500,
          }}
        />
        <Chip
          label="Culture"
          sx={{
            backgroundColor: '#F3E5F5',
            color: '#7B1FA2',
            fontWeight: 500,
          }}
        />
        <Chip
          label="Gastronomie"
          sx={{
            backgroundColor: '#E8F5E8',
            color: '#2E7D32',
            fontWeight: 500,
          }}
        />
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
