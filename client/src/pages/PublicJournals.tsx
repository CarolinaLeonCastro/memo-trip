import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Pagination,
  Chip,
  Avatar,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Place as PlaceIcon,
  Photo as PhotoIcon,
  CalendarToday as CalendarIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { publicService, type PublicJournal } from '../services/public.service';

const PublicJournals: React.FC = () => {
  const navigate = useNavigate();
  const [journals, setJournals] = useState<PublicJournal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [stats, setStats] = useState<{
    totalJournals: number;
    totalPlaces: number;
  } | null>(null);

  useEffect(() => {
    loadJournals();
    loadStats();
  }, [page, search]);

  const loadJournals = async () => {
    try {
      setLoading(true);
      const response = await publicService.getPublicJournals({
        page,
        limit: 12,
        search: search || undefined,
      });
      setJournals(response.journals);
      setTotalPages(response.pagination.pages);
      setError(null);
    } catch (err) {
      console.error('Error loading public journals:', err);
      setError('Erreur lors du chargement des journaux publics');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await publicService.getPublicStats();
      setStats(statsData.stats);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleViewJournal = (journalId: string) => {
    navigate(`/public/journals/${journalId}`);
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
    const end = new Date(endDate).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    return `${start} - ${end}`;
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Barre de navigation publique */}
      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
            <Typography variant="h6" component="div">
              MemoTrip - Journaux Publics
            </Typography>
          </Box>
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
        {/* En-tête et statistiques */}
        <Box mb={4}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Découvrez les voyages de notre communauté
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            align="center"
            paragraph
          >
            Explorez les journaux de voyage partagés publiquement par nos
            utilisateurs
          </Typography>

          {stats && (
            <Box display="flex" justifyContent="center" gap={4} mt={3}>
              <Box textAlign="center">
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {stats.totalJournals}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Journaux partagés
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h3" color="secondary" fontWeight="bold">
                  {stats.totalPlaces}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lieux découverts
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Barre de recherche */}
        <Box mb={4}>
          <TextField
            fullWidth
            placeholder="Rechercher des journaux par titre, description ou tags..."
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 600, mx: 'auto', display: 'block' }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Liste des journaux */}
        {loading && journals.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {journals.map((journal) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={journal._id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {journal.cover_image && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={journal.cover_image}
                        alt={journal.title}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        component="h2"
                        gutterBottom
                        noWrap
                      >
                        {journal.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {journal.description?.substring(0, 100)}
                        {journal.description &&
                          journal.description.length > 100 &&
                          '...'}
                      </Typography>

                      {/* Informations sur l'auteur */}
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Avatar
                          src={journal.user_id.avatar?.url}
                          sx={{ width: 24, height: 24 }}
                        >
                          {journal.user_id.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" color="text.secondary">
                          par {journal.user_id.name}
                        </Typography>
                      </Box>

                      {/* Dates du voyage */}
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <CalendarIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {formatDateRange(
                            journal.start_date,
                            journal.end_date
                          )}
                        </Typography>
                      </Box>

                      {/* Statistiques */}
                      <Box display="flex" gap={2} mb={2}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <PlaceIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {journal.stats.total_places} lieux
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <PhotoIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {journal.stats.total_photos} photos
                          </Typography>
                        </Box>
                      </Box>

                      {/* Tags */}
                      {journal.tags && journal.tags.length > 0 && (
                        <Box display="flex" flexWrap="wrap" gap={0.5}>
                          {journal.tags.slice(0, 3).map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          ))}
                          {journal.tags.length > 3 && (
                            <Chip
                              label={`+${journal.tags.length - 3}`}
                              size="small"
                              variant="outlined"
                              color="default"
                            />
                          )}
                        </Box>
                      )}
                    </CardContent>

                    <CardActions>
                      <Button
                        startIcon={<ViewIcon />}
                        onClick={() => handleViewJournal(journal._id)}
                        fullWidth
                        variant="contained"
                      >
                        Voir le journal
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {journals.length === 0 && !loading && (
              <Box textAlign="center" py={8}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Aucun journal trouvé
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {search
                    ? "Essayez avec d'autres mots-clés de recherche"
                    : 'Aucun journal public disponible pour le moment'}
                </Typography>
              </Box>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default PublicJournals;
