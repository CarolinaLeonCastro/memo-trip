import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
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

const MapView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { journals, getJournal } = useJournals();
  const [selectedJournal, setSelectedJournal] = useState<string>('all');

  const journalId = searchParams.get('journal');

  useEffect(() => {
    if (journalId) {
      setSelectedJournal(journalId);
    }
  }, [journalId]);

  const getPlacesToShow = () => {
    if (selectedJournal === 'all') {
      return journals.flatMap((journal) =>
        journal.places.map((place) => ({
          ...place,
          journalTitle: journal.title,
        }))
      );
    } else {
      const journal = getJournal(selectedJournal);
      return journal
        ? journal.places.map((place) => ({
            ...place,
            journalTitle: journal.title,
          }))
        : [];
    }
  };

  const places = getPlacesToShow();

  // Calculate center and zoom based on places
  const getMapCenter = () => {
    if (places.length === 0) return [46.603354, 1.888334]; // Center of France

    const avgLat =
      places.reduce((sum, place) => sum + place.latitude, 0) / places.length;
    const avgLng =
      places.reduce((sum, place) => sum + place.longitude, 0) / places.length;

    return [avgLat, avgLng];
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBackIcon />}
            sx={{ color: 'text.secondary' }}
          >
            Retour
          </Button>
          <Typography variant="h4" fontWeight={700}>
            Carte des Voyages
          </Typography>
        </Box>

        <FormControl sx={{ minWidth: 200 }}>
          <Select
            value={selectedJournal}
            onChange={(e) => setSelectedJournal(e.target.value)}
            size="small"
          >
            <MenuItem value="all">Tous les journaux</MenuItem>
            {journals.map((journal) => (
              <MenuItem key={journal.id} value={journal.id}>
                {journal.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {places.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <LocationIcon
              sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
            />
            <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
              Aucun lieu à afficher
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {selectedJournal === 'all'
                ? 'Ajoutez des lieux à vos journaux pour les voir sur la carte'
                : 'Ce journal ne contient aucun lieu pour le moment'}
            </Typography>
            <Button
              component={Link}
              to="/journals"
              variant="contained"
              startIcon={<LocationIcon />}
            >
              Voir mes journaux
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Map */}
          <Card sx={{ mb: 4 }}>
            <Box sx={{ height: { xs: 400, md: 600 } }}>
              <MapContainer
                center={getMapCenter() as [number, number]}
                zoom={places.length === 1 ? 12 : 6}
                style={{ height: '100%', width: '100%', borderRadius: '12px' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {places.map((place) => (
                  <Marker
                    key={place.id}
                    position={[place.latitude, place.longitude]}
                  >
                    <Popup>
                      <Box sx={{ p: 1, minWidth: 200 }}>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ mb: 1 }}
                        >
                          {place.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="primary"
                          sx={{ mb: 1 }}
                        >
                          {place.journalTitle}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {place.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Visité le{' '}
                          {format(place.dateVisited, 'dd MMM yyyy', {
                            locale: fr,
                          })}
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
            </Box>
          </Card>

          {/* Places List */}
          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
                Lieux affichés ({places.length})
              </Typography>
              <Grid container spacing={2}>
                {places.map((place) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={place.id}>
                    <Card variant="outlined">
                      <CardContent sx={{ p: 2 }}>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ mb: 1 }}
                        >
                          {place.name}
                        </Typography>
                        <Chip
                          label={place.journalTitle}
                          size="small"
                          color="primary"
                          sx={{ mb: 1 }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {place.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(place.dateVisited, 'dd MMM yyyy', {
                            locale: fr,
                          })}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default MapView;
