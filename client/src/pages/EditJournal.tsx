import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useJournals } from '../context/JournalContext';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  FormControl,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon,
  Close as CloseIcon,
  LocationOn as LocationOnIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarTodayIcon,
} from '@mui/icons-material';

// Tags prédéfinis suggérés pour les journaux
const SUGGESTED_JOURNAL_TAGS = [
  'Nature',
  'Culture',
  'Gastronomie',
  'Aventure',
  'Famille',
  'Romantique',
  'Solo',
  'Backpacking',
  'Luxe',
  'Budget',
  'Road Trip',
  'City Break',
  'Plage',
  'Montagne',
  'Histoire',
  'Art',
  'Architecture',
  'Photographie',
  'Détente',
  'Sport',
  'Festival',
  'Shopping',
  'Hiver',
  'Été',
];

const EditJournal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getJournal, updateJournal, deletePlace } = useJournals();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    personalNotes: '',
  });
  const [mainPhotoPreview, setMainPhotoPreview] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    placeId: string;
    placeName: string;
  }>({ open: false, placeId: '', placeName: '' });

  const journal = id ? getJournal(id) : undefined;

  useEffect(() => {
    if (journal) {
      setFormData({
        title: journal.title,
        description: journal.description,
        startDate: journal.startDate.toISOString().split('T')[0],
        endDate: journal.endDate.toISOString().split('T')[0],
        personalNotes: journal.personalNotes || '',
      });
      setTags(journal.tags || []);
      if (journal.mainPhoto) {
        setMainPhotoPreview(journal.mainPhoto);
      }
    }
  }, [journal]);

  if (!journal) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4">Journal non trouvé</Typography>
        <Button
          onClick={() => navigate('/journals')}
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Retour aux journaux
        </Button>
      </Container>
    );
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMainPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
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

  const handleDeletePlace = (placeId: string, placeName: string) => {
    setDeleteConfirm({
      open: true,
      placeId,
      placeName,
    });
  };

  const confirmDeletePlace = () => {
    if (deleteConfirm.placeId && journal) {
      deletePlace(journal.id, deleteConfirm.placeId);
      setDeleteConfirm({ open: false, placeId: '', placeName: '' });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const updateData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      personalNotes: formData.personalNotes.trim() || undefined,
      mainPhoto: mainPhotoPreview || undefined,
      tags: tags,
    };

    updateJournal(journal.id, updateData);
    navigate(`/journals/${journal.id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header avec navigation */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Button
          onClick={() => navigate(`/journals/${journal.id}`)}
          startIcon={<ArrowBackIcon />}
          sx={{ color: 'text.secondary' }}
        >
          Retour
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            Sauvegarder
          </Button>
        </Box>
      </Box>

      {/* Titre et métadonnées en mode édition */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="standard"
          value={formData.title}
          name="title"
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
          sx={{
            '& .MuiInput-input': {
              fontSize: '2.125rem',
              fontWeight: 700,
              mb: 1,
            },
          }}
          placeholder="Titre de votre voyage"
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOnIcon
              sx={{ color: 'primary.main', fontSize: '1.2rem' }}
            />
            <Typography variant="body2" color="primary.main" fontWeight={500}>
              {journal.places[0]?.name?.split(',').slice(-2).join(',').trim() ||
                'Destination non définie'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayIcon
              sx={{ color: 'text.secondary', fontSize: '1.2rem' }}
            />
            <TextField
              type="date"
              size="small"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              error={!!errors.startDate}
              sx={{ width: 150 }}
            />
            <Typography variant="body2" color="text.secondary">
              -
            </Typography>
            <TextField
              type="date"
              size="small"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              error={!!errors.endDate}
              sx={{ width: 150 }}
            />
          </Box>
        </Box>
      </Box>

      {/* Image principale en mode édition */}
      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth>
          <FormLabel sx={{ mb: 2, fontWeight: 'bold' }}>
            Photo principale du journal
          </FormLabel>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 400,
              border: '2px dashed',
              borderColor: mainPhotoPreview ? 'transparent' : 'grey.300',
              borderRadius: 2,
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            {mainPhotoPreview ? (
              <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                <CardMedia
                  component="img"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  image={mainPhotoPreview}
                  alt="Photo principale"
                />
                <IconButton
                  onClick={removePhoto}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center',
                }}
              >
                <PhotoCameraIcon
                  sx={{ fontSize: 48, color: 'grey.400', mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary">
                  Cliquez pour modifier la photo principale
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Recommandé: 1200x400px
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
        </FormControl>
      </Box>

      {/* Section Lieux visités */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <LocationOnIcon sx={{ color: 'error.main' }} />
          <Typography
            variant="h6"
            sx={{ fontFamily: '"Chau Philomene One", cursive' }}
          >
            Lieux du voyage ({journal.places.length})
          </Typography>
          <Button
            component={Link}
            to={`/place/new?journalId=${journal.id}`}
            variant="outlined"
            startIcon={<AddIcon />}
            size="small"
            sx={{ ml: 'auto' }}
          >
            Ajouter un lieu
          </Button>
        </Box>

        {journal.places.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              border: '2px dashed',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}
          >
            <LocationOnIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aucun lieu ajouté
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Commencez par ajouter des lieux à votre voyage
            </Typography>
            <Button
              component={Link}
              to={`/place/new?journalId=${journal.id}`}
              variant="contained"
              startIcon={<AddIcon />}
            >
              Ajouter votre premier lieu
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {journal.places.map((place) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={place.id}>
                <Card
                  sx={{
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 2,
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="150"
                      image={
                        place.photos[0] ||
                        'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&q=80&w=400'
                      }
                      alt={place.name}
                    />

                    {/* Bouton de suppression */}
                    <IconButton
                      onClick={() => handleDeletePlace(place.id, place.name)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'error.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' },
                        width: 32,
                        height: 32,
                      }}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>

                    {/* Badge Visité */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        bgcolor: '#4CAF50',
                        color: 'white',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: '1rem' }} />
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 2 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ mb: 0.5 }}
                    >
                      {place.name.split(',')[0]}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        mb: 1,
                      }}
                    >
                      <LocationOnIcon
                        sx={{ fontSize: '0.875rem', color: 'text.secondary' }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {place.name.split(',').slice(1).join(',').trim() ||
                          'Lieu non spécifié'}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        fontStyle: 'italic',
                        color: 'text.secondary',
                        fontSize: '0.8rem',
                        lineHeight: 1.3,
                      }}
                    >
                      "{place.description || 'Aucune description disponible'}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Description en mode édition */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Chau Philomene One", cursive',
            mb: 2,
            color: 'primary.main',
          }}
        >
          Description du voyage
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description}
          placeholder="Décrivez votre voyage, vos attentes, les lieux que vous souhaitez visiter..."
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'grey.300',
              },
            },
          }}
        />
      </Box>

      {/* Notes personnelles en mode édition */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Chau Philomene One", cursive',
            mb: 2,
            color: 'text.primary',
          }}
        >
          Notes personnelles
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          name="personalNotes"
          value={formData.personalNotes}
          onChange={handleChange}
          placeholder="Ajoutez vos notes personnelles sur ce voyage, vos réflexions, souvenirs..."
          sx={{
            '& .MuiOutlinedInput-root': {
              fontStyle: 'italic',
              '& fieldset': {
                borderColor: 'grey.300',
              },
            },
          }}
        />
      </Box>

      {/* Tags en mode édition */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Chau Philomene One", cursive',
            mb: 2,
            color: 'text.primary',
          }}
        >
          Tags et catégories
        </Typography>

        {/* Tags actuels */}
        {tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleTagRemove(tag)}
                sx={{
                  backgroundColor: 'tertiary.main',
                  color: 'primary.main',
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>
        )}

        {/* Ajouter un tag personnalisé */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
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
            disabled={!customTag.trim()}
          >
            Ajouter
          </Button>
        </Box>

        {/* Tags suggérés */}
        <Box>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Tags suggérés :
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {SUGGESTED_JOURNAL_TAGS.filter((tag) => !tags.includes(tag))
              .slice(0, 8)
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
      </Box>

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={deleteConfirm.open}
        onClose={() =>
          setDeleteConfirm({ open: false, placeId: '', placeName: '' })
        }
      >
        <DialogTitle>Supprimer le lieu</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer "{deleteConfirm.placeName}" de ce
            voyage ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setDeleteConfirm({ open: false, placeId: '', placeName: '' })
            }
          >
            Annuler
          </Button>
          <Button
            onClick={confirmDeletePlace}
            color="error"
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditJournal;
