import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Avatar,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Place as PlaceIcon,
  Photo as PhotoIcon,
  CalendarToday as CalendarIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

import { publicService, type PublicJournal } from '../services/public.service';

const PublicJournalDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [journal, setJournal] = useState<PublicJournal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadJournal();
    }
  }, [id]);

  const loadJournal = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const journalData = await publicService.getPublicJournalById(id);
      setJournal(journalData);
      setError(null);
    } catch (err) {
      console.error('Error loading journal:', err);
      setError('Erreur lors du chargement du journal');
    } finally {
      setLoading(false);
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const end = new Date(endDate).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return startDate === endDate ? start : `${start} - ${end}`;
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={() => navigate('/public/journals')}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              MemoTrip - Journal Public
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => navigate('/')}
              title="Accueil"
            >
              <HomeIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
          >
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  if (error || !journal) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={() => navigate('/public/journals')}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              MemoTrip - Journal Public
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => navigate('/')}
              title="Accueil"
            >
              <HomeIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error">{error || 'Journal non trouvé'}</Alert>
          <Box mt={3}>
            <Button
              variant="outlined"
              onClick={() => navigate('/public/journals')}
              startIcon={<ArrowBackIcon />}
            >
              Retour aux journaux publics
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Barre de navigation */}
      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => navigate('/public/journals')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {journal.title}
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => navigate('/')}
            title="Accueil"
          >
            <HomeIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* En-tête du journal */}
        <Card sx={{ mb: 4 }}>
          {journal.cover_image && (
            <CardMedia
              component="img"
              height="300"
              image={journal.cover_image}
              alt={journal.title}
              sx={{ objectFit: 'cover' }}
            />
          )}
          <CardContent>
            <Typography variant="h3" component="h1" gutterBottom>
              {journal.title}
            </Typography>

            {journal.description && (
              <Typography
                variant="body1"
                color="text.secondary"
                paragraph
                sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}
              >
                {journal.description}
              </Typography>
            )}

            {/* Informations sur l'auteur */}
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Avatar
                src={journal.user_id.avatar?.url}
                sx={{ width: 48, height: 48 }}
              >
                {journal.user_id.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h6">{journal.user_id.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Auteur du voyage
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Informations du voyage */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Période
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDateRange(journal.start_date, journal.end_date)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <PlaceIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Lieux visités
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {journal.stats.total_places} lieux
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <PhotoIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Photos
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {journal.stats.total_photos} photos
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Durée
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {journal.stats.total_days} jours
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Tags */}
            {journal.tags && journal.tags.length > 0 && (
              <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                  Tags
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {journal.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Lieux du journal */}
        {journal.places && journal.places.length > 0 && (
          <Box>
            <Typography variant="h4" gutterBottom>
              Lieux visités ({journal.places.length})
            </Typography>
            <Grid container spacing={3}>
              {journal.places.map((place) => (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={place._id}>
                  <Card sx={{ height: '100%' }}>
                    {place.photos && place.photos.length > 0 && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={place.photos[0].url}
                        alt={place.name}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {place.name}
                      </Typography>
                      {place.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          {place.description}
                        </Typography>
                      )}
                      <Box display="flex" alignItems="center" gap={1} mt={2}>
                        <CalendarIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(place.date_visited).toLocaleDateString(
                            'fr-FR'
                          )}
                        </Typography>
                      </Box>
                      {place.rating && (
                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                          <Typography variant="body2" color="text.secondary">
                            Note : {place.rating}/5 ⭐
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Bouton retour */}
        <Box mt={6} textAlign="center">
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/public/journals')}
            startIcon={<ArrowBackIcon />}
          >
            Découvrir d'autres journaux
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default PublicJournalDetail;
