import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  useTheme,
  Chip,
  Rating,
  Stack,
  Paper,
  Grid,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Image as ImageIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useJournals } from '../context/JournalContext';
import PlaceSearchInput from '../components/PlaceSearchInput';
import type { GeocodingResult } from '../services/geocoding.service';

// Tags prédéfinis suggérés
const SUGGESTED_TAGS = [
  'Histoire',
  'Architecture',
  'UNESCO',
  'Monuments',
  'Vue panoramique',
  'Romantique',
  'Plages',
  'Coucher de soleil',
  'Château',
  'Alpes',
  'Conte de fées',
  'Randonnée',
  'Merveilles du monde',
  'Gastronomie',
  'Culture',
  'Art',
  'Nature',
  'Aventure',
  'Musée',
  'Cathédrale',
  'Jardin',
  'Lac',
  'Montagne',
  'Ville',
  'Village',
  'Marché',
];

const EditPlace: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { updatePlace, journals } = useJournals();

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    country: '',
    description: '',
    dateVisited: new Date().toISOString().split('T')[0],
    photos: [] as string[],
    tags: [] as string[],
    visited: false,
    rating: 0,
    latitude: '',
    longitude: '',
    journalId: '',
  });

  const [originalPlace, setOriginalPlace] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customTag, setCustomTag] = useState('');

  // Charger les données du lieu à modifier
  useEffect(() => {
    if (!id) return;

    // Trouver le lieu par ID dans tous les journaux
    let place = null;
    let journalId = '';

    for (const journal of journals) {
      const foundPlace = journal.places.find((p) => p.id === id);
      if (foundPlace) {
        place = foundPlace;
        journalId = journal.id;
        break;
      }
    }

    if (place) {
      setOriginalPlace(place);
      setFormData({
        name: place.name,
        city: place.city || '',
        country: place.country || '',
        description: place.description,
        dateVisited: new Date(place.dateVisited).toISOString().split('T')[0],
        photos: place.photos || [],
        tags: place.tags || [],
        visited: new Date(place.dateVisited) <= new Date(),
        rating: place.rating || 0,
        latitude: place.latitude?.toString() || '',
        longitude: place.longitude?.toString() || '',
        journalId,
      });
    } else {
      // Lieu non trouvé, rediriger
      navigate('/places');
    }
  }, [id, journals, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePlaceSelect = (place: GeocodingResult) => {
    setFormData((prev) => ({
      ...prev,
      name: place.display_name,
      city: place.address?.city || '',
      country: place.address?.country || '',
      latitude: place.coordinates?.latitude?.toString() || '',
      longitude: place.coordinates?.longitude?.toString() || '',
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = 4 - formData.photos.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      filesToProcess.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setFormData((prev) => ({
              ...prev,
              photos: [...prev.photos, event.target?.result as string],
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleCustomTagAdd = () => {
    if (customTag.trim() && !formData.tags.includes(customTag.trim())) {
      handleTagAdd(customTag.trim());
      setCustomTag('');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du lieu est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !originalPlace) return;

    const updatedPlace = {
      ...originalPlace,
      name: formData.name,
      city: formData.city,
      country: formData.country,
      description: formData.description,
      dateVisited: new Date(formData.dateVisited),
      photos: formData.photos,
      tags: formData.tags,
      rating: formData.rating,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
    };

    try {
      await updatePlace(formData.journalId, originalPlace.id, updatedPlace);
      navigate(`/place/${originalPlace.id}`);
    } catch (error) {
      console.error('Erreur lors de la modification du lieu:', error);
      alert('Erreur lors de la modification du lieu');
    }
  };

  if (!originalPlace) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" textAlign="center">
          Chargement...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 4,
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': { boxShadow: 2 },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Chau Philomene One", cursive',
            color: 'primary.main',
          }}
        >
          Modifier le lieu
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Colonne gauche - Informations de base */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Section 1: Informations de base */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <LocationIcon sx={{ color: 'primary.main', fontSize: 24 }} />
              <Typography
                variant="h6"
                sx={{ fontFamily: '"Chau Philomene One", cursive' }}
              >
                Informations de base
              </Typography>
            </Box>

            <Stack spacing={3}>
              {/* Recherche de lieu */}
              <PlaceSearchInput
                onPlaceSelect={handlePlaceSelect}
                placeholder="Rechercher un lieu..."
              />

              {/* Nom du lieu */}
              <TextField
                fullWidth
                label="Nom du lieu"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={Boolean(errors.name)}
                helperText={errors.name}
                required
              />

              {/* Ville et Pays sur la même ligne */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Ville"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Pays"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </Box>

              {/* Description */}
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                error={Boolean(errors.description)}
                helperText={errors.description}
                required
              />

              {/* Coordonnées */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  type="number"
                  inputProps={{ step: 'any' }}
                />
                <TextField
                  fullWidth
                  label="Longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  type="number"
                  inputProps={{ step: 'any' }}
                />
              </Box>
            </Stack>
          </Paper>

          {/* Section 2: Tags */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontFamily: '"Chau Philomene One", cursive',
                color: 'primary.main',
              }}
            >
              Tags
            </Typography>

            <Stack spacing={3}>
              {/* Tags sélectionnés */}
              {formData.tags.length > 0 && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                    Tags sélectionnés :
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleTagRemove(tag)}
                        variant="filled"
                        sx={{
                          backgroundColor: 'tertiary.main',
                          color: 'primary.main',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Ajouter un tag personnalisé */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Ajouter un tag personnalisé..."
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCustomTagAdd();
                    }
                  }}
                  size="small"
                />
                <Button
                  onClick={handleCustomTagAdd}
                  variant="outlined"
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Ajouter
                </Button>
              </Box>

              {/* Tags suggérés */}
              <Box>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                  Tags suggérés :
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {SUGGESTED_TAGS.filter((tag) => !formData.tags.includes(tag))
                    .slice(0, 12)
                    .map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onClick={() => handleTagAdd(tag)}
                        variant="filled"
                        size="small"
                      />
                    ))}
                </Box>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Colonne droite - Photos, Date, Notes */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Section 1: Photos */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <ImageIcon sx={{ color: 'primary.main', fontSize: 24 }} />
              <Typography
                variant="h6"
                sx={{ fontFamily: '"Chau Philomene One", cursive' }}
              >
                Photos ({formData.photos.length}/4)
              </Typography>
            </Box>

            {/* Zone d'upload compacte */}
            <Box sx={{ mb: 3 }}>
              {formData.photos.length < 4 && (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{
                    mb: 2,
                    borderColor: 'error.main',
                    color: 'error.main',
                    '&:hover': {
                      borderColor: 'error.dark',
                      color: 'error.dark',
                    },
                  }}
                >
                  Ajouter des photos ({formData.photos.length}/4)
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </Button>
              )}

              {/* Carrousel horizontal des photos */}
              {formData.photos.length > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    overflowX: 'auto',
                    pb: 1,
                    '&::-webkit-scrollbar': {
                      height: 6,
                    },
                    '&::-webkit-scrollbar-track': {
                      bgcolor: 'grey.100',
                      borderRadius: 3,
                    },
                    '&::-webkit-scrollbar-thumb': {
                      bgcolor: 'grey.400',
                      borderRadius: 3,
                    },
                  }}
                >
                  {formData.photos.map((photo, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        minWidth: 120,
                        height: 80,
                        border: '1px solid',
                        borderColor: 'grey.300',
                        borderRadius: 1,
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemovePhoto(index)}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          width: 24,
                          height: 24,
                          '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.8)',
                          },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      <Typography
                        variant="caption"
                        sx={{
                          position: 'absolute',
                          bottom: 2,
                          left: 4,
                          color: 'white',
                          bgcolor: 'rgba(0,0,0,0.6)',
                          px: 0.5,
                          borderRadius: 0.5,
                          fontSize: '0.65rem',
                        }}
                      >
                        {index + 1}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Paper>

          {/* Section 2: Date et évaluation */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontFamily: '"Chau Philomene One", cursive',
                color: 'primary.main',
              }}
            >
              Date et évaluation
            </Typography>

            <Stack spacing={3}>
              {/* Date de visite */}
              <TextField
                fullWidth
                label="Date de visite"
                name="dateVisited"
                value={formData.dateVisited}
                onChange={handleChange}
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              {/* Évaluation */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Évaluation :
                </Typography>
                <Rating
                  value={formData.rating}
                  onChange={(_, newValue) => {
                    setFormData((prev) => ({ ...prev, rating: newValue || 0 }));
                  }}
                  size="large"
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Boutons d'action */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          mt: 4,
        }}
      >
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{ minWidth: 120 }}
        >
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            minWidth: 120,
            background: `linear-gradient(45deg, ${theme.palette.error.main} 30%, ${theme.palette.error.light} 90%)`,
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.error.dark} 30%, ${theme.palette.error.main} 90%)`,
            },
          }}
        >
          Modifier
        </Button>
      </Box>
    </Container>
  );
};

export default EditPlace;
