import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  Container,
} from '@mui/material';
import { Add } from '@mui/icons-material';

interface Place {
  id: string;
  title: string;
  location: string;
  images: string[];
  notes?: string;
}

// Données de test
const mockPlaces: Place[] = [
  {
    id: '1',
    title: 'Eiffel tower',
    location: 'Paris, France',
    images: [],
    notes:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
  {
    id: '2',
    title: 'Coliseum',
    location: 'Rome, Italie',
    images: [],
    notes: 'Amazing historical monument with rich history.',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const totalPlaces = 15;
  const totalCountries = 10;

  const handleViewAll = () => {
    navigate('/places');
  };

  const handlePlaceClick = () => {
    navigate('/places');
  };

  const handleAddPlace = () => {
    navigate('/places');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', gap: 3, height: '100%' }}>
        {/* Section My places - Gauche */}
        <Box sx={{ flex: 2 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Typography variant="h5" component="h2">
                  My places
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddPlace}
                  sx={{
                    backgroundColor: '#4A90E2',
                    '&:hover': { backgroundColor: '#357ABD' },
                  }}
                >
                  Add A New Place
                </Button>
              </Box>

              {/* Carte interactive placeholder */}
              <Paper
                sx={{
                  height: 400,
                  backgroundColor: 'background.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Interactive Map View
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Box>

        {/* Section Recent places - Droite */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Recent places */}
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6" component="h2">
                Recent places
              </Typography>
              <Button
                variant="text"
                onClick={handleViewAll}
                sx={{ color: '#4A90E2' }}
              >
                View all
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {mockPlaces.map((place) => (
                <Card
                  key={place.id}
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 2,
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                  onClick={() => handlePlaceClick()}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                      {place.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {place.location}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {[1, 2, 3].map((i) => (
                        <Paper
                          key={i}
                          sx={{
                            width: 64,
                            height: 64,
                            background: '#e0e0e0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Box
                            component="span"
                            sx={{ color: '#bdbdbd', fontSize: 32 }}
                          >
                            <svg
                              width="32"
                              height="32"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                width="32"
                                height="32"
                                rx="4"
                                fill="#E0E0E0"
                              />
                              <path
                                d="M10 20l4-4 4 4M12 16l2-2 2 2"
                                stroke="#BDBDBD"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Statistiques */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" component="h4">
                  Total places
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                  {totalPlaces}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" component="h4">
                  Countries
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                  {totalCountries}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
