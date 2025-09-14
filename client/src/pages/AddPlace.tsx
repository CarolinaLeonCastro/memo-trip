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
  ButtonGroup,
  Slider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  ExpandMore as ExpandMoreIcon,
  CloudUpload as CloudUploadIcon,
  MenuBook as MenuBookIcon,
  Delete as DeleteIcon,
  DateRange as DateRangeIcon,
  Star as StarIcon,
  Camera as CameraIcon,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useJournals } from '../context/JournalContext';
import PlaceSearchInput from '../components/PlaceSearchInput';
import type { GeocodingResult } from '../services/geocoding.service';
import {
  getTravelDateConstraints,
  validatePlaceDate,
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

const AddPlacePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { addPlace, journals } = useJournals();
  const [searchParams] = useSearchParams();

  // État du stepper
  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    country: '',
    description: '',
    dateVisited: new Date().toISOString().split('T')[0],
    startDate: new Date().toISOString().split('T')[0], // Date de début de visite
    endDate: new Date().toISOString().split('T')[0], // Date de fin de visite
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
    // Nouvelles propriétés pour le journal
    journalOption: 'none', // 'none', 'existing', 'new'
    selectedJournalId: '',
    newJournalTitle: '',
  });

  const [, setSelectedPlace] = useState<GeocodingResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customTag, setCustomTag] = useState('');

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
      description: 'Association au journal et finalisation',
      icon: <MenuBookIcon />,
    },
  ];

  // 🎯 Pré-sélectionner le journal depuis l'URL (quand on vient de EditJournal)
  useEffect(() => {
    const journalIdFromUrl = searchParams.get('journalId');
    if (journalIdFromUrl && journals.length > 0) {
      // Vérifier que le journal existe dans la liste
      const journalExists = journals.find((j) => j.id === journalIdFromUrl);
      if (journalExists) {
        setFormData((prev) => ({
          ...prev,
          journalOption: 'existing',
          selectedJournalId: journalIdFromUrl,
        }));
      }
    }
  }, [searchParams, journals]);

  // 📅 Récupérer le journal sélectionné pour contraindre les dates
  const selectedJournal = formData.selectedJournalId
    ? journals.find((j) => j.id === formData.selectedJournalId)
    : null;

  // 📅 Calculer les contraintes de dates selon l'état temporel du voyage
  const travelConstraints: TravelDateConstraints | null = selectedJournal
    ? getTravelDateConstraints(selectedJournal)
    : null;

  // 📅 Mettre à jour les dates par défaut selon le journal sélectionné
  useEffect(() => {
    if (
      selectedJournal &&
      travelConstraints &&
      formData.startDate === new Date().toISOString().split('T')[0]
    ) {
      const constraints =
        travelConstraints.status === 'past'
          ? travelConstraints.visitedDateConstraints
          : formData.visited
            ? travelConstraints.visitedDateConstraints
            : travelConstraints.plannedDateConstraints;

      if (constraints) {
        // Utiliser la première date autorisée du journal, pas aujourd'hui
        const defaultDate = constraints.min;
        setFormData((prev) => ({
          ...prev,
          startDate: defaultDate,
          endDate: defaultDate, // Par défaut même date, mais modifiable
          dateVisited: defaultDate,
          // Pour les voyages passés, forcer le statut "visité"
          visited: travelConstraints.status === 'past' ? true : prev.visited,
        }));
      }
    }
  }, [
    selectedJournal,
    travelConstraints,
    formData.startDate,
    formData.visited,
  ]);

  // Plus de contraintes de dates nécessaires ici grâce à SmartPlaceDateForm

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

  // Navigation du stepper
  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Validation par étape
  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};

    switch (activeStep) {
      case 0: // Informations de base
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
        break;

      case 1: // Statut & Dates
        if (travelConstraints) {
          const startDateValidation = validatePlaceDate(
            formData.startDate,
            formData.visited,
            travelConstraints
          );
          if (!startDateValidation.isValid) {
            newErrors.startDate =
              startDateValidation.errorMessage || 'Date invalide';
          }

          const endDateValidation = validatePlaceDate(
            formData.endDate,
            formData.visited,
            travelConstraints
          );
          if (!endDateValidation.isValid) {
            newErrors.endDate =
              endDateValidation.errorMessage || 'Date invalide';
          }

          if (formData.endDate < formData.startDate) {
            newErrors.endDate =
              'La date de fin doit être après ou égale à la date de début';
          }
        }
        break;

      case 2: // Photos & Médias
        // Pas de validation obligatoire pour cette étape
        break;

      case 3: // Expérience de visite
        // Pas de validation obligatoire pour cette étape
        break;

      case 4: // Journal & Sauvegarde
        if (
          formData.journalOption === 'existing' &&
          !formData.selectedJournalId
        ) {
          newErrors.selectedJournalId =
            'Veuillez sélectionner un journal existant';
        }
        if (
          formData.journalOption === 'new' &&
          !formData.newJournalTitle.trim()
        ) {
          newErrors.newJournalTitle =
            'Veuillez entrer un titre pour le nouveau journal';
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

    // 📅 Validation des dates selon l'état temporel du voyage
    if (travelConstraints) {
      // Valider la date de début
      const startDateValidation = validatePlaceDate(
        formData.startDate,
        formData.visited,
        travelConstraints
      );
      if (!startDateValidation.isValid) {
        newErrors.startDate =
          startDateValidation.errorMessage || 'Date invalide';
      }

      // Valider la date de fin
      const endDateValidation = validatePlaceDate(
        formData.endDate,
        formData.visited,
        travelConstraints
      );
      if (!endDateValidation.isValid) {
        newErrors.endDate = endDateValidation.errorMessage || 'Date invalide';
      }

      // Vérifier que la date de fin >= date de début
      if (formData.endDate < formData.startDate) {
        newErrors.endDate =
          'La date de fin doit être après ou égale à la date de début';
      }
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
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      photos: formData.photos,
      tags: formData.tags,
      visited: formData.visited,
      rating: formData.rating || undefined,
      weather: formData.weather.trim(),
      budget: formData.budget ? Number(formData.budget) : undefined,
      visitDuration: formData.visitDuration
        ? Number(formData.visitDuration)
        : undefined,
      notes: formData.notes.trim(),
      isFavorite: formData.isFavorite,
    };

    try {
      await addPlace(journalId, placeData);
      navigate('/journals'); // Rediriger vers la liste des journaux
    } catch (error) {
      console.error('Erreur lors de la création de la place:', error);
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
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
          rows={4}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          error={!!errors.description}
          helperText={errors.description}
          placeholder="Décrivez ce lieu..."
        />

        {/* Coordonnées GPS (optionnel) */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">
              Coordonnées GPS (optionnel)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
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
        {/* Upload de photos */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Photos ({formData.photos.length}/4)
          </Typography>

          {formData.photos.length < 4 && (
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ mb: 2 }}
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

          {/* Grille des photos */}
          {formData.photos.length > 0 && (
            <Grid container spacing={2}>
              {formData.photos.map((photo, index) => (
                <Grid size={{ xs: 6, sm: 3 }} key={index}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: 120,
                      border: '1px solid',
                      borderColor: 'grey.300',
                      borderRadius: 1,
                      overflow: 'hidden',
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
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Tags */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Tags et catégories
          </Typography>

          {/* Tags actuels */}
          {formData.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleTagRemove(tag)}
                  variant="filled"
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
            <Button onClick={handleCustomTagAdd} variant="outlined">
              Ajouter
            </Button>
          </Box>

          {/* Tags suggérés */}
          <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
            Tags suggérés :
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {SUGGESTED_TAGS.filter((tag) => !formData.tags.includes(tag))
              .slice(0, 14)
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
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Note de visite
            </Typography>
            <Rating
              value={formData.rating || 0}
              onChange={(_, value) => handleChange('rating', value || 0)}
              size="large"
            />
          </Box>
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
            <MenuItem value="🌫️ Brouillard">🌫️ Brouillard</MenuItem>
            <MenuItem value="🌬️ Venteux">🌬️ Venteux</MenuItem>
          </Select>
        </FormControl>

        {/* Budget */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Budget approximatif (€)
          </Typography>
          <ButtonGroup
            variant="outlined"
            sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}
          >
            {['0', '10', '25', '50', '100'].map((amount) => (
              <Button
                key={amount}
                size="small"
                variant={formData.budget === amount ? 'contained' : 'outlined'}
                onClick={() => handleChange('budget', amount)}
              >
                {amount === '0' ? 'Gratuit' : `~${amount}€`}
              </Button>
            ))}
          </ButtonGroup>
          <TextField
            fullWidth
            label="Montant personnalisé"
            type="number"
            size="small"
            value={formData.budget}
            onChange={(e) => handleChange('budget', e.target.value)}
            placeholder="Ou saisissez un montant précis..."
            InputProps={{
              endAdornment: <Typography variant="body2">€</Typography>,
            }}
          />
        </Box>

        {/* Durée de visite */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Durée de visite :{' '}
            {formData.visitDuration
              ? `${Math.floor(Number(formData.visitDuration) / 60)}h ${Number(formData.visitDuration) % 60}min`
              : 'Non spécifiée'}
          </Typography>
          <ButtonGroup
            variant="outlined"
            sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}
          >
            {[
              { value: '30', label: '30min' },
              { value: '60', label: '1h' },
              { value: '120', label: '2h' },
              { value: '240', label: '4h' },
              { value: '480', label: 'Journée' },
            ].map((duration) => (
              <Button
                key={duration.value}
                size="small"
                variant={
                  formData.visitDuration === duration.value
                    ? 'contained'
                    : 'outlined'
                }
                onClick={() => handleChange('visitDuration', duration.value)}
              >
                {duration.label}
              </Button>
            ))}
          </ButtonGroup>
          <Box sx={{ px: 2 }}>
            <Slider
              value={Number(formData.visitDuration) || 60}
              onChange={(_, value) =>
                handleChange('visitDuration', value.toString())
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
          label="Notes personnelles"
          multiline
          rows={4}
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Vos impressions, conseils, anecdotes..."
        />
      </Stack>
    </Box>
  );

  // Étape 5: Journal & Sauvegarde
  const renderJournalStep = () => (
    <Box sx={{ py: 2 }}>
      <Stack spacing={3}>
        <Typography variant="h6">Journal associé</Typography>

        <FormControl component="fieldset">
          <RadioGroup
            value={formData.journalOption}
            onChange={(e) => handleChange('journalOption', e.target.value)}
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
          <FormControl fullWidth error={!!errors.selectedJournalId}>
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
            {errors.selectedJournalId && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {errors.selectedJournalId}
              </Typography>
            )}
          </FormControl>
        )}

        {/* Résumé avant sauvegarde */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Résumé
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
            Ajouter un nouveau lieu
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Créez une nouvelle destination pour vos voyages -{' '}
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
                      display: 'flex',
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
                {step.label}
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
                        Sauvegarder
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

export default AddPlacePage;
