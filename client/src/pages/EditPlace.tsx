import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
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
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  MenuBook as MenuBookIcon,
  DateRange as DateRangeIcon,
  Star as StarIcon,
  Camera as CameraIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useJournals } from '../context/JournalContext';
import { placeApi } from '../services/place-api';
import { API_CONFIG } from '../config/api.config';
import PlaceSearchInput from '../components/PlaceSearchInput';
import type { GeocodingResult } from '../services/geocoding.service';
import type { Place } from '../types/index';
import {
  getTravelDateConstraints,
  suggestDefaultDates,
  type TravelDateConstraints,
} from '../utils/travel-logic';
import { SmartPlaceDateForm } from '../components/travel';

// Tags prédéfinis suggérés
const SUGGESTED_TAGS = [
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
  const [hasAutoAdjusted, setHasAutoAdjusted] = useState(false);

  // État du stepper
  const [activeStep, setActiveStep] = useState(0);

  // Configuration des étapes avec couleur unifiée
  const stepperColor = '#4F86F7';
  const steps = [
    {
      label: 'Informations de base',
      description: 'Nom, ville et description du lieu',
      icon: <LocationIcon />,
    },
    {
      label: 'Statut & Dates',
      description: 'Visité ou à visiter, dates de visite',
      icon: <DateRangeIcon />,
    },
    {
      label: 'Photos & Médias',
      description: 'Images et tags du lieu',
      icon: <CameraIcon />,
    },
    {
      label: 'Expérience de visite',
      description: 'Note, météo, budget et notes',
      icon: <StarIcon />,
    },
    {
      label: 'Journal & Sauvegarde',
      description: 'Finalisation des modifications',
      icon: <MenuBookIcon />,
    },
  ];

  // 📅 Récupérer le journal du lieu pour contraindre les dates (stable avec useMemo)
  const selectedJournal = useMemo(() => {
    return originalPlace
      ? journals.find((j) => j.id === formData.journalId)
      : null;
  }, [originalPlace, journals, formData.journalId]);

  // 📅 Calculer les contraintes de dates selon l'état temporel du voyage (stable avec useMemo)
  const travelConstraints: TravelDateConstraints | null = useMemo(() => {
    return selectedJournal ? getTravelDateConstraints(selectedJournal) : null;
  }, [selectedJournal]);

  // Charger les données du lieu à modifier (directement depuis l'API pour avoir toutes les données)
  useEffect(() => {
    const fetchPlace = async () => {
      if (!id) return;

      try {
        console.log('🔍 [EditPlace] Chargement du lieu avec ID:', id);

        // 1. Charger les données complètes depuis l'API (comme PlaceDetail)
        const apiPlace = await placeApi.getPlaceById(id);
        console.log("✅ [EditPlace] Données complètes de l'API:", apiPlace);

        // 2. Trouver le journal associé dans le contexte local
        let journalId = '';
        for (const journal of journals) {
          const foundPlace = journal.places.find((p) => p.id === id);
          if (foundPlace) {
            journalId = journal.id;
            console.log('✅ [EditPlace] Journal trouvé:', journal.title);
            break;
          }
        }

        if (!journalId) {
          console.error('❌ [EditPlace] Journal non trouvé pour ce lieu');
          navigate('/places');
          return;
        }

        // 3. Convertir les données API vers le format local
        const place = {
          id: apiPlace._id,
          name: apiPlace.name,
          city: apiPlace.location?.city || '',
          country: apiPlace.location?.country || '',
          description: apiPlace.description || '',
          address: apiPlace.location?.address || '',
          latitude: apiPlace.location?.coordinates?.[1],
          longitude: apiPlace.location?.coordinates?.[0],
          dateVisited: new Date(apiPlace.date_visited),
          startDate: apiPlace.start_date
            ? new Date(apiPlace.start_date)
            : new Date(apiPlace.date_visited),
          endDate: apiPlace.end_date
            ? new Date(apiPlace.end_date)
            : new Date(apiPlace.date_visited),
          photos:
            apiPlace.photos?.map((photo: { url: string }) => photo.url) || [],
          tags: apiPlace.tags || [],
          visited: true, // Si c'est dans l'API, c'est créé donc potentiellement visité
          rating: apiPlace.rating || 0,
          weather: apiPlace.weather || '',
          budget: apiPlace.budget,
          isFavorite: apiPlace.is_favorite || false,
          visitDuration: apiPlace.visit_duration,
          notes: apiPlace.notes || '',
          journalId,
        };

        // 4. Calculer le statut visité de manière intelligente
        const hasVisitDetails = !!(
          place.rating ||
          place.weather ||
          place.budget ||
          place.visitDuration ||
          place.notes
        );
        const isDateInPast = new Date(place.dateVisited) <= new Date();
        const actuallyVisited =
          hasVisitDetails || (place.visited && isDateInPast);

        // 5. Préparer les données du formulaire
        const newFormData = {
          name: place.name || '',
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
          visited: actuallyVisited,
          rating: place.rating || 0,
          weather: place.weather || '',
          budget: place.budget?.toString() || '',
          visitDuration: place.visitDuration?.toString() || '',
          notes: place.notes || '',
          isFavorite: place.isFavorite || false,
          latitude: place.latitude?.toString() || '',
          longitude: place.longitude?.toString() || '',
          journalId,
        };

        console.log("📝 [EditPlace] Données complètes de l'API:", apiPlace);
        console.log('📝 [EditPlace] Données converties:', place);
        console.log('📝 [EditPlace] FormData générées:', newFormData);

        setOriginalPlace(place);
        setFormData(newFormData);
      } catch (error) {
        console.error('❌ [EditPlace] Erreur lors du chargement:', error);
        navigate('/places');
      }
    };

    fetchPlace();
  }, [id, journals, navigate]);

  // 📅 Ajuster automatiquement le statut et les dates selon l'état temporel du voyage (exécuté une seule fois après chargement)
  useEffect(() => {
    if (
      originalPlace &&
      selectedJournal &&
      travelConstraints &&
      formData.journalId &&
      !hasAutoAdjusted
    ) {
      // Seule exécution après le chargement initial des données
      const hasVisitDetails = !!(
        originalPlace.rating ||
        originalPlace.weather ||
        originalPlace.budget ||
        originalPlace.visitDuration ||
        originalPlace.notes
      );

      // Ne pas modifier si l'utilisateur a déjà des données
      if (!hasVisitDetails) {
        setFormData((prev) => {
          const newData = { ...prev };

          // Pour les voyages passés, suggérer le statut "visité" uniquement si pas de détails de visite
          if (
            travelConstraints.status === 'past' &&
            !hasVisitDetails &&
            !prev.visited
          ) {
            newData.visited = true;

            // Ajuster les dates pour les lieux visités
            const suggestedDates = suggestDefaultDates(true, travelConstraints);
            newData.startDate = suggestedDates.startDate;
            newData.endDate = suggestedDates.endDate;
            newData.dateVisited = suggestedDates.startDate;
          }

          return newData;
        });
      }

      setHasAutoAdjusted(true);
    }
  }, [
    originalPlace,
    selectedJournal,
    travelConstraints,
    formData.journalId,
    hasAutoAdjusted,
  ]); // Toutes les dépendances incluses

  const handleChange = (
    field: string,
    value: string | boolean | number | string[]
  ) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // 📅 Ajuster les dates automatiquement quand on change le statut "visité"
      if (field === 'visited' && travelConstraints) {
        const isVisited = value as boolean;
        const suggestedDates = suggestDefaultDates(
          isVisited,
          travelConstraints
        );

        newData.startDate = suggestedDates.startDate;
        newData.endDate = suggestedDates.endDate;
        newData.dateVisited = suggestedDates.startDate;
      }

      return newData;
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Navigation du stepper
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const extractLocationFromDisplayName = (displayName: string) => {
    const parts = displayName.split(',').map((part) => part.trim());
    if (parts.length >= 2) {
      const country = parts[parts.length - 1];
      let city = '';
      if (parts.length >= 3) {
        city = parts[1];
      } else if (parts.length === 2) {
        city = parts[0];
      }
      return { city, country };
    }
    return { city: '', country: '' };
  };

  const handlePlaceSelect = (place: GeocodingResult) => {
    const { city, country } = extractLocationFromDisplayName(
      place.display_name
    );

    setFormData((prev) => ({
      ...prev,
      name: prev.name.trim() || place.name,
      city: prev.city.trim() || city,
      country: prev.country.trim() || country,
      latitude: place.coordinates.latitude.toString(),
      longitude: place.coordinates.longitude.toString(),
    }));
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && originalPlace) {
      const fileArray = Array.from(files);
      
      // Limiter à 4 photos maximum
      const filesToProcess = fileArray.slice(0, 4 - formData.photos.length);

      try {
        // Créer un FormData pour l'upload
        const formDataUpload = new FormData();
        filesToProcess.forEach((file, index) => {
          formDataUpload.append('photos', file);
          formDataUpload.append(`captions[${index}]`, ''); // Caption vide par défaut
        });

        // Utiliser l'API existante d'upload de photos avec axios
        const response = await axios.post(
          `${API_CONFIG.BASE_URL}/api/places/${originalPlace.id}/photos`,
          formDataUpload,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          }
        );

        const updatedPlace = response.data as { photos: { url: string }[] };
        
        // Mettre à jour les photos avec les URLs Cloudinary retournées
        const newPhotoUrls = updatedPlace.photos.map((photo) => photo.url);
        
        setFormData((prev) => ({
          ...prev,
          photos: newPhotoUrls.slice(0, 4),
        }));

        // Réinitialiser l'input file
        event.target.value = '';
      } catch (error) {
        console.error("Erreur lors de l'upload des photos:", error);
        alert("Erreur lors de l'upload des photos");
      }
    }
  };

  const handleRemovePhoto = async (indexToRemove: number) => {
    if (!originalPlace) return;

    try {
      // Obtenir l'URL de la photo à supprimer
      const photoToRemove = formData.photos[indexToRemove];
      
      // Si c'est une URL Cloudinary (déjà sauvée), on doit la supprimer du serveur
      if (photoToRemove && !photoToRemove.startsWith('data:')) {
        // Récupérer les informations actuelles de la place pour obtenir les IDs des photos
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}/api/places/${originalPlace.id}`,
          { withCredentials: true }
        );
        
        const currentPlace = response.data as {
          photos: { _id: string; url: string }[];
        };
        const photoInfo = currentPlace.photos.find(
          (photo) => photo.url === photoToRemove
        );
        
        if (photoInfo && photoInfo._id) {
          // Supprimer la photo via l'API
          await axios.delete(
            `${API_CONFIG.BASE_URL}/api/places/${originalPlace.id}/photos/${photoInfo._id}`,
            { withCredentials: true }
          );
        }
      }
      
      // Mettre à jour l'état local
      setFormData((prev) => ({
        ...prev,
        photos: prev.photos.filter((_, index) => index !== indexToRemove),
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression de la photo:', error);
      alert('Erreur lors de la suppression de la photo');
    }
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
      visited: formData.visited, // ✅ Inclure le statut visité
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

  // Rendu des étapes
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderBasicInfoStep();
      case 1:
        return renderDatesStep();
      case 2:
        return renderPhotosStep();
      case 3:
        return renderExperienceStep();
      case 4:
        return renderJournalStep();
      default:
        return null;
    }
  };

  // Étape 1: Informations de base
  const renderBasicInfoStep = () => (
    <Box sx={{ py: 2 }}>
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
            label="Ville"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="Ex: Paris"
          />
          <TextField
            fullWidth
            label="Pays"
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            placeholder="Ex: France"
          />
        </Box>

        {/* Description */}
        <TextField
          fullWidth
          label="Description *"
          multiline
          rows={4}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          error={!!errors.description}
          helperText={errors.description}
          placeholder="Décrivez ce lieu, son histoire, ses particularités..."
        />

        {/* Coordonnées GPS */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Latitude"
            type="number"
            inputProps={{ step: 'any' }}
            value={formData.latitude}
            onChange={(e) => handleChange('latitude', e.target.value)}
            placeholder="Ex: 48.8566"
          />
          <TextField
            fullWidth
            label="Longitude"
            type="number"
            inputProps={{ step: 'any' }}
            value={formData.longitude}
            onChange={(e) => handleChange('longitude', e.target.value)}
            placeholder="Ex: 2.3522"
          />
        </Box>
      </Stack>
    </Box>
  );

  // Étape 2: Statut & Dates
  const renderDatesStep = () => (
    <Box sx={{ py: 2 }}>
      {selectedJournal && travelConstraints ? (
        <SmartPlaceDateForm
          journal={selectedJournal}
          visited={formData.visited}
          onVisitedChange={(visited) => handleChange('visited', visited)}
          startDate={formData.startDate ? new Date(formData.startDate) : null}
          onStartDateChange={(date) => {
            const dateString = date?.toISOString().split('T')[0] || '';
            handleChange('startDate', dateString);
            if (!formData.endDate || formData.endDate === formData.startDate) {
              handleChange('endDate', dateString);
            }
            handleChange('dateVisited', dateString);
          }}
          endDate={formData.endDate ? new Date(formData.endDate) : null}
          onEndDateChange={(date) => {
            const dateString = date?.toISOString().split('T')[0] || '';
            handleChange('endDate', dateString);
            if (formData.startDate === dateString) {
              handleChange('dateVisited', dateString);
            }
          }}
          errors={{
            startDate: errors.startDate,
            endDate: errors.endDate,
            visited: errors.visited,
          }}
          hasAttachments={formData.photos.length > 0 || !!formData.notes}
        />
      ) : (
        <Stack spacing={3}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.visited}
                onChange={(e) => handleChange('visited', e.target.checked)}
              />
            }
            label="J'ai visité ce lieu"
          />

          <TextField
            fullWidth
            label="Date de visite"
            type="date"
            value={formData.startDate}
            onChange={(e) => {
              handleChange('startDate', e.target.value);
              handleChange('endDate', e.target.value);
              handleChange('dateVisited', e.target.value);
            }}
            InputLabelProps={{ shrink: true }}
            error={!!errors.startDate}
            helperText={errors.startDate}
          />
        </Stack>
      )}
    </Box>
  );

  // Étape 3: Photos & Médias
  const renderPhotosStep = () => (
    <Box sx={{ py: 2 }}>
      <Stack spacing={3}>
        <Typography variant="h6">
          Photos ({formData.photos.length}/4)
        </Typography>

        {/* Upload photos */}
        {formData.photos.length < 4 && (
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            sx={{ py: 2 }}
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

        {/* Photos existantes */}
        {formData.photos.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {formData.photos.map((photo, index) => (
              <Box
                key={index}
                sx={{ position: 'relative', width: 120, height: 120 }}
              >
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 8,
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemovePhoto(index)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' },
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        <Typography variant="h6">Tags</Typography>

        {/* Tags sélectionnés */}
        {formData.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleTagRemove(tag)}
                color="primary"
                variant="filled"
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
          />
          <Button variant="outlined" onClick={handleCustomTagAdd}>
            Ajouter
          </Button>
        </Box>

        {/* Tags suggérés */}
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Tags suggérés :
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {SUGGESTED_TAGS.filter((tag) => !formData.tags.includes(tag))
              .slice(0, 10)
              .map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => handleTagAdd(tag)}
                  variant="outlined"
                  size="small"
                />
              ))}
          </Box>
        </Box>
      </Stack>
    </Box>
  );

  // Étape 4: Expérience de visite
  const renderExperienceStep = () => (
    <Box sx={{ py: 2 }}>
      <Stack spacing={3}>
        {/* Note de visite (si visité) */}
        {formData.visited && (
          <>
            <Typography variant="h6">Note de visite</Typography>
            <Rating
              value={formData.rating}
              onChange={(_, value) => handleChange('rating', value || 0)}
              size="large"
            />
          </>
        )}

        {/* Météo */}
        <FormControl fullWidth>
          <InputLabel>Météo lors de la visite</InputLabel>
          <Select
            value={formData.weather}
            onChange={(e) => handleChange('weather', e.target.value)}
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
          </Select>
        </FormControl>

        {/* Budget */}
        <TextField
          fullWidth
          label="Budget approximatif (€)"
          type="number"
          value={formData.budget}
          onChange={(e) => handleChange('budget', e.target.value)}
          placeholder="Coût de la visite en euros"
        />

        {/* Durée de visite */}
        <TextField
          fullWidth
          label="Durée de visite (minutes)"
          type="number"
          value={formData.visitDuration}
          onChange={(e) => handleChange('visitDuration', e.target.value)}
          placeholder="Temps passé sur place"
        />

        {/* Notes */}
        <TextField
          fullWidth
          label="Notes personnelles"
          multiline
          rows={4}
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Vos impressions, conseils, anecdotes..."
        />

        {/* Favori */}
        <FormControlLabel
          control={
            <Switch
              checked={formData.isFavorite}
              onChange={(e) => handleChange('isFavorite', e.target.checked)}
            />
          }
          label="⭐ Marquer comme lieu favori"
        />
      </Stack>
    </Box>
  );

  // Étape 5: Journal & Sauvegarde
  const renderJournalStep = () => (
    <Box sx={{ py: 2 }}>
      <Stack spacing={3}>
        <Typography variant="h6">Finalisation</Typography>

        {/* Résumé avant sauvegarde */}
        <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Résumé des modifications
          </Typography>
          <Stack spacing={1}>
            <Typography>
              <strong>Lieu :</strong> {formData.name || 'Non défini'}
            </Typography>
            <Typography>
              <strong>Ville :</strong> {formData.city || 'Non définie'},{' '}
              {formData.country || 'Non défini'}
            </Typography>
            <Typography>
              <strong>Statut :</strong>{' '}
              {formData.visited ? 'Visité' : 'À visiter'}
            </Typography>
            <Typography>
              <strong>Date :</strong> {formData.startDate || 'Non définie'}
            </Typography>
            <Typography>
              <strong>Photos :</strong> {formData.photos.length} photo(s)
            </Typography>
            <Typography>
              <strong>Tags :</strong> {formData.tags.length} tag(s)
            </Typography>
            {formData.visited && (
              <Typography>
                <strong>Note :</strong> {formData.rating}/5 étoiles
              </Typography>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );

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
    <Container maxWidth="md" sx={{ py: 4 }}>
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
            Modifier le lieu
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Modifier les informations de ce lieu -{' '}
            {steps[activeStep].description}
          </Typography>
        </Box>
      </Box>

      {/* Indicateur de progression coloré */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body2"
          sx={{ mb: 1, color: 'text.secondary', textAlign: 'center' }}
        >
          Étape {activeStep + 1} sur {steps.length}
        </Typography>
        <Box
          sx={{
            width: '100%',
            height: 6,
            backgroundColor: 'grey.200',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: `${((activeStep + 1) / steps.length) * 100}%`,
              height: '100%',
              backgroundColor: stepperColor,
              borderRadius: 3,
              transition: 'all 0.5s ease',
              boxShadow: `0 0 10px ${stepperColor}66`,
            }}
          />
        </Box>
      </Box>

      {/* Stepper avec couleurs */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          border: `2px solid ${stepperColor}22`,
          borderRadius: 2,
        }}
      >
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          sx={{
            '& .MuiStepConnector-line': {
              borderColor: `${stepperColor}44`,
            },
          }}
        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                icon={
                  <Box
                    component="span"
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor:
                        index === activeStep
                          ? stepperColor
                          : index < activeStep
                            ? '#4CAF50'
                            : 'grey.300',
                      color: 'white',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      boxShadow:
                        index === activeStep
                          ? `0 0 10px ${stepperColor}66`
                          : 'none',
                    }}
                  >
                    {React.cloneElement(step.icon, {
                      sx: { fontSize: 16, color: 'white' },
                    })}
                  </Box>
                }
                sx={{
                  '& .MuiStepLabel-label': {
                    fontWeight: index === activeStep ? 600 : 500,
                    color: index === activeStep ? stepperColor : 'text.primary',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                <Typography component="span">{step.label}</Typography>
              </StepLabel>
              <StepContent
                sx={{
                  borderLeft: `2px solid ${index === activeStep ? stepperColor + '44' : 'grey.300'}`,
                  ml: 1.5,
                  pl: 2,
                }}
              >
                {renderStepContent(index)}

                {/* Boutons de navigation */}
                <Box sx={{ mt: 3 }}>
                  <Stack direction="row" spacing={2}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      variant="outlined"
                      sx={{
                        borderColor: 'error.main',
                        color: 'error.main',
                        '&:hover': {
                          borderColor: 'error.dark',
                          color: 'error.dark',
                        },
                        '&:disabled': {
                          borderColor: 'grey.300',
                          color: 'grey.400',
                        },
                      }}
                    >
                      Précédent
                    </Button>

                    {activeStep === steps.length - 1 ? (
                      <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                          background: `linear-gradient(45deg, ${theme.palette.error.main} 30%, ${theme.palette.error.light} 90%)`,
                          '&:hover': {
                            background: `linear-gradient(45deg, ${theme.palette.error.dark} 30%, ${theme.palette.error.main} 90%)`,
                          },
                        }}
                        startIcon={<CloudUploadIcon />}
                      >
                        Modifier
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{
                          background: `linear-gradient(45deg, ${theme.palette.error.main} 30%, ${theme.palette.error.light} 90%)`,
                          '&:hover': {
                            background: `linear-gradient(45deg, ${theme.palette.error.dark} 30%, ${theme.palette.error.main} 90%)`,
                          },
                        }}
                      >
                        Suivant
                      </Button>
                    )}
                  </Stack>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Bouton d'annulation global */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="text" onClick={() => navigate(-1)} color="error">
          Annuler et retourner
        </Button>
      </Box>
    </Container>
  );
};

export default EditPlace;
