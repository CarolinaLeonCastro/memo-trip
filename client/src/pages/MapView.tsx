import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LocationOn as LocationIcon } from '@mui/icons-material';
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
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
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
            isVisited: new Date(place.dateVisited) <= new Date(),
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
              isVisited: new Date(place.dateVisited) <= new Date(),
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
    <Box
      sx={{
        height: { xs: 300, sm: 400, md: 600 },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <MapHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        mapType={mapType}
        onMapTypeChange={setMapType}
      />

      {/* Main content */}
      <Box sx={{ flex: 1, display: 'flex', position: 'relative' }}>
        {/* Map Container */}
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            borderRadius: 1,
            overflow: 'hidden',
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
              }}
            >
              <LocationIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
              <Typography
                variant="h5"
                color="text.secondary"
                textAlign="center"
              >
                Aucun lieu à afficher
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
              >
                Ajustez vos filtres ou ajoutez de nouveaux lieux
              </Typography>
            </Box>
          ) : (
            <MapContainer
              center={mapCenter as [number, number]}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution={getTileLayerAttribution()}
                url={getTileLayerUrl()}
              />
              {places.map((place) => (
                <Marker
                  key={place.id}
                  position={[place.latitude, place.longitude]}
                  icon={place.isVisited ? visitedIcon : toVisitIcon}
                  eventHandlers={{
                    click: () => handlePlaceClick(place),
                  }}
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
          )}
        </Box>

        {/* Right Sidebar */}
        <MapSidebar places={places} onPlaceClick={handlePlaceClick} />
      </Box>

      {/* Place detail modal */}
      <PlaceDetailModal
        open={detailModalOpen}
        place={selectedPlace}
        onClose={() => setDetailModalOpen(false)}
      />
    </Box>
  );
};

export default MapView;
