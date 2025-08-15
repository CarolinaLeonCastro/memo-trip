import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  Photo as PhotoIcon,
} from '@mui/icons-material';

import { fr } from 'date-fns/locale';
import { formatWithOptions } from 'date-fns/fp';
import { useJournals } from '../context/JournalContext';
import theme from '../theme';

const Journals: React.FC = () => {
  const { journals, deleteJournal } = useJournals();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJournals = journals.filter(
    (journal) =>
      journal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journal.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcul des statistiques
  const totalJournals = journals.length;
  const totalLikes = 167; // Valeur simulée
  const totalComments = 58; // Valeur simulée
  const totalPhotos = journals.reduce(
    (acc, journal) =>
      acc +
      journal.places.reduce(
        (placeAcc, place) => placeAcc + place.photos.length,
        0
      ),
    0
  );

  const handleDelete = (id: string, title: string) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer le journal "${title}" ?`
      )
    ) {
      deleteJournal(id);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h3"
            color="primary.main"
            sx={{ fontFamily: '"Chau Philomene One", cursive', mb: 1 }}
          >
            Mes Journaux de Voyage
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Découvrez et gérez tous vos souvenirs de voyage
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/journals/new"
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.error.main} 30%, ${theme.palette.error.light} 90%)`,
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.error.dark} 30%, ${theme.palette.error.main} 90%)`,
            },
          }}
        >
          Nouveau Journal
        </Button>
      </Box>

      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #EBF8FF 0%, #E0E7FF 100%)',
              textAlign: 'center',
              p: 2,
              border: 'none',
              boxShadow: 'none',
            }}
          >
            <Typography variant="h3" fontWeight={700} color="#1D4ED8">
              {totalJournals}
            </Typography>
            <Typography variant="body1" color="#2563EB" fontWeight={500}>
              Journaux
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
              textAlign: 'center',
              p: 2,
              border: 'none',
              boxShadow: 'none',
            }}
          >
            <Typography variant="h3" fontWeight={700} color="#15803D">
              {totalLikes}
            </Typography>
            <Typography variant="body1" color="#16A34A" fontWeight={500}>
              J'aime reçus
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #FAF5FF 0%, #FDF2F8 100%)',
              textAlign: 'center',
              p: 2,
              border: 'none',
              boxShadow: 'none',
            }}
          >
            <Typography variant="h3" fontWeight={700} color="#7C3AED">
              {totalComments}
            </Typography>
            <Typography variant="body1" color="#8B5CF6" fontWeight={500}>
              Commentaires
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #FFF7ED 0%, #FEF2F2 100%)',
              textAlign: 'center',
              p: 2,
              border: 'none',
              boxShadow: 'none',
            }}
          >
            <Typography variant="h3" fontWeight={700} color="#C2410C">
              {totalPhotos}
            </Typography>
            <Typography variant="body1" color="#EA580C" fontWeight={500}>
              Photos
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Rechercher un journal..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500 }}
        />
      </Box>

      {/* Journals Grid */}
      {filteredJournals.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <LocationIcon
              sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
            />
            <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
              {searchTerm
                ? 'Aucun journal trouvé'
                : 'Aucun journal pour le moment'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm
                ? "Essayez avec d'autres mots-clés"
                : 'Commencez votre première aventure en créant un nouveau journal'}
            </Typography>
            {!searchTerm && (
              <Button
                component={Link}
                to="/journals/new"
                variant="contained"
                startIcon={<AddIcon />}
                size="large"
              >
                Créer mon premier journal
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredJournals.map((journal) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={journal.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      journal.places[0]?.photos[0] ||
                      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800'
                    }
                    alt={journal.title}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      display: 'flex',
                      gap: 1,
                    }}
                  >
                    <IconButton
                      component={Link}
                      to={`/journals/${journal.id}/edit`}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.9)',
                        '&:hover': { bgcolor: 'white' },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(journal.id, journal.title)}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.9)',
                        '&:hover': { bgcolor: 'white' },
                      }}
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </Box>
                </Box>

                <CardContent
                  sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                >
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {journal.title}
                  </Typography>

                  <Typography variant="caption" sx={{ mb: 1 }}>
                    {journal.places
                      .slice(0, 4)
                      .map((place) => place.country)
                      .join(', ')}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, flexGrow: 1 }}
                  >
                    {journal.description}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Chip
                      icon={<CalendarIcon />}
                      label={`${formatWithOptions({ locale: fr }, 'dd MMM')(journal.startDate)} - ${formatWithOptions({ locale: fr }, 'dd MMM yyyy')(journal.endDate)}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        border: 'none',
                      }}
                    />
                  </Box>

                  {/* Tags */}
                  <Box
                    sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}
                  >
                    <Chip
                      label="Romantique"
                      size="small"
                      sx={{
                        backgroundColor: 'tertiary.main',
                        color: 'primary.main',
                        fontWeight: 500,
                      }}
                    />
                    <Chip
                      label="Culture"
                      size="small"
                      sx={{
                        backgroundColor: 'tertiary.main',
                        color: 'primary.main',
                        fontWeight: 500,
                      }}
                    />
                    <Chip
                      label="Gastronomie"
                      size="small"
                      sx={{
                        backgroundColor: 'tertiary.main',
                        color: 'primary.main',
                        fontWeight: 500,
                      }}
                    />
                  </Box>

                  {/* Statistiques d'engagement */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 'auto',
                      pt: 2,
                      borderTop: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <FavoriteIcon
                          sx={{ fontSize: '1rem', color: '#E91E63' }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          24
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <CommentIcon
                          sx={{ fontSize: '1rem', color: '#2196F3' }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          8
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <PhotoIcon
                          sx={{ fontSize: '1rem', color: '#FF9800' }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {journal.places.reduce(
                            (acc, place) => acc + place.photos.length,
                            0
                          )}{' '}
                          photos
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      component={Link}
                      to={`/journals/${journal.id}`}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    >
                      Voir détails →
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Journals;
