import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  LocationOn as LocationIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {/* Section principale - My places */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: 2,
                  mb: 3,
                }}
              >
                <Typography variant="h4" fontWeight={700}>
                  Mes lieux
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  size={isMobile ? 'medium' : 'large'}
                  sx={{
                    borderRadius: 3,
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1, sm: 1.5 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    minWidth: { xs: '100%', sm: 'auto' },
                  }}
                >
                  Ajoute un lieu
                </Button>
              </Box>

              {/* Carte interactive intégrée (placeholder) */}
              <Box
                sx={{
                  height: { xs: 300, sm: 400, md: 500 },
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'outline.main',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'surface.main',
                  gap: 2,
                }}
              >
                <LocationIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                <Typography
                  variant="h6"
                  color="text.secondary"
                  textAlign="center"
                >
                  Carte interactive
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  Ajoutez des lieux pour les voir sur la carte
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<VisibilityIcon />}
                  onClick={() => navigate('/map')}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 1000,
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'background.paper',
                      opacity: 0.9,
                    },
                  }}
                  size="small"
                >
                  Voir la carte
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar droite */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 2, sm: 3 },
            }}
          >
            {/* Recent places */}
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h5" fontWeight={600}>
                    Lieux récents
                  </Typography>
                  <Button
                    size="small"
                    sx={{ color: 'info.main', fontWeight: 600 }}
                  >
                    Voir tous
                  </Button>
                </Box>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <LocationIcon
                    sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Aucun lieu récent trouvé
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Statistiques */}
            <Grid container spacing={2}>
              <Grid size={6}>
                <Card>
                  <CardContent
                    sx={{
                      textAlign: 'center',
                      py: { xs: 2, sm: 3 },
                      px: { xs: 1, sm: 2 },
                    }}
                  >
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                      Lieux visités
                    </Typography>
                    <Typography
                      variant="h2"
                      fontWeight={700}
                      color="primary.main"
                      sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}
                    >
                      0
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={6}>
                <Card>
                  <CardContent
                    sx={{
                      textAlign: 'center',
                      py: { xs: 2, sm: 3 },
                      px: { xs: 1, sm: 2 },
                    }}
                  >
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                      Pays visités
                    </Typography>
                    <Typography
                      variant="h2"
                      fontWeight={700}
                      color="primary.main"
                      sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}
                    >
                      0
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
