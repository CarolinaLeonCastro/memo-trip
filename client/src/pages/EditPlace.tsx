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
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ButtonGroup,
  Slider,
  Radio,
  RadioGroup,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Image as ImageIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Event as EventIcon,
  CalendarToday as CalendarTodayIcon,
  EventAvailable as EventAvailableIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useJournals } from '../context/JournalContext';
import PlaceSearchInput from '../components/PlaceSearchInput';
import type { GeocodingResult } from '../services/geocoding.service';
import type { Place } from '../types/index';
import {
  getTravelDateConstraints,
  type TravelDateConstraints,
} from '../utils/travel-logic';

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
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    photos: [] as string[],
    tags: [] as string[],
    visited: false,
    rating: 0,
    weather: '',
    budget: '',
    visitDuration: '',
    notes: '',
    isFavorite: false,
    latitude: '',
    longitude: '',
    journalId: '',
  });

  const [originalPlace, setOriginalPlace] = useState<Place | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customTag, setCustomTag] = useState('');

  // 📅 Récupérer le journal du lieu pour contraindre les dates
  const selectedJournal = originalPlace
    ? journals.find((j) => j.id === formData.journalId)
    : null;

  // 📅 Calculer les contraintes de dates selon l'état temporel du voyage
  const travelConstraints: TravelDateConstraints | null = selectedJournal
    ? getTravelDateConstraints(selectedJournal)
    : null;

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
        description: place.description || '',
        dateVisited: new Date(place.dateVisited).toISOString().split('T')[0],
        startDate: place.startDate
          ? new Date(place.startDate).toISOString().split('T')[0]
          : new Date(place.dateVisited).toISOString().split('T')[0],
        endDate: place.endDate
          ? new Date(place.endDate).toISOString().split('T')[0]
          : new Date(place.dateVisited).toISOString().split('T')[0],
        photos: place.photos || [],
        tags: place.tags || [],
        visited: new Date(place.dateVisited) <= new Date(),
        rating: place.rating || 0,
        weather: place.weather || '',
        budget: place.budget?.toString() || '',
        visitDuration: place.visitDuration?.toString() || '',
        notes: place.notes || '',
        isFavorite: place.isFavorite || false,
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

  const handleCustomChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user updates
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
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

    const updatedPlace: Partial<Place> = {
      name: formData.name,
      city: formData.city,
      country: formData.country,
      description: formData.description,
      dateVisited: new Date(formData.dateVisited),
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      photos: formData.photos,
      tags: formData.tags,
      rating: formData.rating,
      weather: formData.weather,
      budget: formData.budget ? Number(formData.budget) : undefined,
      visitDuration: formData.visitDuration
        ? Number(formData.visitDuration)
        : undefined,
      notes: formData.notes,
      isFavorite: formData.isFavorite,
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude
        ? parseFloat(formData.longitude)
        : undefined,
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

          {/* Section 3: Informations de visite */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
              mt: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 3, fontFamily: '"Chau Philomene One", cursive' }}
            >
              Informations de visite
            </Typography>

            <Stack spacing={3}>
              {/* Météo - Options prédéfinies */}
              <FormControl fullWidth>
                <InputLabel>Météo lors de la visite</InputLabel>
                <Select
                  name="weather"
                  value={formData.weather}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      weather: e.target.value,
                    }))
                  }
                  label="Météo lors de la visite"
                >
                  <MenuItem value="">Non spécifiée</MenuItem>
                  <MenuItem value="☀️ Ensoleillé">☀️ Ensoleillé</MenuItem>
                  <MenuItem value="⛅ Partiellement nuageux">
                    ⛅ Partiellement nuageux
                  </MenuItem>
                  <MenuItem value="☁️ Nuageux">☁️ Nuageux</MenuItem>
                  <MenuItem value="🌧️ Pluvieux">🌧️ Pluvieux</MenuItem>
                  <MenuItem value="⛈️ Orageux">⛈️ Orageux</MenuItem>
                  <MenuItem value="🌨️ Neigeux">🌨️ Neigeux</MenuItem>
                  <MenuItem value="🌫️ Brouillard">🌫️ Brouillard</MenuItem>
                  <MenuItem value="🌬️ Venteux">🌬️ Venteux</MenuItem>
                </Select>
              </FormControl>

              {/* Budget avec options rapides */}
              <Box>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                  Budget approximatif (€)
                </Typography>
                <ButtonGroup
                  variant="outlined"
                  sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}
                >
                  <Button
                    size="small"
                    variant={formData.budget === '0' ? 'contained' : 'outlined'}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, budget: '0' }))
                    }
                  >
                    Gratuit
                  </Button>
                  <Button
                    size="small"
                    variant={
                      formData.budget === '10' ? 'contained' : 'outlined'
                    }
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, budget: '10' }))
                    }
                  >
                    ~10€
                  </Button>
                  <Button
                    size="small"
                    variant={
                      formData.budget === '25' ? 'contained' : 'outlined'
                    }
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, budget: '25' }))
                    }
                  >
                    ~25€
                  </Button>
                  <Button
                    size="small"
                    variant={
                      formData.budget === '50' ? 'contained' : 'outlined'
                    }
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, budget: '50' }))
                    }
                  >
                    ~50€
                  </Button>
                  <Button
                    size="small"
                    variant={
                      formData.budget === '100' ? 'contained' : 'outlined'
                    }
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, budget: '100' }))
                    }
                  >
                    ~100€
                  </Button>
                </ButtonGroup>
                <TextField
                  fullWidth
                  label="Montant personnalisé"
                  name="budget"
                  type="number"
                  size="small"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Ou saisissez un montant précis..."
                  InputProps={{
                    endAdornment: <Typography variant="body2">€</Typography>,
                  }}
                />
              </Box>

              {/* Durée de visite avec slider */}
              <Box>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                  Durée de visite :{' '}
                  {formData.visitDuration
                    ? `${Math.floor(Number(formData.visitDuration) / 60)}h ${Number(formData.visitDuration) % 60}min`
                    : 'Non spécifiée'}
                </Typography>
                <ButtonGroup
                  variant="outlined"
                  sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}
                >
                  <Button
                    size="small"
                    variant={
                      formData.visitDuration === '30' ? 'contained' : 'outlined'
                    }
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, visitDuration: '30' }))
                    }
                  >
                    30min
                  </Button>
                  <Button
                    size="small"
                    variant={
                      formData.visitDuration === '60' ? 'contained' : 'outlined'
                    }
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, visitDuration: '60' }))
                    }
                  >
                    1h
                  </Button>
                  <Button
                    size="small"
                    variant={
                      formData.visitDuration === '120'
                        ? 'contained'
                        : 'outlined'
                    }
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, visitDuration: '120' }))
                    }
                  >
                    2h
                  </Button>
                  <Button
                    size="small"
                    variant={
                      formData.visitDuration === '240'
                        ? 'contained'
                        : 'outlined'
                    }
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, visitDuration: '240' }))
                    }
                  >
                    4h
                  </Button>
                  <Button
                    size="small"
                    variant={
                      formData.visitDuration === '480'
                        ? 'contained'
                        : 'outlined'
                    }
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, visitDuration: '480' }))
                    }
                  >
                    Journée
                  </Button>
                </ButtonGroup>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={Number(formData.visitDuration) || 60}
                    onChange={(_, value) =>
                      setFormData((prev) => ({
                        ...prev,
                        visitDuration: value.toString(),
                      }))
                    }
                    min={15}
                    max={480}
                    step={15}
                    marks={[
                      { value: 30, label: '30min' },
                      { value: 120, label: '2h' },
                      { value: 240, label: '4h' },
                      { value: 480, label: '8h' },
                    ]}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) =>
                      `${Math.floor(value / 60)}h ${value % 60}min`
                    }
                  />
                </Box>
              </Box>

              {/* Notes */}
              <TextField
                fullWidth
                label="Notes personnelles (optionnel)"
                name="notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Vos impressions, conseils, anecdotes..."
                helperText="Notes détaillées sur ce lieu"
              />

              {/* Favori */}
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isFavorite}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isFavorite: e.target.checked,
                      }))
                    }
                  />
                }
                label="⭐ Marquer comme lieu favori"
              />
            </Stack>
          </Paper>
        </Grid>

        {/* Colonne droite - Photos, Statut de visite, Dates, Notes */}
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
              {/* Information sur le journal et l'état du voyage */}
              {selectedJournal && travelConstraints && (
                <>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <MenuBookIcon
                        sx={{ color: 'primary.main', fontSize: 18 }}
                      />
                      <Typography variant="body2" fontWeight={500}>
                        Journal : {selectedJournal.title}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayIcon
                        sx={{ color: 'text.secondary', fontSize: 14 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Période du voyage :
                        {selectedJournal.startDate.toLocaleDateString('fr-FR')}
                        au {selectedJournal.endDate.toLocaleDateString('fr-FR')}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Message d'information selon l'état du voyage */}
                  <Alert
                    severity={
                      travelConstraints.status === 'ongoing'
                        ? 'info'
                        : travelConstraints.status === 'future'
                          ? 'warning'
                          : 'success'
                    }
                    icon={
                      travelConstraints.status === 'ongoing' ? (
                        <ScheduleIcon />
                      ) : travelConstraints.status === 'future' ? (
                        <EventIcon />
                      ) : (
                        <CheckCircleIcon />
                      )
                    }
                    sx={{ mt: 2 }}
                  >
                    <Typography variant="body2">
                      {travelConstraints.infoMessage}
                    </Typography>
                  </Alert>
                </>
              )}

              {/* Contrôle du statut de visite selon l'état du voyage */}
              {travelConstraints && (
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <EventAvailableIcon
                      sx={{ color: 'primary.main', fontSize: 20 }}
                    />
                    <Typography variant="body2" fontWeight={500}>
                      Statut de visite
                    </Typography>
                  </Box>

                  {travelConstraints.allowedStatuses.length === 1 ? (
                    // Un seul statut autorisé - affichage en lecture seule
                    <Box
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        bgcolor: 'grey.50',
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        {travelConstraints.allowedStatuses[0] === 'visited' ? (
                          <CheckCircleIcon
                            sx={{ color: 'success.main', fontSize: 18 }}
                          />
                        ) : (
                          <ScheduleIcon
                            sx={{ color: 'warning.main', fontSize: 18 }}
                          />
                        )}
                        <Typography variant="body2" color="text.secondary">
                          {travelConstraints.allowedStatuses[0] === 'visited'
                            ? 'Uniquement "Lieu visité" disponible pour ce voyage'
                            : 'Uniquement "Lieu planifié" disponible pour ce voyage'}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    // Plusieurs statuts autorisés - choix libre
                    <FormControl component="fieldset">
                      <RadioGroup
                        value={formData.visited ? 'visited' : 'planned'}
                        onChange={(e) =>
                          handleCustomChange(
                            'visited',
                            e.target.value === 'visited'
                          )
                        }
                      >
                        <FormControlLabel
                          value="visited"
                          control={<Radio />}
                          label={
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <CheckCircleIcon
                                sx={{ color: 'success.main', fontSize: 18 }}
                              />
                              <span>J'ai visité ce lieu</span>
                            </Box>
                          }
                          disabled={
                            !travelConstraints.allowedStatuses.includes(
                              'visited'
                            )
                          }
                        />
                        <FormControlLabel
                          value="planned"
                          control={<Radio />}
                          label={
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <ScheduleIcon
                                sx={{ color: 'warning.main', fontSize: 18 }}
                              />
                              <span>Je planifie visiter ce lieu</span>
                            </Box>
                          }
                          disabled={
                            !travelConstraints.allowedStatuses.includes(
                              'planned'
                            )
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                </Box>
              )}

              {/* Fallback si pas de journal sélectionné */}
              {!travelConstraints && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.visited}
                      onChange={(e) =>
                        handleCustomChange('visited', e.target.checked)
                      }
                    />
                  }
                  label="J'ai visité ce lieu"
                />
              )}

              {/* Note et dates de visite (si visité) */}
              {formData.visited && (
                <>
                  <Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <CheckCircleIcon
                        sx={{ color: 'success.main', fontSize: 18 }}
                      />
                      <Typography component="legend" fontWeight={500}>
                        Note de visite
                      </Typography>
                    </Box>
                    <Rating
                      value={formData.rating || 0}
                      onChange={(_, value) =>
                        handleCustomChange('rating', value || 0)
                      }
                      size="large"
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label={
                      formData.visited
                        ? 'Date de début de visite'
                        : 'Date prévue de début'
                    }
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => {
                      handleCustomChange('startDate', e.target.value);
                      // Auto-remplir la date de fin si elle n'est pas définie
                      if (
                        !formData.endDate ||
                        formData.endDate === formData.startDate
                      ) {
                        handleCustomChange('endDate', e.target.value);
                      }
                      // Mettre à jour la date principale pour compatibilité
                      handleCustomChange('dateVisited', e.target.value);
                    }}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.startDate}
                    helperText={
                      errors.startDate ||
                      (formData.visited
                        ? 'Date du premier jour de visite de ce lieu'
                        : 'Date prévue pour la visite')
                    }
                  />

                  <TextField
                    fullWidth
                    label={
                      formData.visited
                        ? 'Date de fin de visite'
                        : 'Date prévue de fin'
                    }
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => {
                      handleCustomChange('endDate', e.target.value);
                      // Mettre à jour la date principale si c'est une visite d'un seul jour
                      if (formData.startDate === e.target.value) {
                        handleCustomChange('dateVisited', e.target.value);
                      }
                    }}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: formData.startDate,
                    }}
                    error={!!errors.endDate}
                    helperText={
                      errors.endDate ||
                      (formData.visited
                        ? "Date du dernier jour (peut être la même que le début pour une visite d'un jour)"
                        : "Date prévue de fin (peut être identique au début pour une visite d'un jour)")
                    }
                  />
                </>
              )}

              {/* Dates pour lieux à visiter */}
              {!formData.visited && (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mt: 2,
                      mb: 2,
                    }}
                  >
                    <CalendarTodayIcon
                      sx={{ color: 'primary.main', fontSize: 18 }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Planification de visite
                    </Typography>
                  </Box>

                  <TextField
                    fullWidth
                    label="Date prévue de début"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => {
                      handleCustomChange('startDate', e.target.value);
                      // Auto-remplir la date de fin si elle n'est pas définie
                      if (
                        !formData.endDate ||
                        formData.endDate === formData.startDate
                      ) {
                        handleCustomChange('endDate', e.target.value);
                      }
                      // Mettre à jour la date principale pour compatibilité
                      handleCustomChange('dateVisited', e.target.value);
                    }}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.startDate}
                    helperText={
                      errors.startDate || 'Date prévue pour la visite'
                    }
                  />

                  <TextField
                    fullWidth
                    label="Date prévue de fin"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => {
                      handleCustomChange('endDate', e.target.value);
                      // Mettre à jour la date principale si c'est une visite d'un seul jour
                      if (formData.startDate === e.target.value) {
                        handleCustomChange('dateVisited', e.target.value);
                      }
                    }}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: formData.startDate,
                    }}
                    error={!!errors.endDate}
                    helperText={
                      errors.endDate ||
                      "Date prévue de fin (peut être identique au début pour une visite d'un jour)"
                    }
                  />
                </>
              )}
            </Stack>
          </Paper>

          {/* Section 3: Date principale (pour compatibilité) */}
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
              Date principale
            </Typography>

            <Stack spacing={3}>
              {/* Date principale de visite (pour compatibilité backend) */}
              <TextField
                fullWidth
                label="Date de visite principale"
                name="dateVisited"
                value={formData.dateVisited}
                onChange={handleChange}
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                helperText="Date principale utilisée pour le tri et l'affichage"
              />
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
