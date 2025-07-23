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
    description: '',
    latitude: '',
    longitude: '',
    dateVisited: '',
    photos: [''],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({
      name: place.name,
      description: place.description,
      latitude: place.latitude.toString(),
      longitude: place.longitude.toString(),
      dateVisited: place.dateVisited.toISOString().split('T')[0],
      photos: place.photos.length > 0 ? place.photos : [''],
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du lieu est requis';
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
      description: formData.description.trim(),
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      dateVisited: new Date(formData.dateVisited),
      photos: validPhotos,
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

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Nom du lieu"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                placeholder="Ex: Tour Eiffel"
                required
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                placeholder="Décrivez ce lieu..."
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                error={!!errors.latitude}
                helperText={errors.latitude}
                placeholder="48.8566"
                inputProps={{ step: 'any' }}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                error={!!errors.longitude}
                helperText={errors.longitude}
                placeholder="2.3522"
                inputProps={{ step: 'any' }}
                required
              />
            </Grid>

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

            <Grid size={12}>
              <Typography variant="subtitle1" gutterBottom>
                Photos (URLs)
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {formData.photos.map((photo, index) => (
                  <Box
                    key={index}
                    sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
                  >
                    <TextField
                      fullWidth
                      type="url"
                      value={photo}
                      onChange={(e) => handlePhotoChange(index, e.target.value)}
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
                ))}
                <Button
                  onClick={addPhotoField}
                  startIcon={<AddIcon />}
                  variant="outlined"
                  size="small"
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Ajouter une photo
                </Button>
              </Box>
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
