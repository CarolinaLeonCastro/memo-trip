import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJournals } from '../context/JournalContext';
import { placeApi } from '../services/place-api';
import type { Place as ApiPlace } from '../services/place-api';
import LoadingSpinner from '../components/skeleton/LoadingSpinner';

import { Box, Container, Typography, Button, CardMedia } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import PhotoGallery from '../components/PhotoGallery';
import {
  JournalHeader,
  JournalPlacesList,
  JournalContent,
  JournalTags,
  JournalTravelInfo,
} from '../components/journal';

// Fonctions utilitaires pour les calculs de voyage
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getSeason = (date: Date): string => {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5) return 'Printemps';
  if (month >= 6 && month <= 8) return 'Été';
  if (month >= 9 && month <= 11) return 'Automne';
  return 'Hiver';
};

const JournalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getJournal } = useJournals();
  const [selectedPhotos] = useState<string[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [placesDetails, setPlacesDetails] = useState<Map<string, ApiPlace>>(
    new Map()
  );
  const [isLoading, setIsLoading] = useState(true);
  const journal = id ? getJournal(id) : undefined;

  // Calculs des statistiques de voyage
  const travelStats = React.useMemo(() => {
    if (!journal) return { duration: 0, distance: 0, season: '', budget: 0 };

    // 1. Durée en jours
    const startDate = new Date(journal.startDate);
    const endDate = new Date(journal.endDate);
    const duration =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

    // 2. Saison basée sur la date de début
    const season = getSeason(startDate) + ' ' + startDate.getFullYear();

    // 3. Distance totale entre les lieux (basée sur l'ordre des lieux dans le journal)
    let distance = 0;
    const placesWithCoords = Array.from(placesDetails.values()).filter(
      (place) =>
        place.location?.coordinates && place.location.coordinates.length === 2
    );

    for (let i = 0; i < placesWithCoords.length - 1; i++) {
      const place1 = placesWithCoords[i];
      const place2 = placesWithCoords[i + 1];
      if (place1.location?.coordinates && place2.location?.coordinates) {
        distance += calculateDistance(
          place1.location.coordinates[1], // latitude
          place1.location.coordinates[0], // longitude
          place2.location.coordinates[1],
          place2.location.coordinates[0]
        );
      }
    }

    // 4. Budget total de tous les lieux
    const budget = Array.from(placesDetails.values()).reduce((total, place) => {
      return total + (place.budget || 0);
    }, 0);

    return {
      duration,
      distance: Math.round(distance),
      season,
      budget,
    };
  }, [journal, placesDetails]);

  // Charger les données complètes des lieux depuis l'API
  useEffect(() => {
    const loadPlacesDetails = async () => {
      if (!journal || journal.places.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const newPlacesDetails = new Map<string, ApiPlace>();

      for (const place of journal.places) {
        try {
          const apiPlace = await placeApi.getPlaceById(place.id);
          newPlacesDetails.set(place.id, apiPlace);
        } catch (error) {
          console.error(
            `Erreur lors du chargement du lieu ${place.name}:`,
            error
          );
        }
      }

      setPlacesDetails(newPlacesDetails);
      setIsLoading(false);
    };

    loadPlacesDetails();
  }, [journal]);

  // Calculer le nombre de jours pour un lieu

  if (!journal) {
    return (
      <Container maxWidth="lg" sx={{ py: 2 }}>
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

  if (isLoading) {
    return (
      <LoadingSpinner
        message="Chargement des détails du journal..."
        size="large"
      />
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <JournalHeader journal={journal} />

      <JournalTravelInfo travelStats={travelStats} />

      {/* Image principale */}
      <Box sx={{ mb: 4 }}>
        <CardMedia
          component="img"
          sx={{
            width: '100%',
            height: 400,
            borderRadius: 2,
            objectFit: 'cover',
          }}
          image={
            journal.mainPhoto ||
            'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1200'
          }
          alt={journal.title}
        />
      </Box>

      <JournalPlacesList journal={journal} placesDetails={placesDetails} />

      <JournalContent journal={journal} />
      <JournalTags tags={journal.tags} />

      {/* Modal galerie photos */}
      {showGallery && (
        <PhotoGallery
          photos={selectedPhotos}
          onClose={() => setShowGallery(false)}
        />
      )}
    </Container>
  );
};

export default JournalDetail;
