import React, { useState, useEffect } from 'react';
import { useJournals } from '../context/JournalContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  IconButton,
  Box,
  Typography,
  Rating,
  FormControlLabel,
  Checkbox,
  Chip,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import type { Place } from '../types/index';

interface EditPlaceModalProps {
  place: Place;
  journalId: string;
  onClose: () => void;
}

const EditPlaceModal: React.FC<EditPlaceModalProps> = ({
  place,
  journalId,
  onClose,
}) => {
  const { updatePlace } = useJournals();
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    country: '',
    description: '',
    latitude: '',
    longitude: '',
    dateVisited: '',
    photos: [''],
    imageUrl: '',
    tags: [] as string[],
    visited: false,
    rating: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customTag, setCustomTag] = useState('');

  useEffect(() => {
    setFormData({
      name: place.name,
      city: place.city || '',
      country: place.country || '',
      description: place.description || '',
      latitude: place.latitude?.toString() || '',
      longitude: place.longitude?.toString() || '',
      dateVisited: place.dateVisited.toISOString().split('T')[0],
      photos: place.photos.length > 0 ? place.photos : [''],
      imageUrl: place.imageUrl || '',
      tags: place.tags || [],
      visited: place.visited || false,
      rating: place.rating || 0,
    });
  }, [place]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (index: number, value: string) => {
    const newPhotos = [...formData.photos];
    newPhotos[index] = value;
    setFormData((prev) => ({ ...prev, photos: newPhotos }));
  };

  const addPhotoField = () => {
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, ''] }));
  };

  const removePhotoField = (index: number) => {
    if (formData.photos.length > 1) {
      const newPhotos = formData.photos.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, photos: newPhotos }));
    }
  };

  const handleAddTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
    setCustomTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const predefinedTags = [
    'Restaurant',
    'Musée',
    'Monument',
    'Nature',
    'Plage',
    'Montagne',
    'Ville',
    'Shopping',
    'Parc',
    'Architecture',
    'Culture',
    'Aventure',
    'Détente',
  ];

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

    if (!formData.latitude || isNaN(Number(formData.latitude))) {
      newErrors.latitude = 'Latitude valide requise';
    }

    if (!formData.longitude || isNaN(Number(formData.longitude))) {
      newErrors.longitude = 'Longitude valide requise';
    }

    if (!formData.dateVisited) {
      newErrors.dateVisited = 'La date de visite est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const validPhotos = formData.photos.filter((photo) => photo.trim() !== '');

    updatePlace(journalId, place.id, {
      name: formData.name.trim(),
      city: formData.city.trim(),
      country: formData.country.trim(),
      description: formData.description.trim(),
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      dateVisited: new Date(formData.dateVisited),
      photos: validPhotos,
      imageUrl: formData.imageUrl.trim() || undefined,
      tags: formData.tags,
      visited: formData.visited,
      rating: formData.rating,
    });

    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5">Modifier le lieu</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
          <Grid container spacing={4}>
            {/* Colonne gauche - Informations de base, GPS, Tags */}
            <Grid size={{ xs: 12, md: 6 }}>
              {/* Section 1: Informations de base */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 1,
                  border: '1px solid #e0e0e0',
                  mb: 3,
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontFamily: '"Chau Philomene One", cursive' }}
                  >
                    Informations de base
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {/* Nom du lieu */}
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Nom du lieu *"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={!!errors.name}
                      helperText={errors.name}
                      placeholder="Ex: Tour Eiffel"
                      required
                    />
                  </Grid>

                  {/* Ville et Pays */}
                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="Ville *"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      error={!!errors.city}
                      helperText={errors.city}
                      placeholder="Ex: Paris"
                      required
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="Pays *"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      error={!!errors.country}
                      helperText={errors.country}
                      placeholder="Ex: France"
                      required
                    />
                  </Grid>

                  {/* Description */}
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Description *"
                      name="description"
                      multiline
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      error={!!errors.description}
                      helperText={errors.description}
                      placeholder="Décrivez ce lieu..."
                      required
                    />
                  </Grid>

                  {/* URL Image */}
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="URL de l'image"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Section 2: Localisation GPS */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 1,
                  border: '1px solid #e0e0e0',
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 3, fontFamily: '"Chau Philomene One", cursive' }}
                >
                  Localisation GPS
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    error={!!errors.latitude}
                    helperText={errors.latitude}
                    placeholder="48.8584"
                    type="number"
                    inputProps={{ step: 'any' }}
                  />
                  <TextField
                    fullWidth
                    label="Longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    error={!!errors.longitude}
                    helperText={errors.longitude}
                    placeholder="2.2945"
                    type="number"
                    inputProps={{ step: 'any' }}
                  />
                </Box>
              </Paper>

              {/* Section 3: Tags et catégories */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 1,
                  border: '1px solid #e0e0e0',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 3, fontFamily: '"Chau Philomene One", cursive' }}
                >
                  Tags et catégories
                </Typography>

                <Grid container spacing={3}>
                  {/* Tags actuels */}
                  {formData.tags.length > 0 && (
                    <Grid size={12}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {formData.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            onDelete={() => handleRemoveTag(tag)}
                            variant="filled"
                            color="primary"
                          />
                        ))}
                      </Box>
                    </Grid>
                  )}

                  {/* Ajouter un tag personnalisé */}
                  <Grid size={12}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        placeholder="Ajouter un tag personnalisé..."
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag(customTag);
                          }
                        }}
                        size="small"
                      />
                      <Button
                        onClick={() => handleAddTag(customTag)}
                        variant="outlined"
                        disabled={!customTag.trim()}
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        Ajouter
                      </Button>
                    </Box>
                  </Grid>

                  {/* Tags suggérés */}
                  <Grid size={12}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Tags suggérés:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {predefinedTags
                        .filter((tag) => !formData.tags.includes(tag))
                        .slice(0, 10)
                        .map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            onClick={() => handleAddTag(tag)}
                            variant="outlined"
                            size="small"
                            sx={{ cursor: 'pointer' }}
                          />
                        ))}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Colonne droite - Photos, Date, Rating, Statut */}
            <Grid size={{ xs: 12, md: 6 }}>
              {/* Section 4: Date et statut de visite */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 1,
                  border: '1px solid #e0e0e0',
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 3, fontFamily: '"Chau Philomene One", cursive' }}
                >
                  Date et statut de visite
                </Typography>

                <Grid container spacing={3}>
                  {/* Date de visite */}
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Date de visite"
                      name="dateVisited"
                      value={formData.dateVisited}
                      onChange={handleChange}
                      error={!!errors.dateVisited}
                      helperText={errors.dateVisited}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>

                  {/* Statut visité */}
                  <Grid size={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.visited}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              visited: e.target.checked,
                            }));
                          }}
                        />
                      }
                      label="Lieu déjà visité"
                    />
                  </Grid>

                  {/* Rating */}
                  <Grid size={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body1">Note :</Typography>
                      <Rating
                        value={formData.rating}
                        onChange={(_, newValue) => {
                          setFormData((prev) => ({
                            ...prev,
                            rating: newValue || 0,
                          }));
                        }}
                        size="large"
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({formData.rating}/5)
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Section 5: Photos supplémentaires */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 1,
                  border: '1px solid #e0e0e0',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 3, fontFamily: '"Chau Philomene One", cursive' }}
                >
                  Photos supplémentaires
                </Typography>

                <Grid container spacing={2}>
                  {formData.photos.map((photo, index) => (
                    <Grid size={12} key={index}>
                      <Box
                        sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
                      >
                        <TextField
                          fullWidth
                          type="url"
                          value={photo}
                          onChange={(e) =>
                            handlePhotoChange(index, e.target.value)
                          }
                          placeholder="https://example.com/photo.jpg"
                          size="small"
                        />
                        {formData.photos.length > 1 && (
                          <IconButton
                            onClick={() => removePhotoField(index)}
                            color="error"
                            size="small"
                          >
                            <CloseIcon />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  ))}
                  <Grid size={12}>
                    <Button
                      onClick={addPhotoField}
                      startIcon={<AddIcon />}
                      variant="outlined"
                      size="small"
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      Ajouter une photo
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SaveIcon />}
        >
          Sauvegarder
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPlaceModal;
