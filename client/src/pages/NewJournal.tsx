import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Chip,
  Stack,
  FormControl,
  FormLabel,
  Avatar,
  IconButton,
  useTheme,
  Paper,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  PhotoCamera as PhotoCameraIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useJournals } from '../context/JournalContext';

// Tags prédéfinis suggérés pour les journaux
const SUGGESTED_JOURNAL_TAGS = [
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

const NewJournal: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { addJournal } = useJournals();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    personalNotes: '',
  });
  const [mainPhoto, setMainPhoto] = useState<File | null>(null);
  const [mainPhotoPreview, setMainPhotoPreview] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMainPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setMainPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setMainPhoto(null);
    setMainPhotoPreview('');
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleCustomTagAdd = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      handleTagAdd(customTag.trim());
      setCustomTag('');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La date de début est requise';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'La date de fin est requise';
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) > new Date(formData.endDate)
    ) {
      newErrors.endDate = 'La date de fin doit être après la date de début';
    }

    if (!mainPhoto) {
      newErrors.photo = 'Une photo principale est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Pour l'instant, on simule l'upload de la photo
      // Dans une vraie application, il faudrait l'uploader sur le serveur
      const photoUrl = mainPhotoPreview;

      await addJournal({
        title: formData.title.trim(),
        description: formData.description.trim(),
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        userId: 'user1',
        places: [],
        mainPhoto: photoUrl,
        tags: tags,
        personalNotes: formData.personalNotes.trim() || undefined,
      });

      navigate('/journals');
    } catch (error) {
      console.error('Erreur lors de la création du journal:', error);
      // Ici vous pouvez ajouter une notification d'erreur pour l'utilisateur
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          component={Link}
          to="/journals"
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2, color: 'text.secondary' }}
        >
          Retour
        </Button>
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Chau Philomene One", cursive',
            color: 'primary.main',
          }}
        >
          Nouveau Journal de Voyage
        </Typography>
      </Box>

      {/* Form */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Titre du journal de voyage"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  error={!!errors.title}
                  helperText={errors.title}
                  placeholder="Ex: Voyage en Provence"
                  required
                />
              </Grid>

              {/* Section Photo Principale */}
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth error={!!errors.photo}>
                  <FormLabel sx={{ mb: 2, fontWeight: 'bold' }}>
                    Photo principale du journal *
                  </FormLabel>
                  <Box
                    sx={{
                      border: '2px dashed',
                      borderColor: errors.photo ? 'error.main' : 'grey.300',
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      position: 'relative',
                    }}
                  >
                    {mainPhotoPreview ? (
                      <Box
                        sx={{ position: 'relative', display: 'inline-block' }}
                      >
                        <Avatar
                          src={mainPhotoPreview}
                          sx={{
                            width: 120,
                            height: 120,
                            mx: 'auto',
                            mb: 2,
                          }}
                          variant="rounded"
                        />
                        <IconButton
                          onClick={removePhoto}
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            bgcolor: 'error.main',
                            color: 'white',
                            '&:hover': { bgcolor: 'error.dark' },
                            width: 32,
                            height: 32,
                          }}
                          size="small"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box>
                        <PhotoCameraIcon
                          sx={{ fontSize: 48, color: 'grey.400', mb: 2 }}
                        />
                        <Typography variant="body1" color="text.secondary">
                          Cliquez pour ajouter une photo principale
                        </Typography>
                      </Box>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer',
                      }}
                    />
                  </Box>
                  {errors.photo && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {errors.photo}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Période de voyage */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Période du voyage
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Date de début"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  error={!!errors.startDate}
                  helperText={errors.startDate}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Date de fin"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  error={!!errors.endDate}
                  helperText={errors.endDate}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Description du voyage"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  error={!!errors.description}
                  helperText={errors.description}
                  placeholder="Décrivez votre voyage, vos attentes, les lieux que vous souhaitez visiter..."
                  required
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Notes personnelles"
                  multiline
                  rows={3}
                  value={formData.personalNotes}
                  onChange={(e) =>
                    handleChange('personalNotes', e.target.value)
                  }
                  placeholder="Ajoutez vos notes personnelles sur ce voyage, vos réflexions, souvenirs..."
                />
              </Grid>

              {/* Section Tags */}
              <Grid size={{ xs: 12 }}>
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
                      fontWeight: 'bold',
                    }}
                  >
                    Tags et catégories
                  </Typography>

                  <Stack spacing={3}>
                    {/* Tags actuels */}
                    {tags.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {tags.map((tag, index) => (
                          <Chip
                            key={index}
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
                        disabled={!customTag.trim()}
                      >
                        Ajouter
                      </Button>
                    </Box>

                    {/* Tags suggérés */}
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ mb: 2, fontWeight: 500 }}
                      >
                        Tags suggérés :
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {SUGGESTED_JOURNAL_TAGS.filter(
                          (tag) => !tags.includes(tag)
                        )
                          .slice(0, 12)
                          .map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              onClick={() => handleTagAdd(tag)}
                              variant="outlined"
                              size="small"
                              sx={{ cursor: 'pointer' }}
                            />
                          ))}
                      </Box>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    pt: 2,
                  }}
                >
                  <Button
                    component={Link}
                    to="/journals"
                    variant="outlined"
                    size="large"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    size="large"
                    sx={{
                      background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                      '&:hover': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                      },
                    }}
                  >
                    Créer le journal
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NewJournal;
