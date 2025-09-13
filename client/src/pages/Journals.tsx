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
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
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

  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
      <Container maxWidth="xl" sx={{ py: 2 }}>
        {/* Header responsive */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4,
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, md: 0 },
          }}
        >
          {/* Bouton retour - aligné à gauche sur desktop, centré sur mobile */}
          <Box
            sx={{
              display: 'flex',
              alignSelf: { xs: 'stretch', md: 'flex-start' },
              justifyContent: { xs: 'flex-start', md: 'flex-start' },
            }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/')}
              sx={{
                minWidth: 'auto',
                px: { xs: 1, md: 2 },
              }}
              size={isMobile ? 'small' : 'medium'}
            >
              {isMobile ? '' : 'Retour'}
            </Button>
          </Box>

          {/* Titre central responsive */}
          <Box
            sx={{
              textAlign: 'center',
              flex: { xs: '0 1 auto', md: 1 },
              mx: { xs: 0, md: 2 },
              order: { xs: 1, md: 0 },
            }}
          >
            <Typography
              variant={isMobile ? 'h5' : 'h3'}
              fontWeight="bold"
              sx={{
                color: 'primary.main',
                mb: 0.5,
                fontFamily: '"Chau Philomene One", cursive',
                fontSize: {
                  xs: '1.5rem',
                  sm: '2rem',
                  md: '2.5rem',
                  lg: '3rem',
                },
                lineHeight: {
                  xs: 1.2,
                  md: 1.167,
                },
              }}
            >
              {isMobile ? 'Mes Journaux' : 'Mes Journaux de Voyage'}
            </Typography>
            <Typography
              variant={isMobile ? 'body2' : 'subtitle1'}
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: '0.875rem',
                  md: '1rem',
                },
              }}
            >
              {isMobile
                ? 'Gérez vos souvenirs de voyage'
                : 'Découvrez et gérez tous vos souvenirs de voyage'}
            </Typography>
          </Box>

          {/* Bouton nouveau journal responsive */}
          <Box
            sx={{
              display: 'flex',
              alignSelf: { xs: 'stretch', md: 'flex-start' },
              justifyContent: { xs: 'center', md: 'flex-end' },
              order: { xs: 2, md: 0 },
            }}
          >
            <Button
              component={Link}
              to="/journals/new"
              variant="contained"
              startIcon={!isMobile && <AddIcon />}
              size={isMobile ? 'small' : 'medium'}
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.error.main} 30%, ${theme.palette.error.light} 90%)`,
                px: { xs: 2, md: 3 },
                py: { xs: 1, md: 1.5 },
                fontSize: {
                  xs: '0.875rem',
                  md: '1rem',
                },
                boxShadow: '0 4px 20px rgba(79, 134, 247, 0.3)',
                '&:hover': {
                  bgcolor: '#3A73E0',
                  boxShadow: '0 6px 24px rgba(79, 134, 247, 0.4)',
                },
                minWidth: { xs: 120, md: 'auto' },
              }}
            >
              {isMobile ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AddIcon sx={{ fontSize: '1.1rem' }} />
                  Nouveau
                </Box>
              ) : (
                'Nouveau Journal'
              )}
            </Button>
          </Box>
        </Box>

        {/* Statistiques responsive */}
        <Grid container spacing={3} sx={{ mb: 4, mt: 2 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <DiscoverStatsCard
              icon={
                <MenuBookIcon
                  sx={{ fontSize: { xs: 20, md: 24 }, color: '#4F86F7' }}
                />
              }
              label="Journaux créés"
              value={totalJournals}
              color="79, 134, 247"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <DiscoverStatsCard
              icon={
                <LocationIcon
                  sx={{ fontSize: { xs: 20, md: 24 }, color: 'warning.main' }}
                />
              }
              label="Lieux"
              value={totalPlaces}
              color="255, 138, 0"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <DiscoverStatsCard
              icon={
                <PhotoIcon
                  sx={{ fontSize: { xs: 20, md: 24 }, color: '#4F86F7' }}
                />
              }
              label="Photos partagées"
              value={totalPhotos}
              color="79, 134, 247"
            />
          </Grid>
        </Grid>

        {/* Search Bar responsive */}
        <Box sx={{ mb: 4, maxWidth: { xs: '100%', md: 600 }, mx: 'auto' }}>
          <TextField
            fullWidth
            placeholder={
              isMobile ? 'Rechercher...' : 'Rechercher dans vos journaux...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size={isMobile ? 'small' : 'medium'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: '#9CA3AF',
                      fontSize: { xs: '1.2rem', md: '1.5rem' },
                    }}
                  />
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
                fontSize: {
                  xs: '0.875rem',
                  md: '1rem',
                },
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

        {/* Journals Grid responsive */}
        {filteredJournals.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: { xs: 4, md: 8 },
              border: '2px dashed',
              borderColor:
                theme.palette.mode === 'dark' ? 'grey.700' : 'grey.300',
              borderRadius: 2,
              bgcolor:
                theme.palette.mode === 'dark' ? 'background.paper' : 'white',
            }}
          >
            <MenuBookIcon
              sx={{
                fontSize: { xs: 48, md: 64 },
                color: 'grey.400',
                mb: 2,
              }}
            />
            <Typography
              variant={isMobile ? 'subtitle1' : 'h6'}
              color="text.secondary"
              gutterBottom
            >
              {searchTerm ? 'Aucun résultat trouvé' : 'Aucun journal créé'}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, px: { xs: 2, md: 0 } }}
            >
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
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  background: `linear-gradient(45deg, ${theme.palette.error.main} 30%, ${theme.palette.error.light} 90%)`,
                  px: { xs: 2, md: 3 },
                  py: { xs: 1, md: 1.5 },
                }}
              >
                {isMobile ? 'Créer journal' : 'Créer mon premier journal'}
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {filteredJournals.map((journal) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={journal.id}>
                <Card
                  sx={{
                    borderRadius: 1,
                    overflow: 'hidden',
                    boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? 'background.paper'
                        : 'white',
                    border: 'none',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    '&:hover': {
                      boxShadow: '0 12px 40px rgba(79, 134, 247, 0.15)',
                      transform: isMobile
                        ? 'none'
                        : 'translateY(-8px) scale(1.02)',
                    },
                    '&:hover .journal-image': {
                      transform: isMobile ? 'none' : 'scale(1.1)',
                    },
                    '&:hover .journal-overlay': {
                      opacity: 0.3,
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      height: { xs: 200, sm: 250, md: 280 },
                    }}
                  >
                    <CardMedia
                      component="img"
                      className="journal-image"
                      sx={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        transition:
                          'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      image={
                        journal.mainPhoto ||
                        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800'
                      }
                      alt={journal.title}
                    />
                    {/* Gradient Overlay */}
                    <Box
                      className="journal-overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
                        opacity: 0.7,
                        transition: 'opacity 0.4s ease',
                      }}
                    />
                    {/* Action Buttons */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: { xs: 12, md: 16 },
                        right: { xs: 12, md: 16 },
                        display: 'flex',
                        gap: 1,
                        opacity: { xs: 1, md: 0 },
                        transition: 'opacity 0.3s ease',
                        '.MuiCard-root:hover &': {
                          opacity: 1,
                        },
                      }}
                    >
                      <IconButton
                        component={Link}
                        to={`/journals/${journal.id}/edit`}
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          backdropFilter: 'blur(12px)',
                          color: '#4F86F7',
                          '&:hover': {
                            backgroundColor: '#4F86F7',
                            color: 'white',
                            transform: 'scale(1.1)',
                          },
                          width: { xs: 32, md: 36 },
                          height: { xs: 32, md: 36 },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <EditIcon sx={{ fontSize: { xs: 16, md: 18 } }} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(journal.id, journal.title)}
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          backdropFilter: 'blur(12px)',
                          color: 'error.main',
                          '&:hover': {
                            backgroundColor: 'error.main',
                            color: 'white',
                            transform: 'scale(1.1)',
                          },
                          width: { xs: 32, md: 36 },
                          height: { xs: 32, md: 36 },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: { xs: 16, md: 18 } }} />
                      </IconButton>
                    </Box>
                    {/* Title Overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: { xs: 2, md: 3 },
                      }}
                    >
                      <Typography
                        variant={isMobile ? 'h6' : 'h5'}
                        fontWeight="700"
                        sx={{
                          color: 'white',
                          mb: 1,
                          textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                          cursor: 'pointer',
                          fontSize: {
                            xs: '1.1rem',
                            sm: '1.25rem',
                            md: '1.5rem',
                          },
                          lineHeight: 1.2,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                        onClick={() => navigate(`/journals/${journal.id}`)}
                      >
                        {journal.title}
                      </Typography>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <LocationIcon
                          sx={{
                            fontSize: { xs: '1rem', md: '1.1rem' },
                            color: '#FF6B6B',
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255,255,255,0.9)',
                            fontWeight: 500,
                            fontSize: {
                              xs: '0.8rem',
                              md: '0.875rem',
                            },
                          }}
                        >
                          {journal.places.length} lieu
                          {journal.places.length > 1 ? 'x' : ''}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <CardContent
                    sx={{
                      p: { xs: 2, md: 3 },
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      title={journal.description}
                      sx={{
                        mb: 2,
                        lineHeight: 1.6,
                        fontSize: { xs: '0.8rem', md: '0.875rem' },
                        display: '-webkit-box',
                        WebkitLineClamp: { xs: 2, md: 3 },
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        minHeight: { xs: '2.5rem', md: '4rem' },
                      }}
                    >
                      {journal.description.substring(0, isMobile ? 80 : 100)}
                      {journal.description.length > (isMobile ? 80 : 100) &&
                        '...'}
                    </Typography>

                    {/* Date Range */}
                    <Box sx={{ mb: 2.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color:
                            theme.palette.mode === 'dark' ? '#fff' : '#2E3A59',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          fontSize: {
                            xs: '0.8rem',
                            md: '0.875rem',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: { xs: 6, md: 8 },
                            height: { xs: 6, md: 8 },
                            borderRadius: '50%',
                            bgcolor: '#4F86F7',
                          }}
                        />
                        {formatWithOptions(
                          { locale: fr },
                          isMobile ? 'dd MMM' : 'dd MMM'
                        )(journal.startDate)}{' '}
                        -{' '}
                        {formatWithOptions(
                          { locale: fr },
                          isMobile ? 'dd MMM yy' : 'dd MMM yyyy'
                        )(journal.endDate)}
                      </Typography>
                    </Box>

                    {/* Tags */}
                    <Box sx={{ mb: 3 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 0.5,
                          flexWrap: 'wrap',
                          minHeight: { xs: '24px', md: '32px' },
                          alignItems: 'flex-start',
                        }}
                      >
                        {journal.tags && journal.tags.length > 0 ? (
                          journal.tags
                            .slice(0, isMobile ? 2 : 3)
                            .map((tag, index) => (
                              <Chip
                                key={index}
                                label={tag}
                                size="small"
                                sx={{
                                  backgroundColor: [
                                    '#E3F2FD', // Bleu clair
                                    '#F3E5F5', // Violet clair
                                    '#E8F5E8', // Vert clair
                                    '#FFF3E0', // Orange clair
                                    '#FCE4EC', // Rose clair
                                  ][index % 5],
                                  color: [
                                    '#1976D2', // Bleu foncé
                                    '#7B1FA2', // Violet foncé
                                    '#2E7D32', // Vert foncé
                                    '#E65100', // Orange foncé
                                    '#C2185B', // Rose foncé
                                  ][index % 5],
                                  fontWeight: 600,
                                  fontSize: { xs: '0.65rem', md: '0.75rem' },
                                  height: { xs: 24, md: 28 },
                                  border: 'none',
                                  '&:hover': {
                                    backgroundColor: [
                                      '#BBDEFB',
                                      '#E1BEE7',
                                      '#C8E6C9',
                                      '#FFE0B2',
                                      '#F8BBD9',
                                    ][index % 5],
                                  },
                                }}
                              />
                            ))
                        ) : (
                          <Chip
                            label="Sans catégorie"
                            size="small"
                            sx={{
                              backgroundColor: '#F5F5F5',
                              color: '#757575',
                              fontWeight: 500,
                              fontSize: { xs: '0.65rem', md: '0.75rem' },
                              height: { xs: 24, md: 28 },
                            }}
                          />
                        )}
                        {journal.tags &&
                          journal.tags.length > (isMobile ? 2 : 3) && (
                            <Chip
                              label={`+${journal.tags.length - (isMobile ? 2 : 3)}`}
                              size="small"
                              sx={{
                                backgroundColor: '#F5F5F5',
                                color: '#757575',
                                fontWeight: 600,
                                fontSize: { xs: '0.65rem', md: '0.75rem' },
                                height: { xs: 24, md: 28 },
                              }}
                            />
                          )}
                      </Box>
                    </Box>

                    {/* Statistiques d'engagement */}
                    <Box
                      sx={{
                        mt: 'auto',
                        pt: { xs: 2, md: 3 },
                        borderTop: '1px solid',
                        borderColor:
                          theme.palette.mode === 'dark'
                            ? 'grey.800'
                            : '#f0f0f0',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: { xs: 2, sm: 0 },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            gap: { xs: 2, md: 3 },
                            order: { xs: 2, sm: 1 },
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              px: { xs: 1, md: 1.5 },
                              py: 0.5,
                              borderRadius: 1,
                              backgroundColor: '#E3F2FD',
                            }}
                          >
                            <PhotoIcon
                              sx={{
                                fontSize: { xs: '0.9rem', md: '1rem' },
                                color: '#4F86F7',
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 600,
                                color: '#4F86F7',
                                fontSize: { xs: '0.7rem', md: '0.75rem' },
                              }}
                            >
                              {journal.places.reduce(
                                (acc, place) => acc + place.photos.length,
                                0
                              )}{' '}
                              {isMobile ? '' : 'photos'}
                            </Typography>
                          </Box>
                        </Box>

                        <Button
                          component={Link}
                          to={`/journals/${journal.id}`}
                          variant="contained"
                          size={isMobile ? 'small' : 'medium'}
                          sx={{
                            fontWeight: '600',
                            backgroundColor: '#4F86F7',
                            color: 'white',
                            px: { xs: 2, md: 2.5 },
                            py: { xs: 0.5, md: 1 },
                            textTransform: 'none',
                            fontSize: { xs: '0.8rem', md: '0.875rem' },
                            boxShadow: '0 4px 12px rgba(79, 134, 247, 0.3)',
                            order: { xs: 1, sm: 2 },
                            alignSelf: { xs: 'stretch', sm: 'auto' },
                            '&:hover': {
                              backgroundColor: '#3A73E0',
                              boxShadow: '0 6px 20px rgba(79, 134, 247, 0.4)',
                              transform: isMobile ? 'none' : 'translateY(-1px)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {isMobile ? 'Voir' : 'Voir le journal'}
                        </Button>
                      </Box>
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
