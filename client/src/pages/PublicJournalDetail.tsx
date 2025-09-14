import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Grid,
  CircularProgress,
  Typography,
  Pagination,
  Alert,
  Button,
  IconButton,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Fade,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RouteIcon from '@mui/icons-material/Route';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShareIcon from '@mui/icons-material/Share';

// Import du contexte d'authentification
import { useAuth } from '../context/AuthContext';

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
  PublicPlaceDetailCard,
  PublicPlaceModal,
} from '../components/journalPublic';
import type { PublicPlace } from '../components/public';

// Import des skeletons
import { PlaceCardSkeleton } from '../components/skeleton';

// Import du service public
import { publicService } from '../services/public.service';

// Types (conservés identiques)
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

// Composant pour les cartes de statistiques améliorées
const TravelStatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
  bgColor: string;
}> = ({ icon, title, value, color, bgColor }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${bgColor}15, ${bgColor}08)`,
        border: `1px solid ${bgColor}30`,
        borderRadius: 3,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 20px 40px ${bgColor}20`,
          borderColor: `${bgColor}60`,
        },
      }}
    >
      <CardContent sx={{ p: isMobile ? 2 : 3, height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              width: isMobile ? 40 : 48,
              height: isMobile ? 40 : 48,
              borderRadius: '50%',
              bgcolor: `${bgColor}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              color: color,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: isMobile ? '0.75rem' : '0.85rem',
                fontWeight: 600,
                color: theme.palette.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                mb: 0.5,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              fontWeight="700"
              sx={{
                color: color,
                lineHeight: 1.2,
                fontSize: isMobile ? '1.25rem' : '1.75rem',
              }}
            >
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const PublicJournalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // États existants conservés
  const [journal, setJournal] = useState<PublicJournal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likingInProgress, setLikingInProgress] = useState(false);
  const [places, setPlaces] = useState<PublicPlace[]>([]);
  const [placesMetadata, setPlacesMetadata] = useState({
    total: 0,
    page: 1,
    totalPages: 0,
    hasMore: false,
  });
  const [placesLoading, setPlacesLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PublicPlace | null>(null);
  const [placeModalOpen, setPlaceModalOpen] = useState(false);

  // Calcul des statistiques (conservé identique)
  const travelStats = React.useMemo(() => {
    if (!journal) return { duration: 0, distance: 0, season: 'N/A', budget: 0 };

    if (journal.travel_info) {
      return {
        duration: journal.travel_info.duration || 0,
        distance: journal.travel_info.distance || 0,
        season: journal.travel_info.season || 'N/A',
        budget: journal.travel_info.budget || 0,
      };
    }

    let duration = 0;
    let distance = 0;
    let budget = 0;
    let season = 'N/A';

    if (places.length > 0) {
      // Calculer le budget total à partir des lieux
      budget = places.reduce((total, place) => total + (place.budget || 0), 0);

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

        const month = startDate.getMonth() + 1;
        if (month >= 3 && month <= 5) season = 'Printemps';
        else if (month >= 6 && month <= 8) season = 'Été';
        else if (month >= 9 && month <= 11) season = 'Automne';
        else season = 'Hiver';
        season += ' ' + startDate.getFullYear();
      }
    }

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
          const R = 6371;
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

  // Fonction pour charger les lieux additionnels (pagination uniquement)
  const loadPlaces = useCallback(
    async (page: number = 1) => {
      if (!id || page === 1) return; // Ne pas recharger la page 1
      setPlacesLoading(true);
      try {
        // Passer incrementViews: false pour les chargements de pagination
        const response = await publicService.getPublicJournalById(
          id,
          { page, limit: 20 },
          false
        );
        if (response) {
          // Ajouter les nouveaux lieux aux existants
          setPlaces((prev) => [...prev, ...response.places]);
          setPlacesMetadata(response.placesMetadata);
        }
      } catch (error) {
        console.error('❌ Erreur chargement lieux:', error);
      } finally {
        setPlacesLoading(false);
      }
    },
    [id]
  );

  const handleLike = async () => {
    if (!journal?._id || likingInProgress) return;
    if (!isAuthenticated) return;

    try {
      setLikingInProgress(true);
      const result = await publicService.toggleLike(journal._id, 'journal');
      if (result && typeof result.liked === 'boolean') {
        setIsLiked(result.liked);
        setLikesCount(result.likesCount);
        if (journal.stats) {
          setJournal({
            ...journal,
            stats: {
              ...journal.stats,
              likes: result.likesCount,
            },
          });
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors du like:', error);
    } finally {
      setLikingInProgress(false);
    }
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    loadPlaces(value);
  };

  const handlePlaceClick = async (place: PublicPlace) => {
    try {
      const fullPlaceDetails = await publicService.getPublicPlaceById(
        place._id
      );
      if (fullPlaceDetails) {
        const placeForModal: PublicPlace = {
          ...place,
          photos: fullPlaceDetails.photos || [],
          coverImage: fullPlaceDetails.coverImage || place.coverImage,
          description: fullPlaceDetails.description || place.description,
        };
        setSelectedPlace(placeForModal);
      } else {
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
  };

  const handleCloseModal = () => {
    setPlaceModalOpen(false);
    setSelectedPlace(null);
  };

  // useEffects conservés identiques
  useEffect(() => {
    const loadJournalDetails = async () => {
      try {
        if (!id) return;
        setLoading(true);
        // Un seul appel avec incrementViews: true pour compter la vue
        const journalData = await publicService.getPublicJournalById(
          id,
          undefined,
          true
        );
        if (!journalData) {
          setLoading(false);
          return;
        }
        setJournal(journalData);
        setLikesCount(journalData.likes_count || 0);
        setIsLiked(journalData.is_liked || false);

        // Charger aussi les lieux directement ici pour éviter un deuxième appel
        setPlaces(journalData.places || []);
        setPlacesMetadata(journalData.placesMetadata);
      } catch (error) {
        console.error(
          '❌ PublicJournalDetail: Erreur lors du chargement:',
          error
        );
      } finally {
        setLoading(false);
      }
    };
    loadJournalDetails();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          bgcolor: theme.palette.background.default,
        }}
      >
        <CircularProgress
          size={60}
          sx={{ color: theme.palette.primary.main }}
        />
      </Box>
    );
  }

  if (!journal) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          bgcolor: theme.palette.background.default,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          <Typography variant="h6">Journal non trouvé</Typography>
          <Typography variant="body2">
            Le journal demandé n'existe pas ou n'est plus disponible.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Header avec image de couverture modernisé */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 300, sm: 400, md: 400 },
          backgroundImage: `url(${journal.cover_image?.url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1200'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          color: 'white',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))',
          },
        }}
      >
        <Container
          maxWidth="xl"
          sx={{ position: 'relative', pb: { xs: 3, md: 4 }, zIndex: 1 }}
        >
          <Fade in timeout={1000}>
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'flex-end' },
                  gap: { xs: 2, sm: 0 },
                  mb: 2,
                }}
              >
                <Typography
                  variant={isMobile ? 'h3' : 'h2'}
                  fontWeight={700}
                  sx={{
                    textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                    lineHeight: 1.2,
                    maxWidth: { xs: '100%', sm: '70%' },
                  }}
                >
                  {journal.title}
                </Typography>

                {/* Boutons d'action */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.15)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                    }}
                  >
                    <ShareIcon />
                  </IconButton>

                  <Button
                    variant="contained"
                    startIcon={
                      isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />
                    }
                    onClick={handleLike}
                    disabled={likingInProgress || !isAuthenticated}
                    sx={{
                      bgcolor: isLiked ? '#ef4444' : 'rgba(255,255,255,0.15)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      minWidth: { xs: 100, sm: 120 },
                      '&:hover': {
                        bgcolor: isLiked ? '#dc2626' : 'rgba(255,255,255,0.25)',
                      },
                      '&:disabled': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.5)',
                      },
                    }}
                  >
                    {likesCount} {!isAuthenticated && '🔒'}
                  </Button>
                </Box>
              </Box>

              {journal.subtitle && (
                <Typography
                  variant={isMobile ? 'h6' : 'h5'}
                  sx={{
                    mb: 2,
                    opacity: 0.9,
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  {journal.subtitle}
                </Typography>
              )}

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {journal.tags?.map((tag, index) => (
                  <Box
                    key={index}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(8px)',
                      px: { xs: 1.5, sm: 2 },
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      fontWeight: 500,
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {tag}
                  </Box>
                ))}
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Informations de l'auteur */}
      <JournalAuthorInfo
        user={journal.user_id}
        publishedDate={journal.createdAt}
      />

      {/* Informations de voyage avec design amélioré */}
      <Box sx={{ py: { xs: 3, md: 4 } }}>
        <Container maxWidth="xl">
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            fontWeight="700"
            sx={{
              fontFamily: '"Chau Philomene One", cursive',
              color: theme.palette.primary.main,
              mb: 3,
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            📊 Statistiques du voyage
          </Typography>

          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TravelStatCard
                icon={
                  <CalendarTodayIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                }
                title="Durée"
                value={travelStats.duration}
                color="#4F86F7"
                bgColor="#4F86F7"
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TravelStatCard
                icon={<RouteIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />}
                title="Distance"
                value={`${travelStats.distance} km`}
                color="#FF8A00"
                bgColor="#FF8A00"
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TravelStatCard
                icon={<WbSunnyIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />}
                title="Période"
                value={travelStats.season}
                color="#4CAF50"
                bgColor="#4CAF50"
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TravelStatCard
                icon={
                  <AccountBalanceWalletIcon
                    sx={{ fontSize: { xs: 20, sm: 24 } }}
                  />
                }
                title="Budget"
                value={`${travelStats.budget}€`}
                color="#F44336"
                bgColor="#F44336"
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Statistiques générales */}
      <JournalStats
        stats={{
          favorites: likesCount || 0,
          views: journal.stats?.views || 0,
          places: placesMetadata.total || 0,
          photos: places.reduce(
            (total, place) => total + (place.photosCount || 0),
            0
          ),
        }}
      />

      {/* Contenu principal avec espacement amélioré */}
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
        {/* Lieux visités avec design amélioré */}
        <Box sx={{ mb: { xs: 4, md: 8 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: { xs: 3, md: 4 },
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: { xs: 'center', sm: 'left' },
              gap: { xs: 1, sm: 2 },
            }}
          >
            <LocationOnIcon
              sx={{ fontSize: { xs: 28, sm: 32 }, color: '#FF6B35' }}
            />
            <Typography
              variant="h5"
              fontWeight="700"
              sx={{
                color: theme.palette.text.primary,
                fontFamily: '"Chau Philomene One", cursive',
              }}
            >
              Lieux du voyage ({placesMetadata.total || 0})
            </Typography>
          </Box>

          {/* Liste des lieux avec grid améliorée */}
          {placesLoading && places.length === 0 ? (
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <PlaceCardSkeleton count={isMobile ? 4 : 8} compact={false} />
            </Grid>
          ) : places.length === 0 ? (
            <Alert
              severity="info"
              sx={{
                mt: 3,
                borderRadius: 2,
                '& .MuiAlert-message': {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                },
              }}
            >
              Aucun lieu trouvé avec ces critères.
            </Alert>
          ) : (
            <Fade in timeout={800}>
              <Box>
                <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                  {places.map((place, index) => (
                    <Grid
                      key={place._id}
                      size={{
                        xs: 12,
                        sm: 6,
                        md: isTablet ? 6 : 4,
                        lg: 3,
                      }}
                    >
                      <Fade in timeout={600 + index * 100}>
                        <Box>
                          <PublicPlaceDetailCard
                            place={place}
                            onClick={handlePlaceClick}
                            showViewButton={true}
                          />
                        </Box>
                      </Fade>
                    </Grid>
                  ))}

                  {placesLoading && (
                    <PlaceCardSkeleton count={4} compact={false} />
                  )}
                </Grid>

                {/* Pagination améliorée */}
                {placesMetadata.totalPages > 1 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mt: { xs: 4, md: 6 },
                    }}
                  >
                    <Pagination
                      count={placesMetadata.totalPages}
                      page={placesMetadata.page}
                      onChange={handlePageChange}
                      color="primary"
                      size={isMobile ? 'medium' : 'large'}
                      sx={{
                        '& .MuiPaginationItem-root': {
                          borderRadius: 2,
                          fontWeight: 600,
                        },
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Fade>
          )}
        </Box>

        {/* Galerie photo */}
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
