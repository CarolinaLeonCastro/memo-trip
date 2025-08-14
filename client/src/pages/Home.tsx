import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  FavoriteBorder as FavoriteIcon,
  MenuBook as BookIcon,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useJournals } from '../context/JournalContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Home: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { journals } = useJournals();

  // Calculer les statistiques
  const allPlaces = journals.flatMap((journal) => journal.places);
  const totalPlaces = allPlaces.length;
  const countries = new Set(
    allPlaces.map((place) => {
      const parts = place.name.split(',');
      return parts[parts.length - 1]?.trim() || '';
    })
  ).size;

  const recentPlaces = allPlaces
    .sort(
      (a, b) =>
        new Date(b.dateVisited).getTime() - new Date(a.dateVisited).getTime()
    )
    .slice(0, 6);

  // Calculer le centre de la carte
  const getMapCenter = () => {
    const placesWithCoords = allPlaces.filter(
      (place) => place.latitude && place.longitude
    );
    if (placesWithCoords.length === 0) return [46.603354, 1.888334]; // Centre de la France

    const avgLat =
      placesWithCoords.reduce((sum, place) => sum + (place.latitude || 0), 0) /
      placesWithCoords.length;
    const avgLng =
      placesWithCoords.reduce((sum, place) => sum + (place.longitude || 0), 0) /
      placesWithCoords.length;

    return [avgLat, avgLng];
  };

  return (
    <Box>
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {/* Section principale - My places */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
              mb: 3,
            }}
          >
            <Typography variant="decorative" color="primary.main">
              Mes lieux
            </Typography>

            {/* Boutons côte à côte */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                width: { xs: '100%', sm: 'auto' },
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <Button
                variant="outlined"
                startIcon={<LocationIcon />}
                onClick={() => navigate('/journals/map')}
                size={isMobile ? 'medium' : 'large'}
                sx={{
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  minWidth: { xs: '100%', sm: 'auto' },
                  borderColor: 'text.secondary',
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.light',
                  },
                }}
              >
                Voir la carte
              </Button>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/place/new')}
                size={isMobile ? 'medium' : 'large'}
                sx={{
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  minWidth: { xs: '100%', sm: 'auto' },
                }}
              >
                Ajouter un lieu
              </Button>
            </Box>
          </Box>

          {/* Carte interactive intégrée */}
          <Box
            sx={{
              height: { xs: 300, sm: 400, md: 550 },
              borderRadius: 1,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'outline.main',
              position: 'relative',
            }}
          >
            {allPlaces.length > 0 ? (
              <MapContainer
                center={getMapCenter() as [number, number]}
                zoom={allPlaces.length === 1 ? 12 : 6}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={!isMobile}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {allPlaces
                  .filter((place) => place.latitude && place.longitude)
                  .map((place) => (
                    <Marker
                      key={place.id}
                      position={[place.latitude!, place.longitude!]}
                    >
                      <Popup>
                        <Box sx={{ p: 1, minWidth: 200 }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            sx={{ mb: 1 }}
                          >
                            {place.name}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {place.description}
                          </Typography>
                          {place.photos.length > 0 && (
                            <Box
                              component="img"
                              src={place.photos[0]}
                              alt={place.name}
                              sx={{
                                width: '100%',
                                height: 100,
                                objectFit: 'cover',
                                borderRadius: 1,
                                mt: 1,
                              }}
                            />
                          )}
                        </Box>
                      </Popup>
                    </Marker>
                  ))}
              </MapContainer>
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'surface.main',
                  gap: 2,
                }}
              >
                <LocationIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                <Typography
                  variant="h6"
                  color="text.secondary"
                  textAlign="center"
                >
                  Carte interactive
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  Ajouter des lieux pour les voir sur la carte
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Sidebar droite */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 2, sm: 3 },
            }}
          >
            {/* Statistiques en haut */}
            <Grid container spacing={2}>
              <Grid size={6}>
                <Card sx={{ bgcolor: '#E8F0FE', border: 'none' }}>
                  <CardContent
                    sx={{
                      textAlign: 'center',
                      py: { xs: 2, sm: 3 },
                      px: { xs: 1, sm: 2 },
                    }}
                  >
                    <Typography
                      variant="h2"
                      fontWeight={700}
                      color="#1976D2"
                      sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}
                    >
                      {totalPlaces}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="#1976D2"
                      fontWeight={500}
                    >
                      Lieux visités
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={6}>
                <Card sx={{ bgcolor: '#E8F5E8', border: 'none' }}>
                  <CardContent
                    sx={{
                      textAlign: 'center',
                      py: { xs: 2, sm: 3 },
                      px: { xs: 1, sm: 2 },
                    }}
                  >
                    <Typography
                      variant="h2"
                      fontWeight={700}
                      color="#2E7D32"
                      sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}
                    >
                      {countries}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="#2E7D32"
                      fontWeight={500}
                    >
                      Pays visités
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Recent places */}

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 0.5,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Lieux récents
              </Typography>
              <Button
                size="small"
                sx={{
                  color: '#4285F4',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
                onClick={() => navigate('/journals')}
              >
                Voir tous
              </Button>
            </Box>

            {recentPlaces.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <LocationIcon
                  sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Aucun lieu ajouté pour le moment
                </Typography>
              </Box>
            ) : (
              recentPlaces.slice(0, 3).map((place, index) => (
                <Box key={place.id} sx={{ mb: index < 0.5 ? 0.5 : 0 }}>
                  <Card
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: '1px solid #f0f0f0',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      },
                    }}
                    onClick={() => navigate(`/place/${place.id}`)}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'flex-start',
                      }}
                    >
                      {/* Image du lieu */}
                      <Box
                        component="img"
                        src={place.photos[0] || '/placeholder-image.jpg'}
                        alt={place.name}
                        sx={{
                          width: 100,
                          height: 100,
                          objectFit: 'fill',
                          borderRadius: 0.5,
                          flexShrink: 0,
                        }}
                      />

                      {/* Informations du lieu */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          sx={{
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: '#1a1a1a',
                            fontSize: '1rem',
                          }}
                        >
                          {place.name.split(',')[0]}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 1.5,
                            color: '#666',
                            fontSize: '0.875rem',
                          }}
                        >
                          {place.name.includes(',')
                            ? place.name.split(',').slice(1).join(',').trim()
                            : 'Italy'}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: '0.8rem',
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {place.description || 'Aucune description fournie.'}
                        </Typography>
                      </Box>

                      {/* Actions à droite */}
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          gap: 1.5,
                        }}
                      >
                        {/* Badge de statut */}
                        <Box
                          sx={{
                            bgcolor: '#E8F5E8',
                            color: '#2E7D32',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 4,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textTransform: 'none',
                          }}
                        >
                          Visité
                        </Box>

                        {/* Date avec icône */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <CalendarIcon
                            sx={{
                              fontSize: '0.875rem',
                              color: 'text.secondary',
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.75rem' }}
                          >
                            {new Date(place.dateVisited).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                year: 'numeric',
                              }
                            )}
                          </Typography>
                        </Box>

                        {/* Icône favoris */}
                        <Box
                          sx={{
                            cursor: 'pointer',
                            '&:hover': { transform: 'scale(1.1)' },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Action pour favoris
                          }}
                        >
                          <FavoriteIcon
                            sx={{
                              fontSize: '1.2rem',
                              color: 'text.secondary',
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              ))
            )}

            {/* Actions rapides */}
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Actions rapides
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<BookIcon />}
                  sx={{
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: 'text.secondary',
                    color: 'text.primary',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'primary.light',
                    },
                  }}
                  onClick={() => navigate('/journals')}
                >
                  Mes journaux
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
