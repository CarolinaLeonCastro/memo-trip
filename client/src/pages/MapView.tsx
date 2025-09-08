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
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
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
            // 🚀 NOUVEAU : Utiliser le statut correct avec le nouveau système
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
              // 🚀 NOUVEAU : Utiliser le statut correct avec le nouveau système
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
      setMobileDrawerOpen(false); // Close drawer on mobile when selecting place
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
        p: { xs: 1, sm: 2, md: 1 },
      }}
    >
      {/* 🎨 Responsive Header with Mobile Menu */}
      <Box sx={{ mb: { xs: 1, sm: 2 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
          }}
        >
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="primary"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Header - now responsive */}
          <Box sx={{ flex: 1 }}>
            <MapHeader
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterStatus={filterStatus}
              onFilterStatusChange={setFilterStatus}
              mapType={mapType}
              onMapTypeChange={setMapType}
            />
          </Box>
        </Box>
      </Box>

      {/* 🗺️ Main Content with Responsive Flexbox */}
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 1, md: 2 },
        }}
      >
        {/* Map Container - Responsive width */}
        <Box
          sx={{
            flex: isMobile ? 1 : isTablet ? '2' : '3',
            height: '100%',
            position: 'relative',
            borderRadius: { xs: 1, sm: 1 },
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
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
              maxZoom={18}
              zoomControl={!isMobile} // Hide zoom control on mobile to save space
            >
              <TileLayer
                url={getTileLayerUrl()}
                attribution={getTileLayerAttribution()}
              />
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
              maxWidth: { md: 300, lg: 350 },
              minWidth: { md: 280, lg: 320 },
            }}
          >
            <SidebarContent />
          </Box>
        )}
      </Box>

      {/* 📱 Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileDrawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: { xs: 280, sm: 350 },
            bgcolor: 'background.paper',
          },
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Drawer Content */}
        <SidebarContent />
      </Drawer>

      {/* 🎯 Place Detail Modal - Now responsive */}
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
