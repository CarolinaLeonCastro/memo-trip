import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
  Drawer,
  IconButton,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Widgets as WidgetsIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Satellite as SatelliteIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useJournals } from '../context/JournalContext';
import MapHeader from '../components/map/MapHeader';
import MapSidebar from '../components/map/MapSidebar';
import PlaceDetailModal from '../components/map/PlaceDetailModal';
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

// Custom marker icons for visited/to visit
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

interface PlaceWithJournal {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  dateVisited: string;
  photos: string[];
  category?: string;
  isVisited: boolean;
  journalTitle: string;
  journalId: string;
}

const MapView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { journals, getJournal } = useJournals();
  const theme = useTheme();

  // 📱 Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  // States
  const [selectedJournal, setSelectedJournal] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'visited' | 'toVisit'
  >('all');
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');
  const [selectedPlace, setSelectedPlace] = useState<PlaceWithJournal | null>(
    null
  );
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // 📱 Mobile drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const journalId = searchParams.get('journal');

  useEffect(() => {
    if (journalId) {
      setSelectedJournal(journalId);
    }
  }, [journalId]);

  // Process places data
  const places = useMemo(() => {
    let allPlaces: PlaceWithJournal[];

    if (selectedJournal === 'all') {
      allPlaces = journals.flatMap((journal) =>
        journal.places
          .filter((place) => place.latitude != null && place.longitude != null)
          .map((place) => ({
            id: place.id,
            name: place.name,
            description: place.description,
            latitude: place.latitude!,
            longitude: place.longitude!,
            dateVisited: place.dateVisited.toString(),
            photos: place.photos || [],
            journalTitle: journal.title,
            journalId: journal.id,
            isVisited:
              place.status === 'visited' ||
              (place.visited && place.status !== 'planned'),
          }))
      );
    } else {
      const journal = getJournal(selectedJournal);
      allPlaces = journal
        ? journal.places
            .filter(
              (place) => place.latitude != null && place.longitude != null
            )
            .map((place) => ({
              id: place.id,
              name: place.name,
              description: place.description,
              latitude: place.latitude!,
              longitude: place.longitude!,
              dateVisited: place.dateVisited.toString(),
              photos: place.photos || [],
              journalTitle: journal.title,
              journalId: journal.id,
              isVisited:
                place.status === 'visited' ||
                (place.visited && place.status !== 'planned'),
            }))
        : [];
    }

    // Apply filters
    let filteredPlaces = allPlaces;

    if (filterStatus !== 'all') {
      filteredPlaces = filteredPlaces.filter((place) =>
        filterStatus === 'visited' ? place.isVisited : !place.isVisited
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredPlaces = filteredPlaces.filter(
        (place) =>
          place.name.toLowerCase().includes(query) ||
          (place.description &&
            place.description.toLowerCase().includes(query)) ||
          place.journalTitle.toLowerCase().includes(query)
      );
    }

    return filteredPlaces;
  }, [journals, selectedJournal, getJournal, filterStatus, searchQuery]);

  // Calculate map center and zoom
  const { mapCenter, mapZoom } = useMemo(() => {
    if (places.length === 0)
      return { mapCenter: [46.603354, 1.888334], mapZoom: 6 };

    const avgLat =
      places.reduce((sum, place) => sum + place.latitude, 0) / places.length;
    const avgLng =
      places.reduce((sum, place) => sum + place.longitude, 0) / places.length;

    let zoom = 6;
    if (places.length === 1) {
      zoom = 12;
    } else {
      const lats = places.map((p) => p.latitude);
      const lngs = places.map((p) => p.longitude);
      const latSpread = Math.max(...lats) - Math.min(...lats);
      const lngSpread = Math.max(...lngs) - Math.min(...lngs);
      const maxSpread = Math.max(latSpread, lngSpread);

      if (maxSpread > 10) zoom = 4;
      else if (maxSpread > 5) zoom = 5;
      else if (maxSpread > 1) zoom = 7;
      else zoom = 9;
    }

    return { mapCenter: [avgLat, avgLng], mapZoom: zoom };
  }, [places]);

  const handlePlaceClick = (place: PlaceWithJournal) => {
    setSelectedPlace(place);
    setDetailModalOpen(true);
  };

  // 📱 Handlers for mobile drawer
  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handlePlaceClickWithDrawer = (place: PlaceWithJournal) => {
    handlePlaceClick(place);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  // 🎨 Responsive sidebar component
  const SidebarContent = () => (
    <MapSidebar places={places} onPlaceClick={handlePlaceClickWithDrawer} />
  );

  const getTileLayerUrl = () => {
    return mapType === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  };

  const getTileLayerAttribution = () => {
    return mapType === 'satellite'
      ? 'Tiles &copy; Esri &mdash; Source: Esri, Earthstar Geographics'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        height: '85vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadiusBottomleft: '10px',
        borderRadiusBottomright: '10px',
        p: 0,
        overflow: 'hidden',
      }}
    >
      {/* 🎨 Header mobile optimisé */}
      <Box
        sx={{
          mb: 0,
          position: 'sticky',
          top: 0,
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
          zIndex: 1000,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: { xs: 1, sm: 2 },
            gap: 1,
          }}
        >
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="primary"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              sx={{
                color: 'primary.main',
              }}
            >
              <WidgetsIcon />
            </IconButton>
          )}

          {/* Header - responsive */}
          <Box sx={{ flex: 1 }}>
            {isMobile ? (
              <Typography
                variant="h6"
                color="primary.main"
                sx={{
                  fontFamily: '"Chau Philomene One", cursive',
                  fontSize: '1.2rem',
                }}
              >
                Carte des lieux ({places.length})
              </Typography>
            ) : (
              <MapHeader
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filterStatus={filterStatus}
                onFilterStatusChange={setFilterStatus}
                mapType={mapType}
                onMapTypeChange={setMapType}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* 🗺️ Main Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Map Container */}
        <Box
          sx={{
            flex: 1,
            height: '100%',
            position: 'relative',
          }}
        >
          {places.length === 0 ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                gap: 2,
                p: { xs: 2, sm: 4 },
              }}
            >
              <LocationIcon
                sx={{
                  fontSize: { xs: 48, sm: 64 },
                  color: 'text.secondary',
                }}
              />
              <Typography
                variant={isMobile ? 'h6' : 'h5'}
                color="text.secondary"
                textAlign="center"
              >
                Aucun lieu trouvé
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{ px: 2, maxWidth: 400 }}
              >
                Modifiez vos filtres ou ajoutez de nouveaux lieux pour les voir
                sur la carte
              </Typography>
            </Box>
          ) : (
            <MapContainer
              center={mapCenter as [number, number]}
              zoom={mapZoom}
              style={{
                height: '100%',
                width: '100%',
              }}
              scrollWheelZoom={true}
              maxZoom={18}
              zoomControl={!isMobile}
            >
              <TileLayer
                url={getTileLayerUrl()}
                attribution={getTileLayerAttribution()}
              />
              {/* Markers */}
              {places.map((place) => (
                <Marker
                  key={place.id}
                  position={[place.latitude, place.longitude]}
                  icon={place.isVisited ? visitedIcon : toVisitIcon}
                >
                  <Popup maxWidth={isMobile ? 250 : 300}>
                    <Box sx={{ minWidth: isMobile ? 180 : 200 }}>
                      <Typography
                        variant={isMobile ? 'subtitle1' : 'h6'}
                        sx={{ mb: 1 }}
                      >
                        {place.name}
                      </Typography>
                      {place.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {place.description.substring(0, isMobile ? 80 : 100)}
                          ...
                        </Typography>
                      )}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            bgcolor: place.isVisited ? '#E8F5E8' : '#FFF3E0',
                            color: place.isVisited ? '#2E7D32' : '#F57C00',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontWeight: 600,
                          }}
                        >
                          {place.isVisited ? 'Visité' : 'À visiter'}
                        </Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontStyle: 'italic' }}
                      >
                        {place.journalTitle}
                      </Typography>
                    </Box>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </Box>

        {/* Desktop/Tablet Sidebar */}
        {!isMobile && (
          <Box
            sx={{
              flex: isTablet ? '1' : '1',
              height: '100%',
              maxWidth: { md: 300, lg: 380 },
              minWidth: { md: 280, lg: 350 },
            }}
          >
            <SidebarContent />
          </Box>
        )}
      </Box>

      {/* 📱 Mobile Drawer amélioré */}
      <Drawer
        variant="temporary"
        open={mobileDrawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: '85vw',
            maxWidth: 350,
            bgcolor: 'background.paper',
          },
        }}
      >
        {/* En-tête du drawer avec recherche */}
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'primary.main',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontFamily: '"Chau Philomene One", cursive',
              }}
            >
              Lieux ({places.length})
            </Typography>
            <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Barre de recherche mobile */}
          <TextField
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            fullWidth
            sx={{
              mb: 2,
              bgcolor: 'background.default',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.default',
                borderRadius: 1,
                '& fieldset': { border: 'none' },
                '&:hover': {
                  backgroundColor: 'background.default',
                },
                '&.Mui-focused': {
                  backgroundColor: 'background.default',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#666' }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Filtres mobile */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <ToggleButtonGroup
              exclusive
              value={filterStatus}
              onChange={(_, newValue) => newValue && setFilterStatus(newValue)}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  px: 1.5,
                  py: 0.5,
                  textTransform: 'none',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                  },
                },
              }}
            >
              <ToggleButton value="all">Tous</ToggleButton>
              <ToggleButton value="visited">Visités</ToggleButton>
              <ToggleButton value="toVisit">À visiter</ToggleButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup
              value={mapType}
              exclusive
              onChange={(_, newValue) => newValue && setMapType(newValue)}
              size="small"
              sx={{
                ml: 1,
                '& .MuiToggleButton-root': {
                  px: 1,
                  py: 0.5,
                  border: '1px solid rgba(255,255,255,0.3)',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  },
                },
              }}
            >
              <ToggleButton value="street">
                <MapIcon fontSize="small" sx={{ color: 'white' }} />
              </ToggleButton>
              <ToggleButton value="satellite">
                <SatelliteIcon fontSize="small" sx={{ color: 'white' }} />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Contenu du drawer */}
        <SidebarContent />
      </Drawer>

      {/* 🎯 Place Detail Modal */}
      <PlaceDetailModal
        place={selectedPlace}
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedPlace(null);
        }}
      />
    </Container>
  );
};

export default MapView;
