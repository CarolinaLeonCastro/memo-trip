import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Grid,
  CircularProgress,
  Typography,
  Pagination,
  Alert,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Import des composants publics
import {
  JournalAuthorInfo,
  JournalStats,
  PhotoGalleryGrid,
} from '../components/journalPublic';

// Import du composant content (partagé)
import { JournalContent } from '../components/journal';

// Import des nouveaux composants
import {
  PlaceFilterToolbar,
  PublicPlaceDetailCard,
  PublicPlaceModal,
} from '../components/journalPublic';
import type { PlaceFilters } from '../components/journalPublic';
import type { PublicPlace } from '../components/public';

// Import des skeletons
import { PlaceCardSkeleton } from '../components/skeleton';

// Import du service public
import { publicService } from '../services/public.service';

// Types
interface User {
  _id: string;
  name: string;
  location: string;
  bio: string;
  avatar?: { url: string };
}

interface TravelInfo {
  duration?: number;
  distance?: number;
  season?: string;
  budget?: number;
}

interface VisitedPlaceLocal {
  _id: string;
  name: string;
  location?: {
    city?: string;
    country?: string;
  };
  description?: string;
  photos?: Array<{ url: string }>;
  rating?: number;
  budget?: number;
  start_date?: string;
  end_date?: string;
  date_visited?: string;
  country: string;
  days: number;
}

interface Photo {
  url: string;
  caption?: string;
}

interface PublicJournal {
  _id: string;
  title: string;
  subtitle?: string;
  description: string;
  cover_image?: { url: string };
  tags?: string[];
  user_id: User;
  stats?: {
    likes: number;
    views: number;
    photos: number;
  };
  travel_info?: TravelInfo;
  places?: VisitedPlaceLocal[];
  gallery?: Photo[];
  journal_content?: string;
  createdAt: string;
}

const PublicJournalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [journal, setJournal] = useState<PublicJournal | null>(null);
  const [loading, setLoading] = useState(true);

  // Nouveaux états pour les filtres de lieux
  const [places, setPlaces] = useState<PublicPlace[]>([]);
  const [placesMetadata, setPlacesMetadata] = useState({
    total: 0,
    page: 1,
    totalPages: 0,
    hasMore: false,
  });
  const [placesLoading, setPlacesLoading] = useState(false);
  const [filters, setFilters] = useState<PlaceFilters>({
    sort: 'recent',
  });
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [placesLoaded, setPlacesLoaded] = useState(false);

  // États pour le modal de détail du lieu
  const [selectedPlace, setSelectedPlace] = useState<PublicPlace | null>(null);
  const [placeModalOpen, setPlaceModalOpen] = useState(false);

  // Calcul des statistiques de voyage côté client
  const travelStats = React.useMemo(() => {
    if (!journal) return { duration: 0, distance: 0, season: 'N/A', budget: 0 };

    // Utiliser d'abord les données travel_info si elles existent
    if (journal.travel_info) {
      return {
        duration: journal.travel_info.duration || 0,
        distance: journal.travel_info.distance || 0,
        season: journal.travel_info.season || 'N/A',
        budget: journal.travel_info.budget || 0,
      };
    }

    // Sinon, calculer à partir des données des lieux
    let duration = 0;
    let distance = 0;
    const budget = 0;
    let season = 'N/A';

    // Calculer la durée à partir des dates des lieux
    if (places.length > 0) {
      const dates = places
        .filter((place) => place.dateVisited || place.visitPeriod)
        .map((place) => {
          if (place.visitPeriod) {
            return {
              start: new Date(place.visitPeriod.start),
              end: new Date(place.visitPeriod.end),
            };
          }
          if (place.dateVisited) {
            const date = new Date(place.dateVisited);
            return { start: date, end: date };
          }
          return null;
        })
        .filter(Boolean);

      if (dates.length > 0) {
        const startDate = new Date(
          Math.min(...dates.map((d) => d!.start.getTime()))
        );
        const endDate = new Date(
          Math.max(...dates.map((d) => d!.end.getTime()))
        );
        duration =
          Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1;

        // Calculer la saison à partir de la première date
        const month = startDate.getMonth() + 1;
        if (month >= 3 && month <= 5) season = 'Printemps';
        else if (month >= 6 && month <= 8) season = 'Été';
        else if (month >= 9 && month <= 11) season = 'Automne';
        else season = 'Hiver';
        season += ' ' + startDate.getFullYear();
      }
    }

    // Calculer la distance entre les lieux (si nous avons les coordonnées)
    if (places.length > 1) {
      for (let i = 0; i < places.length - 1; i++) {
        const place1 = places[i];
        const place2 = places[i + 1];
        if (
          place1.coordinates &&
          place2.coordinates &&
          place1.coordinates.length === 2 &&
          place2.coordinates.length === 2
        ) {
          // Formule haversine pour calculer la distance
          const R = 6371; // Rayon de la Terre en km
          const dLat =
            ((place2.coordinates[1] - place1.coordinates[1]) * Math.PI) / 180;
          const dLng =
            ((place2.coordinates[0] - place1.coordinates[0]) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((place1.coordinates[1] * Math.PI) / 180) *
              Math.cos((place2.coordinates[1] * Math.PI) / 180) *
              Math.sin(dLng / 2) *
              Math.sin(dLng / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          distance += R * c;
        }
      }
    }

    return {
      duration,
      distance: Math.round(distance),
      season,
      budget,
    };
  }, [journal, places]);

  // Fonction pour charger les lieux avec filtres
  const loadPlaces = useCallback(
    async (filtersToUse: PlaceFilters, page: number = 1) => {
      if (!id) return;

      setPlacesLoading(true);

      try {
        console.log(
          '🔄 Chargement des lieux pour journal:',
          id,
          'avec filtres:',
          filtersToUse
        );
        const response = await publicService.getPublicJournalById(
          id,
          filtersToUse
        );

        if (response) {
          // Réinitialiser ou ajouter les lieux selon la page
          if (page === 1) {
            setPlaces(response.places || []);
          } else {
            setPlaces((prev) => [...prev, ...response.places]);
          }
          setPlacesMetadata(response.placesMetadata);

          // Extraire les tags disponibles
          const allTags = response.places.flatMap(
            (place: PublicPlace) => place.tags || []
          );
          const uniqueTags = Array.from(new Set(allTags)).sort();
          setAvailableTags(uniqueTags as string[]);
        }
      } catch (error) {
        console.error('❌ Erreur chargement lieux:', error);
      } finally {
        setPlacesLoading(false);
      }
    },
    [id]
  );

  // Fonction pour gérer les changements de filtres avec debounce
  const handleFiltersChange = useCallback(
    (newFilters: PlaceFilters) => {
      // Vérifier si les filtres ont vraiment changé
      if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
        console.log('🔄 Changement de filtres:', newFilters);
        setFilters(newFilters);
      }
    },
    [filters]
  );

  // Fonction pour gérer les changements de page
  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    loadPlaces(filters, value);
  };

  const handlePlaceClick = async (place: PublicPlace) => {
    console.log('🔍 Place clicked - structure du lieu depuis la liste:', place);
    console.log('🔍 Photos disponibles dans la liste:', place.photos);
    console.log('🔍 Nombre de photos selon la liste:', place.photosCount);
    console.log('🔍 Modal state before click:', {
      placeModalOpen,
      selectedPlace,
    });

    try {
      // Récupérer les détails complets du lieu avec toutes ses photos
      console.log('📡 Récupération des détails complets du lieu:', place._id);
      const fullPlaceDetails = await publicService.getPublicPlaceById(
        place._id
      );

      if (fullPlaceDetails) {
        console.log('✅ Détails complets du lieu récupérés:', fullPlaceDetails);
        console.log('🔍 Structure complète du lieu:', {
          id: fullPlaceDetails._id,
          name: fullPlaceDetails.name,
          photos: fullPlaceDetails.photos,
          photosLength: fullPlaceDetails.photos?.length,
          coverImage: fullPlaceDetails.coverImage,
          allKeys: Object.keys(fullPlaceDetails),
        });
        console.log('🔍 Photos complètes:', fullPlaceDetails.photos);
        console.log(
          '🔍 Nombre total de photos:',
          fullPlaceDetails.photos?.length || 0
        );

        // Convertir les données du serveur au format attendu par le modal
        const placeForModal: PublicPlace = {
          ...place,
          photos: fullPlaceDetails.photos || [],
          coverImage: fullPlaceDetails.coverImage || place.coverImage,
          description: fullPlaceDetails.description || place.description,
        };

        setSelectedPlace(placeForModal);
      } else {
        console.warn(
          '⚠️ Impossible de récupérer les détails complets, utilisation des données de base'
        );
        setSelectedPlace(place);
      }
    } catch (error) {
      console.error(
        '❌ Erreur lors de la récupération des détails du lieu:',
        error
      );
      setSelectedPlace(place);
    }

    setPlaceModalOpen(true);
    console.log('🔍 Modal should now be open. Check modal state.');
  };

  const handleCloseModal = () => {
    setPlaceModalOpen(false);
    setSelectedPlace(null);
  };

  useEffect(() => {
    const loadJournalDetails = async () => {
      try {
        if (!id) return;

        setLoading(true);
        setPlacesLoaded(false); // Reset du flag pour le nouveau journal
        console.log('🔄 PublicJournalDetail: Chargement du journal:', id);

        const journalData = await publicService.getPublicJournalById(id);
        console.log('✅ PublicJournalDetail: Journal reçu:', journalData);

        // Vérifier que les données existent
        if (!journalData) {
          console.error('❌ PublicJournalDetail: Aucune donnée reçue');
          setLoading(false);
          return;
        }

        // Utiliser directement les données de l'API
        setJournal(journalData);
      } catch (error) {
        console.error(
          '❌ PublicJournalDetail: Erreur lors du chargement:',
          error
        );
        // En cas d'erreur, ne pas charger de données
      } finally {
        setLoading(false);
      }
    };

    loadJournalDetails();
  }, [id]);

  useEffect(() => {
    if (journal && !loading && !placesLoaded) {
      console.log('🔄 Chargement initial des lieux');
      loadPlaces(filters, 1);
      setPlacesLoaded(true);
    }
  }, [journal, loading, placesLoaded, loadPlaces, filters]);

  useEffect(() => {
    if (journal && !loading && placesLoaded) {
      console.log('🔄 Rechargement des lieux avec nouveaux filtres');
      loadPlaces(filters, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={50} sx={{ color: '#4F86F7' }} />
      </Box>
    );
  }

  if (!journal) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Journal non trouvé
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      {/* Header avec image de couverture */}
      <Box
        sx={{
          position: 'relative',
          height: 400,
          backgroundImage: `url(${journal.cover_image?.url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1200'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          color: 'white',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
          }}
        />
        <Container maxWidth="xl" sx={{ position: 'relative', pb: 4 }}>
          <Typography variant="h2" fontWeight={700} sx={{ mb: 2 }}>
            {journal.title}
          </Typography>
          {journal.subtitle && (
            <Typography variant="h5" sx={{ mb: 2, opacity: 0.9 }}>
              {journal.subtitle}
            </Typography>
          )}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {journal.tags?.map((tag, index) => (
              <Box
                key={index}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(4px)',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                {tag}
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Informations de l'auteur */}
      <JournalAuthorInfo
        user={journal.user_id}
        publishedDate={journal.createdAt}
      />

      {/* Informations de voyage */}
      <Box sx={{ bgcolor: 'white', px: 3, py: 4 }}>
        <Container maxWidth="xl">
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{
              color: 'primary.main',
              mb: 3,
              fontFamily: '"Chau Philomene One", cursive',
            }}
          >
            Informations de voyage
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 1,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  bgcolor: 'background.paper',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)',
                  },
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: 'rgba(79, 134, 247, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 24,
                        color: '#4F86F7',
                        fontWeight: 'bold',
                      }}
                    >
                      📅
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                    Jours
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {travelStats.duration}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 1,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  bgcolor: 'background.paper',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)',
                  },
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255, 138, 0, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 24,
                        color: '#FF8A00',
                        fontWeight: 'bold',
                      }}
                    >
                      🛣️
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                    km
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {travelStats.distance}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 1,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  bgcolor: 'background.paper',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)',
                  },
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: 'rgba(76, 175, 80, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 24,
                        color: '#4CAF50',
                        fontWeight: 'bold',
                      }}
                    >
                      🌞
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                    Saison
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  {travelStats.season}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 1,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  bgcolor: 'background.paper',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)',
                  },
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: 'rgba(244, 67, 54, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 24,
                        color: '#F44336',
                        fontWeight: 'bold',
                      }}
                    >
                      💰
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                    Budget
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="error.main">
                  {travelStats.budget}€
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <JournalStats
        stats={{
          favorites: journal.stats?.likes || 0,
          views: journal.stats?.views || 0,
          places: placesMetadata.total || 0,
          photos: journal.stats?.photos || 0,
        }}
      />

      {/* Contenu principal */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Lieux visités avec filtres */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <LocationOnIcon sx={{ fontSize: 24, color: '#FF6B35', mr: 1 }} />
            <Typography
              variant="h6"
              fontWeight="700"
              sx={{
                color: '#1F2937',
                fontFamily: '"Chau Philomene One", cursive',
              }}
            >
              Lieux du voyage ({placesMetadata.total || 0})
            </Typography>
          </Box>

          {/* Toolbar de filtres */}
          <PlaceFilterToolbar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            availableTags={availableTags}
            totalResults={placesMetadata.total}
            loading={placesLoading}
          />

          {/* Liste des lieux */}
          {placesLoading && places.length === 0 ? (
            <Grid container spacing={3}>
              <PlaceCardSkeleton count={8} compact={false} />
            </Grid>
          ) : places.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              Aucun lieu trouvé avec ces critères.
            </Alert>
          ) : (
            <>
              <Grid container spacing={3}>
                {places.map((place) => (
                  <Grid key={place._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <PublicPlaceDetailCard
                      place={place}
                      onClick={handlePlaceClick}
                      showViewButton={true}
                    />
                  </Grid>
                ))}

                {/* Afficher des skeletons pour les lieux en cours de chargement */}
                {placesLoading && (
                  <PlaceCardSkeleton count={4} compact={false} />
                )}
              </Grid>

              {/* Pagination */}
              {placesMetadata.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={placesMetadata.totalPages}
                    page={placesMetadata.page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </Box>

        {/* Galerie photo */}
        {(() => {
          console.log('🔍 Journal gallery data:', journal.gallery);
          console.log('🔍 Gallery length:', journal.gallery?.length || 0);
          return null;
        })()}
        <PhotoGalleryGrid
          photos={(journal.gallery || []).map((photo) => ({
            url: photo.url,
            alt: photo.caption || `Photo du voyage`,
          }))}
        />

        {/* Journal de voyage */}
        <JournalContent journal={{ description: journal.journal_content }} />
      </Container>

      {/* Modal de détail du lieu */}
      <PublicPlaceModal
        open={placeModalOpen}
        onClose={handleCloseModal}
        place={selectedPlace}
      />
    </Box>
  );
};

export default PublicJournalDetail;
