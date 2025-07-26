import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useJournals } from '../context/JournalContext';
import PlaceSearchInput from './PlaceSearchInput';
import type { GeocodingResult } from '../services/geocoding.service';

interface AddPlaceModalProps {
  open: boolean;
  onClose: () => void;
}

const AddPlaceModal: React.FC<AddPlaceModalProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { addPlace, journals } = useJournals();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dateVisited: new Date().toISOString().split('T')[0],
    photos: [''],
  });
  const [selectedPlace, setSelectedPlace] = useState<GeocodingResult | null>(
    null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handlePlaceSelect = (place: GeocodingResult) => {
    setSelectedPlace(place);
    // Pré-remplir le nom si l'utilisateur n'en a pas saisi
    if (!formData.name.trim()) {
      setFormData((prev) => ({
        ...prev,
        name: place.name,
      }));
    }
    // Effacer l'erreur de lieu si elle existe
    if (errors.place) {
      setErrors((prev) => ({ ...prev, place: '' }));
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

    if (!selectedPlace) {
      newErrors.place = 'Veuillez sélectionner un lieu';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du lieu est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const validPhotos = formData.photos.filter((photo) => photo.trim() !== '');

    // Ajouter au premier journal ou créer un journal par défaut
    const journalId = journals[0]?.id;

    if (!journalId) {
      alert("Veuillez créer un journal avant d'ajouter des lieux");
      return;
    }

    addPlace(journalId, {
      name: formData.name.trim(),
      description: formData.description.trim(),
      latitude: selectedPlace!.coordinates.latitude,
      longitude: selectedPlace!.coordinates.longitude,
      dateVisited: new Date(formData.dateVisited),
      photos: validPhotos,
    });

    // Reset form
    setFormData({
      name: '',
      description: '',
      dateVisited: new Date().toISOString().split('T')[0],
      photos: [''],
    });
    setSelectedPlace(null);
    setErrors({});

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          m: isMobile ? 0 : 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Ajouter un nouveau lieu
        </Typography>
        <IconButton onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, pb: 2 }}>
        <Grid container spacing={3}>
          {/* Recherche de lieu */}
          <Grid size={12}>
            <PlaceSearchInput
              onPlaceSelect={handlePlaceSelect}
              placeholder="Rechercher un lieu (ex: Tour Eiffel, Paris)"
              label="Rechercher un lieu *"
              error={!!errors.place}
              helperText={
                errors.place || 'Tapez au moins 3 caractères pour rechercher'
              }
            />
            {selectedPlace && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: 'success.50',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'success.200',
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                >
                  <LocationIcon sx={{ color: 'success.main', fontSize: 20 }} />
                  <Typography
                    variant="body2"
                    color="success.main"
                    fontWeight={600}
                  >
                    Lieu sélectionné
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {selectedPlace.display_name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Coordonnées: {selectedPlace.coordinates.latitude.toFixed(4)},{' '}
                  {selectedPlace.coordinates.longitude.toFixed(4)}
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Nom du lieu */}
          <Grid size={12}>
            <TextField
              fullWidth
              label="Nom du lieu *"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              placeholder="ex: Tour Eiffel"
            />
          </Grid>

          {/* Description */}
          <Grid size={12}>
            <TextField
              fullWidth
              label="Description *"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              placeholder="Décrivez ce lieu magnifique..."
            />
          </Grid>

          {/* Date de visite */}
          <Grid size={12}>
            <TextField
              fullWidth
              label="Date de visite"
              type="date"
              value={formData.dateVisited}
              onChange={(e) => handleChange('dateVisited', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Photos */}
          <Grid size={12}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Photos (URLs)
            </Typography>
            {formData.photos.map((photo, index) => (
              <Box
                key={index}
                sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}
              >
                <TextField
                  fullWidth
                  placeholder="https://example.com/photo.jpg"
                  value={photo}
                  onChange={(e) => handlePhotoChange(index, e.target.value)}
                  size="small"
                />
                {formData.photos.length > 1 && (
                  <IconButton
                    onClick={() => removePhotoField(index)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addPhotoField}
              sx={{ color: 'info.main', fontWeight: 600 }}
              size="small"
            >
              Ajouter une photo
            </Button>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          p: { xs: 2, sm: 3 },
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth={isMobile}
          size="large"
        >
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          fullWidth={isMobile}
          size="large"
        >
          Ajouter le lieu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPlaceModal;
