import React, { useState } from 'react';
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
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useJournals } from '../context/JournalContext';
import AddPlaceModal from '../components/AddPlaceModal';
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
  const [showAddModal, setShowAddModal] = useState(false);

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
    if (allPlaces.length === 0) return [46.603354, 1.888334]; // Centre de la France

    const avgLat =
      allPlaces.reduce((sum, place) => sum + place.latitude, 0) /
      allPlaces.length;
    const avgLng =
      allPlaces.reduce((sum, place) => sum + place.longitude, 0) /
      allPlaces.length;

    return [avgLat, avgLng];
  };

  return (
    <Box>
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {/* Section principale - My places */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
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
                <Typography variant="h4" fontWeight={700}>
                  Mes lieux
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowAddModal(true)}
                  size={isMobile ? 'medium' : 'large'}
                  sx={{
                    borderRadius: 3,
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1, sm: 1.5 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    minWidth: { xs: '100%', sm: 'auto' },
                  }}
                >
                  Ajoute un lieu
                </Button>
              </Box>

              {/* Carte interactive intégrée */}
              <Box
                sx={{
                  height: { xs: 300, sm: 400, md: 500 },
                  borderRadius: 3,
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
                    {allPlaces.map((place) => (
                      <Marker
                        key={place.id}
                        position={[place.latitude, place.longitude]}
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
                    <LocationIcon
                      sx={{ fontSize: 48, color: 'text.secondary' }}
                    />
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

                {/* Bouton pour voir la carte en plein écran */}
                {allPlaces.length > 0 && (
                  <Button
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    onClick={() => navigate('journals/map')}
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      zIndex: 1000,
                      bgcolor: 'background.paper',
                      color: 'text.primary',
                      '&:hover': {
                        bgcolor: 'background.paper',
                        opacity: 0.9,
                      },
                    }}
                    size="small"
                  >
                    Voir la carte
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
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
            {/* Recent places */}
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h5" fontWeight={600}>
                    Lieux récents
                  </Typography>
                  <Button
                    size="small"
                    sx={{ color: 'info.main', fontWeight: 600 }}
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
                      No places added yet
                    </Typography>
                  </Box>
                ) : (
                  recentPlaces.slice(0, 2).map((place, index) => (
                    <Box key={place.id} sx={{ mb: index < 1 ? 3 : 0 }}>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ mb: 0.5 }}
                      >
                        {place.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {place.description}
                      </Typography>

                      <Grid container spacing={1}>
                        {place.photos.slice(0, 3).map((photo, photoIndex) => (
                          <Grid size={{ xs: 4 }} key={photoIndex}>
                            <Box
                              component="img"
                              src={photo}
                              alt={`${place.name} ${photoIndex + 1}`}
                              sx={{
                                width: '100%',
                                height: { xs: 60, sm: 80 },
                                objectFit: 'cover',
                                borderRadius: 2,
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                  transform: 'scale(1.05)',
                                },
                              }}
                              onClick={() => navigate(`/place/${place.id}`)}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Statistiques */}
            <Grid container spacing={2}>
              <Grid size={6}>
                <Card>
                  <CardContent
                    sx={{
                      textAlign: 'center',
                      py: { xs: 2, sm: 3 },
                      px: { xs: 1, sm: 2 },
                    }}
                  >
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                      Lieux visités
                    </Typography>
                    <Typography
                      variant="h2"
                      fontWeight={700}
                      color="primary.main"
                      sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}
                    >
                      {totalPlaces}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={6}>
                <Card>
                  <CardContent
                    sx={{
                      textAlign: 'center',
                      py: { xs: 2, sm: 3 },
                      px: { xs: 1, sm: 2 },
                    }}
                  >
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                      Pays visités
                    </Typography>
                    <Typography
                      variant="h2"
                      fontWeight={700}
                      color="primary.main"
                      sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}
                    >
                      {countries}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* Modal d'ajout de lieu */}
      <AddPlaceModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </Box>
  );
};

export default Home;
