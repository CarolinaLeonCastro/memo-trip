import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Grid,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';

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
  comments: number;
  is_liked: boolean;
  practical_info?: PracticalInfo;
  date_visited: string;
}

const PublicPlaceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [place, setPlace] = useState<PublicPlace | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Données mockées pour le développement
  const mockPlace: PublicPlace = useMemo(
    () => ({
      _id: '1',
      name: 'Coliseum',
      description:
        'The Colosseum is an ancient amphitheatre in the centre of Rome, built of travertine limestone, tuff, and brick-faced concrete. It is the largest amphitheatre ever built and could hold 50,000 to 80,000 spectators.',
      city: 'Rome',
      country: 'Italy',
      address: 'Piazza del Colosseo, 1, 00184 Roma RM, Italy',
      coordinates: '41.8902° N, 12.4922° E',
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800',
          caption: 'Vue extérieure du Colisée',
        },
        {
          url: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&q=80&w=800',
          caption: "Intérieur de l'amphithéâtre",
        },
        {
          url: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&q=80&w=800',
          caption: 'Vue nocturne',
        },
      ],
      tags: ['Historic', 'Architecture', 'UNESCO', 'Ancient Rome', 'Monument'],
      user: {
        _id: 'user1',
        name: 'Marco Rossi',
        avatar: { url: '/api/placeholder/40/40' },
      },
      likes: 124,
      views: 892,
      comments: 18,
      is_liked: false,
      practical_info: {
        best_time_to_visit:
          "Tôt le matin ou en fin d'après-midi pour éviter les foules",
        average_cost:
          "16€ pour l'entrée standard, 22€ avec accès aux étages supérieurs",
        opening_hours: '8h30 - 19h00 (varie selon la saison)',
        website: 'https://www.coopculture.it',
        recommendations:
          "Réservez à l'avance en ligne. Portez des chaussures confortables. Prenez de l'eau.",
      },
      date_visited: '2024-01-15',
    }),
    []
  );

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
          console.error(
            '❌ PublicPlaceDetail: Aucune donnée reçue, utilisation des données mockées'
          );
          // Utiliser les données mockées en fallback
          setPlace(mockPlace);
          setIsLiked(mockPlace.is_liked);
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
          comments: 0, // À implémenter avec le système de commentaires
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
      } catch (error) {
        console.error(
          '❌ PublicPlaceDetail: Erreur lors du chargement:',
          error
        );
        // En cas d'erreur, utiliser les données mockées
        setPlace(mockPlace);
        setIsLiked(mockPlace.is_liked);
      } finally {
        setLoading(false);
      }
    };

    loadPlaceDetails();
  }, [id]);

  const handleLike = () => {
    if (place) {
      setPlace({
        ...place,
        likes: isLiked ? place.likes - 1 : place.likes + 1,
        is_liked: !isLiked,
      });
      setIsLiked(!isLiked);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={50} sx={{ color: '#4F86F7' }} />
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
        comments={place.comments}
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
