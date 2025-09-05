import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Container,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Favorite as FavoriteIcon,
  Photo as PhotoIcon,
  ArrowBack as ArrowBackIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';

import { fr } from 'date-fns/locale';
import { formatWithOptions } from 'date-fns/fp';
import { useJournals } from '../context/JournalContext';
import { DiscoverStatsCard } from '../components/discover/DiscoverStatsCard';

const Journals: React.FC = () => {
  const { journals, deleteJournal } = useJournals();
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJournals = journals.filter(
    (journal) =>
      journal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journal.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcul des statistiques
  const totalJournals = journals.length;
  const totalPlaces = journals.reduce(
    (acc, journal) => acc + journal.places.length,
    0
  );
  const totalPhotos = journals.reduce(
    (acc, journal) =>
      acc +
      journal.places.reduce(
        (placeAcc, place) => placeAcc + place.photos.length,
        0
      ),
    0
  );

  const handleDelete = async (id: string, title: string) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer le journal "${title}" ?`
      )
    ) {
      try {
        await deleteJournal(id);
        // Le journal sera automatiquement supprimé de la liste après le rechargement
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du journal. Veuillez réessayer.');
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor:
          theme.palette.mode === 'dark' ? 'background.default' : '#F8FAFC',
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 4,
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ color: 'text.secondary' }}
          >
            Retour
          </Button>

          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                color: theme.palette.mode === 'dark' ? '#fff' : 'primary.main',
                mb: 0.5,
                fontFamily: '"Chau Philomene One", cursive',
              }}
            >
              Mes Journaux de Voyage
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Découvrez et gérez tous vos souvenirs de voyage
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/journals/new"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.error.main} 30%, ${theme.palette.error.light} 90%)`,
              px: 3,
              py: 1.5,
              boxShadow: '0 4px 20px rgba(79, 134, 247, 0.3)',
              '&:hover': {
                bgcolor: '#3A73E0',
                boxShadow: '0 6px 24px rgba(79, 134, 247, 0.4)',
              },
            }}
          >
            Nouveau Journal
          </Button>
        </Box>

        {/* Statistiques */}
        <Grid container spacing={3} sx={{ mb: 4, mt: 2 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <DiscoverStatsCard
              icon={<MenuBookIcon sx={{ fontSize: 24, color: '#4F86F7' }} />}
              label="Journaux créés"
              value={totalJournals}
              color="79, 134, 247"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <DiscoverStatsCard
              icon={
                <LocationIcon sx={{ fontSize: 24, color: 'warning.main' }} />
              }
              label="Lieux visités"
              value={totalPlaces}
              color="255, 138, 0"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <DiscoverStatsCard
              icon={<PhotoIcon sx={{ fontSize: 24, color: '#4F86F7' }} />}
              label="Photos partagées"
              value={totalPhotos}
              color="79, 134, 247"
            />
          </Grid>
        </Grid>

        {/* Search Bar */}
        <Box sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          <TextField
            fullWidth
            placeholder="Rechercher dans vos journaux..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#9CA3AF' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                bgcolor:
                  theme.palette.mode === 'dark' ? 'background.paper' : 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0',
                '&:hover': {
                  boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
                },
                '&.Mui-focused': {
                  boxShadow: '0 6px 24px rgba(79, 134, 247, 0.2)',
                  borderColor: '#4F86F7',
                },
              },
            }}
          />
        </Box>

        {/* Journals Grid */}
        {filteredJournals.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              border: '2px dashed',
              borderColor:
                theme.palette.mode === 'dark' ? 'grey.700' : 'grey.300',
              borderRadius: 2,
              bgcolor:
                theme.palette.mode === 'dark' ? 'background.paper' : 'white',
            }}
          >
            <MenuBookIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchTerm ? 'Aucun résultat trouvé' : 'Aucun journal créé'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {searchTerm
                ? "Essayez avec d'autres mots-clés"
                : 'Commencez votre aventure en créant votre premier journal de voyage'}
            </Typography>
            {!searchTerm && (
              <Button
                component={Link}
                to="/journals/new"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  bgcolor: '#4F86F7',
                  color: 'white',
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  boxShadow: '0 4px 20px rgba(79, 134, 247, 0.3)',
                  '&:hover': {
                    bgcolor: '#3A73E0',
                    boxShadow: '0 6px 24px rgba(79, 134, 247, 0.4)',
                  },
                }}
              >
                Créer mon premier journal
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredJournals.map((journal) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={journal.id}>
                <Card
                  sx={{
                    borderRadius: 1,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? 'background.paper'
                        : 'white',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'grey.800' : '#f0f0f0'}`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={
                        journal.mainPhoto ||
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
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          backdropFilter: 'blur(8px)',
                          '&:hover': { backgroundColor: 'white' },
                          width: 32,
                          height: 32,
                        }}
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(journal.id, journal.title)}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          backdropFilter: 'blur(8px)',
                          color: 'error.main',
                          '&:hover': { backgroundColor: 'white' },
                          width: 32,
                          height: 32,
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </Box>

                  <CardContent
                    sx={{
                      p: 3,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="700"
                      sx={{
                        fontSize: '1.1rem',
                        color:
                          theme.palette.mode === 'dark' ? '#fff' : '#2E3A59',
                        mb: 1,
                        lineHeight: 1.3,
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate(`/journals/${journal.id}`)}
                    >
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
                      title={journal.description}
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        mb: 2,
                        flexGrow: 1,
                      }}
                    >
                      {journal.description.substring(0, 100)}
                      {journal.description.length > 100 && '...'}
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
                      {journal.tags && journal.tags.length > 0 ? (
                        journal.tags.slice(0, 3).map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
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
                          size="small"
                          sx={{
                            backgroundColor: 'grey.100',
                            color: 'grey.600',
                            fontWeight: 500,
                          }}
                        />
                      )}
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
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <FavoriteIcon
                            sx={{ fontSize: '1rem', color: 'error.main' }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            24
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <PhotoIcon
                            sx={{ fontSize: '1rem', color: '#4F86F7' }}
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
                        variant="outlined"
                        size="small"
                        sx={{
                          fontWeight: '600',
                          borderColor: '#4F86F7',
                          color: '#4F86F7',
                          '&:hover': {
                            bgcolor: '#4F86F7',
                            color: 'white',
                            borderColor: '#4F86F7',
                          },
                        }}
                      >
                        Voir le journal
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Journals;
