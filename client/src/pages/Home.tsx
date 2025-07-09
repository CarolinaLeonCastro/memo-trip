import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/Layout/AppHeader';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import { Add } from '@mui/icons-material';

const mockPlaces = [
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
    title: 'Colisem',
    location: 'Rome, Italie',
    images: [],
    notes: '',
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const totalPlaces = 15;
  const totalCountries = 10;

  return (
    <Box sx={{ background: '#fafbfc', minHeight: '100vh' }}>
      <AppHeader />
      <Box sx={{ pt: 10, px: 4 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* My places + Map */}
          <Box sx={{ flex: 2 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography variant="h5">My places</Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    sx={{ background: '#2196f3' }}
                  >
                    Add A New Place
                  </Button>
                </Box>
                <Paper
                  sx={{
                    height: 400,
                    background: '#ddd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography>Interactive Map View</Typography>
                </Paper>
              </CardContent>
            </Card>
          </Box>
          {/* Recent places */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Recent places</Typography>
                <Button
                  variant="text"
                  sx={{ color: '#2196f3' }}
                  onClick={() => navigate('/places')}
                >
                  View all
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {mockPlaces.map((place) => (
                  <Card key={place.id} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/places/${place.id}`)}
                      >
                        {place.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/places/${place.id}`)}
                      >
                        {place.location}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 2,
                          mt: 2,
                          flexWrap: 'wrap',
                        }}
                      >
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
            {/* Stats */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Card sx={{ flex: 1 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">Total places</Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {totalPlaces}
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ flex: 1 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">Countries</Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {totalCountries}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
