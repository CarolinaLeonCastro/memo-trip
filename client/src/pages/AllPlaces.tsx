import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Map as MapIcon,
  FavoriteBorder as FavoriteIcon,
  CalendarToday as CalendarIcon,
  Close as CloseIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Place as PlaceIcon,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useJournals } from '../context/JournalContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import theme from '../theme';
import BookIcon from '@mui/icons-material/Book';

// Component to render rating stars
const RatingStars = ({ rating }: { rating?: number }) => {
  if (!rating) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          sx={{
            fontSize: '1rem',
            color: star <= rating ? '#ffc107' : '#e0e0e0',
          }}
        />
      ))}
      <Typography variant="body2" sx={{ ml: 0.5, fontSize: '0.875rem' }}>
        {rating}/5
      </Typography>
    </Box>
  );
};

// Fix for default markers in react-leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Icônes personnalisées pour les marqueurs
const visitedIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const toVisitIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Coordonnées GPS pour les lieux
const placeCoordinates: { [key: string]: { lat: number; lng: number } } = {
  'Coliseum, Rome, Italy': { lat: 41.8902, lng: 12.4922 },
  'Eiffel Tower, Paris, France': { lat: 48.8584, lng: 2.2945 },
  'Sagrada Familia, Barcelona, Spain': { lat: 41.4036, lng: 2.1744 },
  'Santorini, Greece': { lat: 36.3932, lng: 25.4615 },
  'Neuschwanstein Castle, Germany': { lat: 47.5576, lng: 10.7498 },
  'Machu Picchu, Peru': { lat: -13.1631, lng: -72.545 },
};

// Fonction utilitaire pour obtenir les coordonnées d'un lieu
const getPlaceCoordinates = (place: {
  latitude?: number;
  longitude?: number;
  name: string;
}): { lat: number; lng: number } | null => {
  // Utiliser les coordonnées directes si disponibles
  if (place.latitude && place.longitude) {
    return { lat: place.latitude, lng: place.longitude };
  }
  // Sinon utiliser l'objet placeCoordinates comme fallback
  return placeCoordinates[place.name] || null;
};

const AllPlaces: React.FC = () => {
  const navigate = useNavigate();
  const { journals } = useJournals();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState<{
    id: string;
    name: string;
    description?: string;
    photos: string[];
    dateVisited: Date;
    journalTitle: string;
    journalId: string;
    rating?: number;
    latitude?: number;
    longitude?: number;
  } | null>(null);
  const [showGlobalMap, setShowGlobalMap] = useState(false);

  // Collecter tous les lieux de tous les journaux
  const allPlaces = journals.flatMap((journal) =>
    journal.places.map((place) => ({
      ...place,
      journalTitle: journal.title,
      journalId: journal.id,
    }))
  );

  // Filtrer les lieux
  const filteredPlaces = allPlaces.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'visited' && place.photos.length > 0) ||
      (statusFilter === 'to-visit' && place.photos.length === 0);
    const country = place.name.split(',').pop()?.trim() || '';
    const matchesCountry =
      countryFilter === 'all' ||
      country.toLowerCase().includes(countryFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesCountry;
  });

  // Statistiques
  const totalPlaces = allPlaces.length;
  const visitedPlaces = allPlaces.filter(
    (place) => place.photos.length > 0
  ).length;
  const toVisitPlaces = totalPlaces - visitedPlaces;
  const uniqueCountries = new Set(
    allPlaces.map((place) => {
      const parts = place.name.split(',');
      return parts[parts.length - 1]?.trim() || '';
    })
  ).size;

  // Centre de la carte globale
  const getGlobalMapCenter = (): [number, number] => {
    if (allPlaces.length === 0) return [46.603354, 1.888334];

    const placesWithCoords = allPlaces.filter((place) =>
      getPlaceCoordinates(place)
    );
    if (placesWithCoords.length === 0) return [46.603354, 1.888334];

    const avgLat =
      placesWithCoords.reduce((sum, place) => {
        const coords = getPlaceCoordinates(place);
        return sum + (coords?.lat || 0);
      }, 0) / placesWithCoords.length;

    const avgLng =
      placesWithCoords.reduce((sum, place) => {
        const coords = getPlaceCoordinates(place);
        return sum + (coords?.lng || 0);
      }, 0) / placesWithCoords.length;

    return [avgLat, avgLng];
  };

  const openPlaceMap = (place: {
    id: string;
    name: string;
    description?: string;
    photos: string[];
    dateVisited: Date;
    journalTitle: string;
    journalId: string;
  }) => {
    setSelectedPlace(place);
  };

  const closePlaceMap = () => {
    setSelectedPlace(null);
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography
              variant="h3"
              color="primary.main"
              sx={{ fontFamily: '"Chau Philomene One", cursive', mb: 1 }}
            >
              Tous mes lieux
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {totalPlaces} visites • {visitedPlaces} à visiter
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<MapIcon />}
          onClick={() => setShowGlobalMap(true)}
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.error.main} 30%, ${theme.palette.error.light} 90%)`,
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.error.dark} 30%, ${theme.palette.error.main} 90%)`,
            },
          }}
        >
          Voir tous sur la carte
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
              {totalPlaces}
            </Typography>
            <Typography variant="body1" color="#2563EB" fontWeight={500}>
              Total lieux
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
              {visitedPlaces}
            </Typography>
            <Typography variant="body1" color="#16A34A" fontWeight={500}>
              Visités
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
              {toVisitPlaces}
            </Typography>
            <Typography variant="body1" color="#EA580C" fontWeight={500}>
              À visiter
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
              {uniqueCountries}
            </Typography>
            <Typography variant="body1" color="#8B5CF6" fontWeight={500}>
              Pays
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Filtres */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'nowrap' }}>
        <TextField
          placeholder="Rechercher un lieu, ville ou pays..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ width: '50%' }}
        />

        <TextField
          select
          label=""
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ width: '25%' }}
        >
          <MenuItem
            value="all"
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'tertiary.main',
              },
            }}
          >
            Tous les lieux
          </MenuItem>
          <MenuItem
            value="visited"
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'tertiary.main',
              },
            }}
          >
            Visités
          </MenuItem>
          <MenuItem
            value="to-visit"
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'tertiary.main',
              },
            }}
          >
            À visiter
          </MenuItem>
        </TextField>

        <TextField
          select
          label=""
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          sx={{ width: '25%' }}
        >
          <MenuItem
            value="all"
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'tertiary.main',
              },
            }}
          >
            Tous les pays
          </MenuItem>
          {Array.from(
            new Set(
              allPlaces.map((place) => {
                const parts = place.name.split(',');
                return parts[parts.length - 1]?.trim() || '';
              })
            )
          ).map((country) => (
            <MenuItem
              key={country}
              value={country}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'tertiary.main',
                },
              }}
            >
              {country}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Grille des lieux */}
      {filteredPlaces.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <LocationIcon
              sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
            />
            <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
              Aucun lieu trouvé
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Essayez avec d'autres filtres ou mots-clés
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredPlaces.map((place) => {
            const isVisited = place.photos.length > 0;
            const coords = getPlaceCoordinates(place);

            return (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={place.id}>
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
                        place.photos[0] ||
                        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800'
                      }
                      alt={place.name}
                    />

                    {/* Badge de statut */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: isVisited ? '#E8F5E8' : '#FFF3E0',
                        color: isVisited ? '#2E7D32' : '#F57C00',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 4,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {isVisited ? 'Visité' : 'À visiter'}
                    </Box>

                    {/* Icône favoris */}
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        bgcolor: 'rgba(255,255,255,0.9)',
                        '&:hover': { bgcolor: 'white' },
                      }}
                      size="small"
                    >
                      <FavoriteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
                      {place.name.split(',')[0]}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {place.name.includes(',')
                        ? place.name.split(',').slice(1).join(',').trim()
                        : ''}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, flexGrow: 1 }}
                    >
                      {place.description ||
                        'Ancient amphitheatre in the centre of Rome, built of limestone, tuff, and brick-faced concrete'}
                    </Typography>

                    {/* Rating */}
                    {place.rating && (
                      <Box sx={{ mb: 2 }}>
                        <RatingStars rating={place.rating} />
                      </Box>
                    )}

                    {/* Coordonnées GPS */}
                    {coords && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          mb: 2,
                        }}
                      >
                        <LocationIcon
                          sx={{ fontSize: '0.875rem', color: 'text.secondary' }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                        </Typography>
                      </Box>
                    )}

                    {/* Date de visite */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        mb: 2,
                      }}
                    >
                      <CalendarIcon
                        sx={{ fontSize: '0.875rem', color: 'text.secondary' }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(place.dateVisited).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            year: 'numeric',
                          }
                        )}
                      </Typography>
                    </Box>

                    {/* Tags */}
                    <Box
                      sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}
                    >
                      <Chip
                        label="Histoire"
                        size="small"
                        variant="filled"
                        sx={{
                          backgroundColor: 'tertiary.main',
                        }}
                      />
                      <Chip
                        label="Architecture"
                        size="small"
                        variant="filled"
                        sx={{
                          backgroundColor: 'tertiary.main',
                        }}
                      />
                      <Chip
                        label="UNESCO"
                        size="small"
                        variant="filled"
                        sx={{
                          backgroundColor: 'tertiary.main',
                        }}
                      />
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                      <Button
                        variant="outlined"
                        startIcon={<LocationIcon />}
                        onClick={() => openPlaceMap(place)}
                        size="small"
                        sx={{
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
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<BookIcon />}
                        sx={{
                          fontWeight: 600,
                          color: 'primary.main',
                          '&:hover': {
                            color: 'primary.dark',
                          },
                        }}
                      >
                        Journaux
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Modal carte individuelle */}
      <Dialog
        open={!!selectedPlace}
        onClose={closePlaceMap}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            {selectedPlace?.name}
          </Typography>
          <IconButton onClick={closePlaceMap}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: 400 }}>
          {selectedPlace && getPlaceCoordinates(selectedPlace) && (
            <MapContainer
              center={[
                getPlaceCoordinates(selectedPlace)!.lat,
                getPlaceCoordinates(selectedPlace)!.lng,
              ]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={[
                  getPlaceCoordinates(selectedPlace)!.lat,
                  getPlaceCoordinates(selectedPlace)!.lng,
                ]}
                icon={
                  selectedPlace.photos.length > 0 ? visitedIcon : toVisitIcon
                }
              >
                <Popup>
                  <Box sx={{ p: 1, minWidth: 200 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {selectedPlace.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {selectedPlace.description}
                    </Typography>
                    {selectedPlace.rating && (
                      <Box sx={{ mt: 1 }}>
                        <RatingStars rating={selectedPlace.rating} />
                      </Box>
                    )}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: 'block' }}
                    >
                      GPS: {getPlaceCoordinates(selectedPlace)!.lat.toFixed(4)},{' '}
                      {getPlaceCoordinates(selectedPlace)!.lng.toFixed(4)}
                    </Typography>
                    {selectedPlace.photos.length > 0 && (
                      <Box
                        sx={{
                          bgcolor: '#E8F5E8',
                          color: '#2E7D32',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          mt: 1,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        <StarIcon sx={{ fontSize: '0.875rem' }} />
                        Visité
                      </Box>
                    )}
                  </Box>
                </Popup>
              </Marker>
            </MapContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closePlaceMap}>Fermer</Button>
          <Button
            variant="contained"
            onClick={() => navigate(`/place/${selectedPlace?.id}`)}
          >
            Voir les détails
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal carte globale */}
      <Dialog
        open={showGlobalMap}
        onClose={() => setShowGlobalMap(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { height: '80vh' } }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Tous mes lieux sur la carte
          </Typography>
          <IconButton onClick={() => setShowGlobalMap(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, flex: 1 }}>
          <MapContainer
            center={getGlobalMapCenter()}
            zoom={4}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {allPlaces.map((place) => {
              const coords = getPlaceCoordinates(place);
              if (!coords) return null;

              const isVisited = place.photos.length > 0;

              return (
                <Marker
                  key={place.id}
                  position={[coords.lat, coords.lng]}
                  icon={isVisited ? visitedIcon : toVisitIcon}
                >
                  <Popup>
                    <Box sx={{ p: 1, minWidth: 200 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {place.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        {place.description}
                      </Typography>
                      {place.rating && (
                        <Box sx={{ mt: 1 }}>
                          <RatingStars rating={place.rating} />
                        </Box>
                      )}
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: 'block' }}
                      >
                        GPS: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                      </Typography>
                      <Box
                        sx={{
                          bgcolor: isVisited ? '#E8F5E8' : '#FFF3E0',
                          color: isVisited ? '#2E7D32' : '#F57C00',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          mt: 1,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        {isVisited ? (
                          <>
                            <CheckCircleIcon sx={{ fontSize: '0.875rem' }} />
                            Visité
                          </>
                        ) : (
                          <>
                            <PlaceIcon sx={{ fontSize: '0.875rem' }} />À visiter
                          </>
                        )}
                      </Box>
                    </Box>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          {/* Légende */}
          <Box sx={{ display: 'flex', gap: 3, mr: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: '#4CAF50',
                  borderRadius: '50%',
                }}
              />
              <Typography variant="caption">
                Visités ({visitedPlaces})
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: '#FF9800',
                  borderRadius: '50%',
                }}
              />
              <Typography variant="caption">
                À visiter ({toVisitPlaces})
              </Typography>
            </Box>
          </Box>
          <Button onClick={() => setShowGlobalMap(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllPlaces;
