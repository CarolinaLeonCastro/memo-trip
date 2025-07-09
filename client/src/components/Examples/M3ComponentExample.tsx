import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Divider,
  Paper,
  Stack,
  Grid,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Add, Place, Star, Share, Download } from '@mui/icons-material';

/**
 * Composant d'exemple montrant l'utilisation du thème Material Design 3
 * avec les meilleures pratiques et votre palette de couleurs
 */
const M3ComponentExample: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default }}>
      <Stack spacing={4}>
        {/* Header avec nouvelle typographie M3 */}
        <Box>
          <Typography
            sx={{
              ...theme.typography.displaySmall,
              color: theme.palette.onSurface,
              mb: 1,
            }}
          >
            Material Design 3
          </Typography>
          <Typography
            sx={{
              ...theme.typography.bodyLarge,
              color: theme.palette.onSurfaceVariant,
            }}
          >
            Exemple d'utilisation du nouveau thème avec votre palette
          </Typography>
        </Box>

        {/* Boutons M3 */}
        <Paper
          elevation={1}
          sx={{
            p: 3,
            backgroundColor: theme.palette.surfaceContainer,
            borderRadius: 2,
          }}
        >
          <Typography
            sx={{
              ...theme.typography.headlineSmall,
              mb: 2,
              color: theme.palette.onSurface,
            }}
          >
            Boutons Material Design 3
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              sx={{ borderRadius: 20 }}
            >
              Add A New Place
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Place />}
              sx={{ borderRadius: 20 }}
            >
              View Places
            </Button>
            <Button
              variant="text"
              color="tertiary"
              startIcon={<Share />}
              sx={{ borderRadius: 20 }}
            >
              Share
            </Button>
          </Stack>
        </Paper>

        {/* Cards M3 avec surfaces tonales */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                backgroundColor: theme.palette.surfaceContainerLow,
                borderRadius: 3,
                '&:hover': {
                  boxShadow: theme.shadows[2],
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      mr: 2,
                      width: 56,
                      height: 56,
                    }}
                  >
                    <Place />
                  </Avatar>
                  <Box>
                    <Typography
                      sx={{
                        ...theme.typography.titleMedium,
                        color: theme.palette.onSurface,
                      }}
                    >
                      Paris, France
                    </Typography>
                    <Typography
                      sx={{
                        ...theme.typography.bodyMedium,
                        color: theme.palette.onSurfaceVariant,
                      }}
                    >
                      Visited 3 days ago
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  sx={{
                    ...theme.typography.bodySmall,
                    color: theme.palette.onSurfaceVariant,
                    mb: 2,
                  }}
                >
                  Amazing city with incredible architecture and culture. The
                  Eiffel Tower was breathtaking!
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip
                    label="Culture"
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.secondaryContainer,
                      color: theme.palette.onSecondaryContainer,
                    }}
                  />
                  <Chip
                    label="Architecture"
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.tertiaryContainer,
                      color: theme.palette.onTertiaryContainer,
                    }}
                  />
                </Stack>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Star
                    sx={{
                      color: theme.palette.tertiary.main,
                      fontSize: 20,
                      mr: 0.5,
                    }}
                  />
                  <Typography
                    sx={{
                      ...theme.typography.labelMedium,
                      color: theme.palette.onSurface,
                    }}
                  >
                    4.8 / 5
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                backgroundColor: theme.palette.surfaceContainerLow,
                borderRadius: 3,
                '&:hover': {
                  boxShadow: theme.shadows[2],
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.secondary.main,
                      mr: 2,
                      width: 56,
                      height: 56,
                    }}
                  >
                    <Place />
                  </Avatar>
                  <Box>
                    <Typography
                      sx={{
                        ...theme.typography.titleMedium,
                        color: theme.palette.onSurface,
                      }}
                    >
                      Tokyo, Japan
                    </Typography>
                    <Typography
                      sx={{
                        ...theme.typography.bodyMedium,
                        color: theme.palette.onSurfaceVariant,
                      }}
                    >
                      Visited 1 week ago
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  sx={{
                    ...theme.typography.bodySmall,
                    color: theme.palette.onSurfaceVariant,
                    mb: 2,
                  }}
                >
                  Incredible blend of tradition and modernity. The cherry
                  blossoms were in full bloom!
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip
                    label="Nature"
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.secondaryContainer,
                      color: theme.palette.onSecondaryContainer,
                    }}
                  />
                  <Chip
                    label="Food"
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.tertiaryContainer,
                      color: theme.palette.onTertiaryContainer,
                    }}
                  />
                </Stack>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Star
                    sx={{
                      color: theme.palette.tertiary.main,
                      fontSize: 20,
                      mr: 0.5,
                    }}
                  />
                  <Typography
                    sx={{
                      ...theme.typography.labelMedium,
                      color: theme.palette.onSurface,
                    }}
                  >
                    4.9 / 5
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Liste avec interactions M3 */}
        <Paper
          elevation={1}
          sx={{
            backgroundColor: theme.palette.surfaceContainer,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography
              sx={{
                ...theme.typography.headlineSmall,
                color: theme.palette.onSurface,
              }}
            >
              Recent Places
            </Typography>
          </Box>
          <List>
            {[
              { name: 'Barcelona', country: 'Spain', rating: 4.7 },
              { name: 'New York', country: 'USA', rating: 4.5 },
              { name: 'Rome', country: 'Italy', rating: 4.8 },
            ].map((place, index) => (
              <React.Fragment key={place.name}>
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      '&:hover': {
                        backgroundColor: `${theme.palette.primary.main}08`,
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.surfaceContainerHighest,
                          color: theme.palette.onSurface,
                        }}
                      >
                        <Place />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            ...theme.typography.titleMedium,
                            color: theme.palette.onSurface,
                          }}
                        >
                          {place.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          sx={{
                            ...theme.typography.bodyMedium,
                            color: theme.palette.onSurfaceVariant,
                          }}
                        >
                          {place.country} • {place.rating}/5
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {index < 2 && <Divider sx={{ mx: 2 }} />}
              </React.Fragment>
            ))}
          </List>
        </Paper>

        {/* Formulaire avec TextField M3 */}
        <Paper
          elevation={1}
          sx={{
            p: 3,
            backgroundColor: theme.palette.surfaceContainer,
            borderRadius: 2,
          }}
        >
          <Typography
            sx={{
              ...theme.typography.headlineSmall,
              mb: 2,
              color: theme.palette.onSurface,
            }}
          >
            Add New Place
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Place Name"
              variant="outlined"
              fullWidth
              placeholder="Enter place name"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: theme.palette.surfaceContainerHighest,
                  borderRadius: 1,
                },
              }}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              placeholder="Describe your experience"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: theme.palette.surfaceContainerHighest,
                  borderRadius: 1,
                },
              }}
            />
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                sx={{ borderRadius: 20 }}
              >
                Add Place
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<Download />}
                sx={{ borderRadius: 20 }}
              >
                Save Draft
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Statistiques avec couleurs M3 */}
        <Grid container spacing={2}>
          {[
            {
              title: 'Total Places',
              value: '15',
              color: theme.palette.primary.main,
              bgColor: theme.palette.primaryContainer,
              textColor: theme.palette.onPrimaryContainer,
            },
            {
              title: 'Countries',
              value: '10',
              color: theme.palette.secondary.main,
              bgColor: theme.palette.secondaryContainer,
              textColor: theme.palette.onSecondaryContainer,
            },
            {
              title: 'Avg Rating',
              value: '4.7',
              color: theme.palette.tertiary.main,
              bgColor: theme.palette.tertiaryContainer,
              textColor: theme.palette.onTertiaryContainer,
            },
          ].map((stat) => (
            <Grid item xs={12} sm={4} key={stat.title}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  backgroundColor: stat.bgColor,
                  borderRadius: 2,
                  textAlign: 'center',
                }}
              >
                <Typography
                  sx={{
                    ...theme.typography.displaySmall,
                    color: stat.textColor,
                    fontWeight: 600,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  sx={{
                    ...theme.typography.titleMedium,
                    color: stat.textColor,
                    opacity: 0.8,
                  }}
                >
                  {stat.title}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
};

export default M3ComponentExample;
