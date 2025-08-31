import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  useTheme,
  Chip,
  FormControlLabel,
  Switch,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Paper,
  Grid,
  Radio,
  RadioGroup,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  ExpandMore as ExpandMoreIcon,
  Image as ImageIcon,
  CloudUpload as CloudUploadIcon,
  MenuBook as MenuBookIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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

const AddPlacePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { addPlace, journals } = useJournals();

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
    // Nouvelles propriétés pour le journal
    journalOption: 'none', // 'none', 'existing', 'new'
    selectedJournalId: '',
    newJournalTitle: '',
  });

  const [selectedPlace, setSelectedPlace] = useState<GeocodingResult | null>(
    null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customTag, setCustomTag] = useState('');

  const handleChange = (
    field: string,
    value: string | boolean | number | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const extractLocationFromDisplayName = (displayName: string) => {
    // Format typique de Nominatim: "Nom, Ville, Département/Région, Pays"
    const parts = displayName.split(',').map((part) => part.trim());

    if (parts.length >= 2) {
      const country = parts[parts.length - 1]; // Dernier élément = pays

      // Pour la ville, prendre l'avant-dernier élément s'il y en a plus de 2
      // Sinon prendre le premier après le nom du lieu
      let city = '';
      if (parts.length >= 3) {
        city = parts[1]; // Deuxième élément est généralement la ville
      } else if (parts.length === 2) {
        city = parts[0]; // S'il n'y a que deux parties, la première est la ville
      }

      return { city, country };
    }

    return { city: '', country: '' };
  };

  const handlePlaceSelect = (place: GeocodingResult) => {
    setSelectedPlace(place);

    // Extraire ville et pays du display_name
    const { city, country } = extractLocationFromDisplayName(
      place.display_name
    );

    // Pré-remplir les champs
    setFormData((prev) => ({
      ...prev,
      name: prev.name.trim() || place.name,
      city: prev.city.trim() || city,
      country: prev.country.trim() || country,
      latitude: place.coordinates.latitude.toString(),
      longitude: place.coordinates.longitude.toString(),
    }));

    // Effacer l'erreur de lieu si elle existe
    if (errors.place) {
      setErrors((prev) => ({ ...prev, place: '' }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos: string[] = [];
      const fileArray = Array.from(files);

      // Limiter à 4 photos maximum
      const filesToProcess = fileArray.slice(0, 4 - formData.photos.length);

      let processedCount = 0;
      filesToProcess.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            newPhotos.push(reader.result as string);
            processedCount++;

            // Quand toutes les images sont traitées, mettre à jour l'état
            if (processedCount === filesToProcess.length) {
              setFormData((prev) => ({
                ...prev,
                photos: [...prev.photos, ...newPhotos].slice(0, 4),
              }));
            }
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

    if (!formData.city.trim()) {
      newErrors.city = 'La ville est requise';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Le pays est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    let journalId = '';

    // Gérer les options de journal
    if (formData.journalOption === 'existing') {
      if (!formData.selectedJournalId) {
        alert('Veuillez sélectionner un journal existant');
        return;
      }
      journalId = formData.selectedJournalId;
    } else if (formData.journalOption === 'new') {
      if (!formData.newJournalTitle.trim()) {
        alert('Veuillez entrer un titre pour le nouveau journal');
        return;
      }
      // Créer un nouveau journal (fonctionnalité à implémenter dans le contexte)
      // Pour l'instant, on utilise le premier journal disponible
      journalId = journals[0]?.id || '';
    } else {
      // Option 'none' - utiliser le premier journal disponible ou demander à l'utilisateur
      journalId = journals[0]?.id || '';
    }

    if (!journalId) {
      alert("Veuillez créer un journal avant d'ajouter des lieux");
      return;
    }

    const placeData = {
      name: formData.name.trim(),
      city: formData.city.trim(),
      country: formData.country.trim(),
      description: formData.description.trim(),
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude
        ? parseFloat(formData.longitude)
        : undefined,
      dateVisited: new Date(formData.dateVisited),
      photos: formData.photos,
      tags: formData.tags,
      visited: formData.visited,
      rating: formData.rating || undefined,
    };

    addPlace(journalId, placeData);
    navigate('/journals'); // Rediriger vers la liste des journaux
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header avec bouton retour */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }} size="large">
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            fontWeight={700}
            sx={{
              fontFamily: '"Chau Philomene One", cursive',
              color: 'error.main',
            }}
          >
            Ajouter un nouveau lieu
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Créez une nouvelle destination pour vos voyages
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Colonne gauche - Informations de base, GPS, Tags */}
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
              {/* Recherche de lieu (optionnelle) */}
              <PlaceSearchInput
                onPlaceSelect={handlePlaceSelect}
                placeholder="Rechercher un lieu (ex: Tour Eiffel, Paris) - Optionnel"
                label="Rechercher un lieu (optionnel)"
                helperText="Recherche pour pré-remplir automatiquement les informations"
              />

              {/* Nom du lieu */}
              <TextField
                fullWidth
                label="Nom du lieu *"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                placeholder="Ex: Tour Eiffel"
              />

              {/* Ville et Pays */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Ville *"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  error={!!errors.city}
                  helperText={errors.city}
                  placeholder="Ex: Paris"
                />
                <TextField
                  fullWidth
                  label="Pays *"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  error={!!errors.country}
                  helperText={errors.country}
                  placeholder="Ex: France"
                />
              </Box>

              {/* Description */}
              <TextField
                fullWidth
                label="Description *"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                error={!!errors.description}
                helperText={errors.description}
                placeholder="Décrivez ce lieu..."
              />
            </Stack>
          </Paper>

          {/* Section 2: Localisation GPS (optionnel) */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
              mb: 3,
            }}
          >
            <Accordion
              elevation={0}
              sx={{
                border: 'none',
                boxShadow: 'none',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="gps-content"
                id="gps-header"
                sx={{ px: 0 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                  <Typography
                    variant="h6"
                    sx={{ fontFamily: '"Chau Philomene One", cursive' }}
                  >
                    Localisation GPS (optionnel)
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Latitude"
                    value={formData.latitude}
                    onChange={(e) => handleChange('latitude', e.target.value)}
                    placeholder="48.8584"
                    type="number"
                    inputProps={{ step: 'any' }}
                  />
                  <TextField
                    fullWidth
                    label="Longitude"
                    value={formData.longitude}
                    onChange={(e) => handleChange('longitude', e.target.value)}
                    placeholder="2.2945"
                    type="number"
                    inputProps={{ step: 'any' }}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
          </Paper>

          {/* Section 3: Tags et catégories */}
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
              sx={{ mb: 3, fontFamily: '"Chau Philomene One", cursive' }}
            >
              Tags et catégories
            </Typography>

            <Stack spacing={3}>
              {/* Tags actuels */}
              {formData.tags.length > 0 && (
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

        {/* Colonne droite - Aperçu image, Statut visite, Journal associé, Notes */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Section 1: Aperçu de l'image */}
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

          {/* Section 2: Statut de visite */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 3, fontFamily: '"Chau Philomene One", cursive' }}
            >
              Statut de visite
            </Typography>

            <Stack spacing={3}>
              {/* J'ai visité ce lieu */}
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.visited}
                    onChange={(e) => handleChange('visited', e.target.checked)}
                  />
                }
                label="J'ai visité ce lieu"
              />

              {/* Note et date de visite (si visité) */}
              {formData.visited && (
                <>
                  <Box>
                    <Typography component="legend" sx={{ mb: 1 }}>
                      Note
                    </Typography>
                    <Rating
                      value={formData.rating || 0}
                      onChange={(_, value) =>
                        handleChange('rating', value || 0)
                      }
                      size="large"
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="Date de visite"
                    type="date"
                    value={formData.dateVisited}
                    onChange={(e) =>
                      handleChange('dateVisited', e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </>
              )}
            </Stack>
          </Paper>

          {/* Section 3: Journal associé */}
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
              <MenuBookIcon sx={{ color: 'primary.main', fontSize: 24 }} />
              <Typography
                variant="h6"
                sx={{ fontFamily: '"Chau Philomene One", cursive' }}
              >
                Journal associé
              </Typography>
            </Box>

            <Stack spacing={3}>
              <FormControl component="fieldset">
                <RadioGroup
                  value={formData.journalOption}
                  onChange={(e) =>
                    handleChange('journalOption', e.target.value)
                  }
                >
                  <FormControlLabel
                    value="existing"
                    control={<Radio />}
                    label="Ajouter à un journal existant"
                  />
                </RadioGroup>
              </FormControl>

              {/* Sélection journal existant */}
              {formData.journalOption === 'existing' && (
                <FormControl fullWidth>
                  <InputLabel>Choisissez un journal existant</InputLabel>
                  <Select
                    value={formData.selectedJournalId}
                    onChange={(e) =>
                      handleChange('selectedJournalId', e.target.value)
                    }
                    label="Choisissez un journal existant"
                  >
                    {journals.map((journal) => (
                      <MenuItem key={journal.id} value={journal.id}>
                        {journal.title}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Le lieu sera ajouté comme référence dans le journal
                    sélectionné
                  </Typography>
                </FormControl>
              )}

              <Button
                variant="contained"
                onClick={() => navigate('/journals/new')}
              >
                Créer un nouveau journal
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Boutons d'action */}

      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{ mt: 4 }}
      >
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          size="large"
          sx={{
            px: 4,
            borderColor: 'error.main',
            color: 'error.main',
            '&:hover': {
              borderColor: 'error.dark',
              color: 'error.dark',
            },
          }}
        >
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          size="large"
          sx={{
            px: 4,
            background: `linear-gradient(45deg, ${theme.palette.error.main} 30%, ${theme.palette.error.light} 90%)`,
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.error.dark} 30%, ${theme.palette.error.main} 90%)`,
            },
          }}
          startIcon={<CloudUploadIcon />}
        >
          Sauvegarder
        </Button>
      </Stack>
    </Container>
  );
};

export default AddPlacePage;
