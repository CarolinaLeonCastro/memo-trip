import { useState } from 'react';
import { Box } from '@mui/material';
import ThemeProvider from './providers/ThemeProvider';
import AppHeader from './components/Layout/AppHeader';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import PlaceDetail from './components/PlaceDetail/PlaceDetail';

// Interfaces
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
    title: 'Eiffel Tower',
    location: 'Paris, France',
    images: [],
    notes:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    id: '2',
    title: 'Coliseum',
    location: 'Rome, Italy',
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
  {
    id: '4',
    title: 'Times Square',
    location: 'New York, USA',
    images: [],
    notes: 'The bustling heart of New York City.',
  },
];

// Conversion des données pour la sidebar
const sidebarPlaces: SidebarPlace[] = mockPlaces.map((place) => ({
  id: place.id,
  name: place.title,
  country: place.location,
}));

function App() {
  const [selectedPlace, setSelectedPlace] = useState<string | undefined>(
    undefined
  );
  const [currentView, setCurrentView] = useState<'dashboard' | 'place-detail'>(
    'dashboard'
  );

  const handlePlaceSelect = (placeId: string) => {
    setSelectedPlace(placeId);
    setCurrentView('dashboard');
  };

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place.id);
    setCurrentView('place-detail');
  };

  const handleAddPlace = () => {
    console.log('Add new place');
  };

  const handleDownload = () => {
    console.log('Download place data');
  };

  const selectedPlaceData = mockPlaces.find((p) => p.id === selectedPlace);

  return (
    <ThemeProvider>
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <AppHeader />
        <Sidebar
          places={sidebarPlaces}
          selectedPlace={selectedPlace}
          onPlaceSelect={handlePlaceSelect}
          onAddPlace={handleAddPlace}
        />
        <Box sx={{ flex: 1, ml: '300px', pt: 8 }}>
          {currentView === 'dashboard' ? (
            <Dashboard
              places={mockPlaces}
              onAddPlace={handleAddPlace}
              onPlaceClick={handlePlaceClick}
            />
          ) : (
            selectedPlaceData && (
              <PlaceDetail
                place={selectedPlaceData}
                onDownload={handleDownload}
              />
            )
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
