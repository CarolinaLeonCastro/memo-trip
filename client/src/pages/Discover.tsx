import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  useTheme,
  Button,
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  People as PeopleIcon,
  MenuBook as MenuBookIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';

// Import des nouveaux composants
import {
  DiscoverStatsCard,
  DiscoverSearchBar,
  DiscoverTrendingTags,
  DiscoverTabs,
  JournalCard,
} from '../components';

// Import des skeletons
import { JournalCardSkeleton } from '../components/skeleton';

// Import du service
import {
  publicService,
  type DiscoverStats,
  type DiscoverPost,
  type DiscoverJournal,
} from '../services/public.service';

// Types locaux pour les tags tendance
const TRENDING_TAGS = [
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

const Discover: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [posts, setPosts] = useState<DiscoverPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DiscoverStats>({
    shared_places: 0,
    public_journals: 0,
    active_travelers: 0,
  });
  const [trendingTags, setTrendingTags] = useState<string[]>(TRENDING_TAGS);

  // Debounce du terme de recherche pour éviter trop de requêtes
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Charger les données initiales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);

        // Charger les statistiques et les posts en parallèle
        console.log('🔄 Discover: Chargement des données initiales...');
        const [statsData, postsData, tagsData] = await Promise.all([
          publicService.getDiscoverStats(),
          publicService.getDiscoverPosts({
            type: 'journal', // Toujours charger les journaux
            limit: 12,
          }),
          publicService.getTrendingTags(),
        ]);

        console.log('📊 Discover: Stats reçues:', statsData);
        console.log('📚 Discover: Posts reçus:', postsData);
        console.log(
          '📚 Discover: Nombre de posts:',
          postsData?.posts?.length || 0
        );

        setStats(
          statsData || {
            shared_places: 0,
            public_journals: 0,
            active_travelers: 0,
          }
        );
        setPosts(postsData?.posts || []);

        // Utiliser les tags du serveur s'il y en a, sinon garder les tags par défaut
        if (tagsData && Array.isArray(tagsData) && tagsData.length > 0) {
          setTrendingTags(
            tagsData.map((tag) => tag?.tag || 'Tag').filter(Boolean)
          );
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données Discover:', error);
        // En cas d'erreur, garder les données par défaut
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []); // Plus de dépendance activeTab

  // Recharger les posts quand les filtres changent
  useEffect(() => {
    console.log('� useEffect filtrage déclenché:', {
      loading,
      debouncedSearchTerm,
      selectedTags,
    });

    if (!loading) {
      const loadFilteredPosts = async () => {
        try {
          console.log('🔄 Début du chargement des posts filtrés...');

          const filters = {
            type: 'journal' as const,
            search: debouncedSearchTerm || undefined,
            tags: selectedTags.length > 0 ? selectedTags : undefined,
            limit: 12,
          };

          console.log('🔄 Discover: Chargement des posts filtrés...', filters);
          console.log('🔍 Search term:', debouncedSearchTerm);
          console.log('🏷️ Selected tags:', selectedTags);

          const postsData = await publicService.getDiscoverPosts(filters);

          console.log('📚 Discover: Posts filtrés reçus:', postsData);
          console.log(
            '📚 Discover: Nombre de posts filtrés:',
            postsData?.posts?.length || 0
          );
          console.log('📚 Discover: Détail des posts:', postsData?.posts);

          setPosts(postsData?.posts || []);
        } catch (error) {
          console.error(
            '❌ Erreur lors du chargement des posts filtrés:',
            error
          );
        }
      };

      loadFilteredPosts();
    }
  }, [debouncedSearchTerm, selectedTags, loading]);

  // Gestionnaires d'événements
  const handleSearchChange = (term: string) => {
    console.log('🔍 Recherche changée:', term);
    setSearchTerm(term);
  };

  const handleTagClick = (tag: string) => {
    console.log('🏷️ Tag cliqué:', tag);
    setSelectedTags((prev) => {
      const newTags = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag];
      console.log('🏷️ Nouveaux tags sélectionnés:', newTags);
      return newTags;
    });
  };

  const handleLike = async (postId: string, postType: 'place' | 'journal') => {
    try {
      console.log('🔄 Tentative de like pour:', postId, 'type:', postType);

      // Appeler le service pour toggler le like
      const result = await publicService.toggleLike(postId, postType);
      console.log('✅ Résultat like:', result);

      // Mettre à jour l'état local des posts
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              is_liked: result.liked,
              likes: result.likesCount,
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error('❌ Erreur lors du like:', error);
      // Optionnel: Afficher une notification d'erreur à l'utilisateur
    }
  };

  const renderPost = (post: DiscoverPost) => {
    // Ne gérer que les journaux
    const journal = {
      ...(post.content as DiscoverJournal),
      cover_image: (post.content as DiscoverJournal).cover_image || '',
    };
    const user = {
      ...post.user,
      avatar: post.user.avatar?.url ? { url: post.user.avatar.url } : undefined,
    };
    return (
      <JournalCard
        journal={journal}
        user={user}
        likes={post.likes}
        views={post.views}
        isLiked={post.is_liked}
        onLike={() => handleLike(post._id, 'journal')}
        currentUserId={currentUser?.id}
      />
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor:
          theme.palette.mode === 'dark' ? 'background.default' : '#F8FAFC',
      }}
    >
      <Container maxWidth="xl" sx={{ py: 2 }}>
        {/* En-tête */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ mt: 0.5 }} // Ajustement vertical pour aligner avec le titre
            ></Button>
            <Box>
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{
                  color: 'primary.main',
                  mb: 0.5,
                  fontFamily: '"Chau Philomene One", cursive',
                }}
              >
                Découverte
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Explorez les voyages et lieux de la communauté MemoTrip
              </Typography>
            </Box>
          </Box>

          {/* Statistiques */}
          <Grid container spacing={3} sx={{ mb: 4, mt: 2 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <DiscoverStatsCard
                icon={
                  <LocationOnIcon sx={{ fontSize: 24, color: '#4F86F7' }} />
                }
                label="Lieux partagés"
                value={stats?.shared_places || 0}
                color="79, 134, 247"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <DiscoverStatsCard
                icon={<MenuBookIcon sx={{ fontSize: 24, color: '#4F86F7' }} />}
                label="Journaux publics"
                value={stats?.public_journals || 0}
                color="79, 134, 247"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <DiscoverStatsCard
                icon={<PeopleIcon sx={{ fontSize: 24, color: '#FF8A00' }} />}
                label="Voyageurs actifs"
                value={stats?.active_travelers || 0}
                color="255, 138, 0"
              />
            </Grid>
          </Grid>

          {/* Barre de recherche */}
          <DiscoverSearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />

          {/* Tags tendance */}
          <DiscoverTrendingTags
            tags={trendingTags}
            selectedTags={selectedTags}
            onTagClick={handleTagClick}
          />

          {/* Tabs Journaux seulement */}
          <DiscoverTabs />
        </Box>

        {/* Contenu principal */}
        {loading ? (
          <Grid container spacing={3}>
            {/* Skeletons pour les journaux */}
            <JournalCardSkeleton count={6} />
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {posts
              .filter((post) => post.type === 'journal') // Ne montrer que les journaux
              .map((post) => (
                <Grid
                  key={post._id}
                  size={{
                    xs: 12,
                    sm: post.type === 'journal' ? 12 : 6,
                    md: post.type === 'journal' ? 6 : 6,
                    lg: post.type === 'journal' ? 6 : 4,
                  }}
                >
                  {renderPost(post)}
                </Grid>
              ))}

            {/* Message si aucun résultat */}
            {posts.filter((post) => post.type === 'journal').length === 0 && (
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    px: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    border: '1px solid #f0f0f0',
                  }}
                >
                  <MenuBookIcon
                    sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ mb: 1, color: 'text.primary' }}
                  >
                    Aucun journal trouvé
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', mb: 2 }}
                  >
                    {debouncedSearchTerm || selectedTags.length > 0
                      ? 'Essayez de modifier vos critères de recherche'
                      : "Il n'y a pas encore de journaux publics à découvrir"}
                  </Typography>
                  {(debouncedSearchTerm || selectedTags.length > 0) && (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        console.log('🔄 Bouton reset cliqué');
                        setSearchTerm('');
                        setSelectedTags([]);
                        console.log('🔄 Filtres effacés');
                      }}
                      sx={{ mt: 1 }}
                    >
                      Effacer les filtres
                    </Button>
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Discover;
