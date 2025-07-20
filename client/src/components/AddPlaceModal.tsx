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
} from '@mui/icons-material';
import { useJournals } from '../context/JournalContext';

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
    latitude: '',
    longitude: '',
    dateVisited: new Date().toISOString().split('T')[0],
    photos: [''],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
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
      newErrors.name = 'Place name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.latitude || isNaN(Number(formData.latitude))) {
      newErrors.latitude = 'Valid latitude is required';
    }

    if (!formData.longitude || isNaN(Number(formData.longitude))) {
      newErrors.longitude = 'Valid longitude is required';
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
      // Si aucun journal n'existe, on peut soit créer un journal par défaut
      // ou demander à l'utilisateur de créer un journal d'abord
      alert('Please create a journal first before adding places');
      return;
    }

    addPlace(journalId, {
      name: formData.name.trim(),
      description: formData.description.trim(),
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      dateVisited: new Date(formData.dateVisited),
      photos: validPhotos,
    });

    // Reset form
    setFormData({
      name: '',
      description: '',
      latitude: '',
      longitude: '',
      dateVisited: new Date().toISOString().split('T')[0],
      photos: [''],
    });
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
          Add A New Place
        </Typography>
        <IconButton onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, pb: 2 }}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Place Name *"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              placeholder="e.g., Eiffel Tower, Paris, France"
            />
          </Grid>

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
              placeholder="Describe this amazing place..."
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Latitude *"
              type="number"
              inputProps={{ step: 'any' }}
              value={formData.latitude}
              onChange={(e) => handleChange('latitude', e.target.value)}
              error={!!errors.latitude}
              helperText={errors.latitude}
              placeholder="48.8584"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Longitude *"
              type="number"
              inputProps={{ step: 'any' }}
              value={formData.longitude}
              onChange={(e) => handleChange('longitude', e.target.value)}
              error={!!errors.longitude}
              helperText={errors.longitude}
              placeholder="2.2945"
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="Date Visited"
              type="date"
              value={formData.dateVisited}
              onChange={(e) => handleChange('dateVisited', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

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
              Ajoute une photo
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
          Cancel
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
