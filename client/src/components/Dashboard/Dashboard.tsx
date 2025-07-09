import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import { Add } from '@mui/icons-material';

interface Place {
  id: string;
  title: string;
  location: string;
  images: string[];
  notes?: string;
}

interface DashboardProps {
  places: Place[];
  onAddPlace: () => void;
  onPlaceClick: (place: Place) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  places,
  onAddPlace,
  onPlaceClick,
}) => {
  const recentPlaces = places.slice(0, 2);
  const totalPlaces = places.length;
  const totalCountries = [
    ...new Set(places.map((p) => p.location.split(', ')[1])),
  ].length;

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          '@media (max-width: 960px)': { flexDirection: 'column' },
        }}
      >
        {/* Section My places */}
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
                <Typography variant="h5" component="h2">
                  My places
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={onAddPlace}
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
        {/* Section Recent places */}
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
              <Typography variant="h6" component="h3">
                Recent places
              </Typography>
              <Button variant="text" size="small" sx={{ color: '#4A90E2' }}>
                View all
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentPlaces.map((place) => (
                <Card key={place.id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {place.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {place.location}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
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
    </Box>
  );
};

export default Dashboard;
