import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

// Import des nouveaux composants
import {
  PlaceHeader,
  PlaceAuthorStats,
  PlaceImageGallery,
  PlaceInfoCard,
} from '../components';

// Import du service public
import { publicService } from '../services/public.service';

// Types
interface User {
  _id: string;
  name: string;
  avatar?: { url: string };
}

interface PracticalInfo {
  best_time_to_visit: string;
  average_cost: string;
  opening_hours: string;
  website?: string;
  recommendations: string;
}

interface PublicPlace {
  _id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  address: string;
  coordinates: string;
  photos: Array<{ url: string; caption?: string }>;
  tags: string[];
  user: User;
  likes: number;
  views: number;
  is_liked: boolean;
  practical_info?: PracticalInfo;
  date_visited: string;
}

const PublicPlaceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showError, showSuccess } = useToast();
  const [place, setPlace] = useState<PublicPlace | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlaceDetails = async () => {
      try {
        if (!id) return;

        setLoading(true);
        console.log('🔄 PublicPlaceDetail: Chargement du lieu:', id);

        const placeData = await publicService.getPublicPlaceById(id);
        console.log('✅ PublicPlaceDetail: Données reçues:', placeData);

        // Vérifier que les données existent
        if (!placeData) {
          console.error('❌ PublicPlaceDetail: Aucune donnée reçue');
          setError('Lieu non trouvé');
          showError('Lieu non trouvé');
          setLoading(false);
          return;
        }

        // Adapter les données de l'API au format attendu par les composants
        const adaptedPlace: PublicPlace = {
          _id: placeData._id,
          name: placeData.name,
          description: placeData.description || '',
          city: placeData.location?.city || '',
          country: placeData.location?.country || '',
          address: placeData.location?.address || '',
          coordinates: placeData.location?.coordinates
            ? `${placeData.location.coordinates[1]}° N, ${placeData.location.coordinates[0]}° E`
            : '',
          photos: placeData.photos || [],
          tags: placeData.tags || [],
          user: {
            _id: placeData.user_id?._id || '',
            name: placeData.user_id?.name || 'Utilisateur inconnu',
            avatar: placeData.user_id?.avatar,
          },
          likes: 0, // À implémenter avec le système de likes
          views: 0, // À implémenter avec le système de vues
          is_liked: false, // À implémenter avec le système de likes
          practical_info: {
            best_time_to_visit: '',
            average_cost: placeData.budget ? `${placeData.budget}€` : '',
            opening_hours: '',
            recommendations: placeData.notes || '',
          },
          date_visited:
            placeData.date_visited ||
            placeData.visitedAt ||
            placeData.createdAt,
        };

        console.log('✅ PublicPlaceDetail: Lieu adapté:', adaptedPlace);
        setPlace(adaptedPlace);
        setIsLiked(adaptedPlace.is_liked);
        showSuccess(`Lieu "${adaptedPlace.name}" chargé avec succès`);
      } catch (error) {
        console.error(
          '❌ PublicPlaceDetail: Erreur lors du chargement:',
          error
        );
        setError('Erreur lors du chargement du lieu');
        showError('Erreur lors du chargement du lieu');
      } finally {
        setLoading(false);
      }
    };

    loadPlaceDetails();
  }, [id, showError, showSuccess]);

  const handleLike = () => {
    if (place) {
      const newIsLiked = !isLiked;
      setPlace({
        ...place,
        likes: isLiked ? place.likes - 1 : place.likes + 1,
        is_liked: newIsLiked,
      });
      setIsLiked(newIsLiked);
      
      // Afficher un toast pour le like/unlike
      if (newIsLiked) {
        showSuccess(`Vous aimez maintenant "${place.name}"`);
      } else {
        showSuccess(`Vous n'aimez plus "${place.name}"`);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={50} sx={{ color: '#4F86F7' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!place) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Lieu non trouvé
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      {/* Header */}
      <PlaceHeader
        name={place.name}
        city={place.city}
        country={place.country}
        description={place.description}
      />

      {/* Auteur et statistiques */}
      <PlaceAuthorStats
        user={place.user}
        dateVisited={place.date_visited}
        likes={place.likes}
        views={place.views}
        isLiked={isLiked}
        onLike={handleLike}
      />

      {/* Contenu principal */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Images */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <PlaceImageGallery photos={place.photos} height={500} />
          </Grid>

          {/* Informations */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <PlaceInfoCard
              practicalInfo={place.practical_info}
              address={place.address}
              coordinates={place.coordinates}
              tags={place.tags}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PublicPlaceDetail;
