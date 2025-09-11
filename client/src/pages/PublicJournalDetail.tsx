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
  PublicPlaceCard,
  PublicPlaceModal,
} from '../components/public';
import type { PlaceFilters, PublicPlace } from '../components/public';

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
  caption: string;
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

  const handlePlaceClick = (place: PublicPlace) => {
    console.log('Place clicked:', place);
    setSelectedPlace(place);
    setPlaceModalOpen(true);
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

      {/* Informations de voyage (simplifiées pour la version publique) */}
      <Box sx={{ bgcolor: 'white', px: 3, py: 4 }}>
        <Container maxWidth="xl">
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{ color: '#1F2937', mb: 3, textAlign: 'center' }}
          >
            Informations de voyage
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {journal.travel_info?.duration || '0'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Jours
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {journal.travel_info?.distance || '0'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  km
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {journal.travel_info?.season || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Saison
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="error.main">
                  {journal.travel_info?.budget || '0'}€
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Budget
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
            <Typography variant="h5" fontWeight="700" sx={{ color: '#1F2937' }}>
              Lieux du journal
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
                    <PublicPlaceCard
                      place={place}
                      onClick={handlePlaceClick}
                      showStatus={true}
                      compact={false}
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
        <PhotoGalleryGrid photos={journal.gallery || []} />

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
