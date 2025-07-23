import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ImageList,
  ImageListItem,
} from '@mui/material';
import {
  Add as AddIcon,
  LocationOn as LocationIcon,
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useJournals } from '../context/JournalContext';

const PlaceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { journals } = useJournals();

  // Trouver le lieu par ID
  const place = journals
    .flatMap((journal) => journal.places)
    .find((p) => p.id === id);

  if (!place) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary">
          Place not found
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Box>
    );
  }

  // Simuler d'autres lieux pour la liste
  const otherPlaces = [
    { name: 'Milan, Italy', id: 'milan' },
    { name: 'New York, USA', id: 'newyork' },
    { name: 'Paris, France', id: 'paris' },
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Sidebar gauche */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent sx={{ p: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  My places
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  sx={{ borderRadius: 1.5 }}
                >
                  Add A Place
                </Button>
              </Box>

              <List dense>
                {otherPlaces.map((item) => (
                  <ListItem
                    key={item.id}
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'grey.100',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <LocationIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: item.name === place.name ? 600 : 400,
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Contenu principal */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Box sx={{ mb: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/')}
              sx={{ mb: 2 }}
            >
              Back
            </Button>
          </Box>

          {/* Zone de carte */}
          <Card sx={{ mb: 3 }}>
            <Box
              sx={{
                height: 300,
                bgcolor: 'grey.200',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px 12px 0 0',
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Interactive Map View
              </Typography>
            </Box>
          </Card>

          {/* Détails du lieu */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                    {place.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {place.description}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  Download
                </Button>
              </Box>

              {/* Notes */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                  Notes
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book.
                </Typography>
              </Box>

              {/* Photos */}
              <Box>
                <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                  Photos
                </Typography>
                <ImageList cols={4} gap={16} sx={{ m: 0 }}>
                  {place.photos.map((photo, index) => (
                    <ImageListItem key={index}>
                      <Box
                        component="img"
                        src={photo}
                        alt={`${place.name} ${index + 1}`}
                        sx={{
                          width: '100%',
                          height: 150,
                          objectFit: 'cover',
                          borderRadius: 2,
                          cursor: 'pointer',
                          '&:hover': {
                            opacity: 0.8,
                          },
                        }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlaceDetail;
