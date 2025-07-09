import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  Divider,
} from '@mui/material';
import { Download, Image } from '@mui/icons-material';
import Sidebar from '../components/Layout/Sidebar';

interface Place {
  id: string;
  title: string;
  location: string;
  images: string[];
  notes?: string;
}

interface SidebarPlace {
  id: string;
  name: string;
  country: string;
}

// Données de test
const mockPlaces: Place[] = [
  {
    id: '1',
    title: 'Eiffel tower',
    location: 'Paris, France',
    images: [],
    notes:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    id: '2',
    title: 'Coliseum',
    location: 'Rome, Italie',
    images: [],
    notes: 'Amazing historical monument with rich history.',
  },
  {
    id: '3',
    title: 'Milan Cathedral',
    location: 'Milan, Italy',
    images: [],
    notes: 'Beautiful Gothic cathedral in the heart of Milan.',
  },
];

// Conversion des données pour la sidebar
const sidebarPlaces: SidebarPlace[] = mockPlaces.map((place) => ({
  id: place.id,
  name: place.title,
  country: place.location,
}));

const AllPlaces = () => {
  const [selectedPlace, setSelectedPlace] = useState<string | undefined>('1');

  const handlePlaceSelect = (placeId: string) => {
    setSelectedPlace(placeId);
  };

  const handleAddPlace = () => {
    console.log('Add new place');
  };

  const handleDownload = () => {
    console.log('Download place data');
  };

  const selectedPlaceData = mockPlaces.find((p) => p.id === selectedPlace);

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Sidebar
        places={sidebarPlaces}
        selectedPlace={selectedPlace}
        onPlaceSelect={handlePlaceSelect}
        onAddPlace={handleAddPlace}
      />

      <Box sx={{ flex: 1, mx: '100px', p: 2 }}>
        {/* Carte interactive */}
        <Paper
          sx={{
            height: 400,
            backgroundColor: 'background.secondary',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid',
            borderColor: 'divider',
            mb: 3,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Interactive Map View
          </Typography>
        </Paper>

        {/* Détails du lieu sélectionné */}
        {selectedPlaceData && (
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
                    {selectedPlaceData.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {selectedPlaceData.location}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={handleDownload}
                  sx={{
                    backgroundColor: '#4A90E2',
                    '&:hover': {
                      backgroundColor: '#357ABD',
                    },
                  }}
                >
                  Download
                </Button>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Notes */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                  Notes
                </Typography>
                <Typography variant="body1" color="text.primary">
                  {selectedPlaceData.notes ||
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."}
                </Typography>
              </Box>

              {/* Photos */}
              <Box>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                  Photos
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 'calc(25% - 12px)',
                        height: 120,
                        backgroundColor: 'background.secondary',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid',
                        borderColor: 'divider',
                        overflow: 'hidden',
                      }}
                    >
                      <Image sx={{ color: 'text.disabled', fontSize: 32 }} />
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default AllPlaces;
