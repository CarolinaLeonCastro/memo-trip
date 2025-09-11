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

// Import des nouveaux composants
import {
  DiscoverStatsCard,
  DiscoverSearchBar,
  DiscoverTrendingTags,
  DiscoverTabs,
  PlaceCard,
  JournalCard,
} from '../components';

// Import des skeletons
import { JournalCardSkeleton, PlaceCardSkeleton } from '../components/skeleton';

// Import du service
import {
  publicService,
  type DiscoverStats,
  type DiscoverPost,
  type DiscoverPlace,
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
  const [posts, setPosts] = useState<DiscoverPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState<DiscoverStats>({
    shared_places: 0,
    public_journals: 0,
    active_travelers: 0,
  });
  const [trendingTags, setTrendingTags] = useState<string[]>(TRENDING_TAGS);

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
            type:
              activeTab === 0 ? 'place' : activeTab === 1 ? 'journal' : 'all',
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
  }, [activeTab]);

  // Recharger les posts quand les filtres changent
  useEffect(() => {
    if (!loading) {
      const loadFilteredPosts = async () => {
        try {
          console.log('🔄 Discover: Chargement des posts filtrés...', {
            activeTab,
            searchTerm,
            selectedTags,
          });

          const postsData = await publicService.getDiscoverPosts({
            type:
              activeTab === 0 ? 'place' : activeTab === 1 ? 'journal' : 'all',
            search: searchTerm || undefined,
            tags: selectedTags.length > 0 ? selectedTags : undefined,
            limit: 12,
          });

          console.log('📚 Discover: Posts filtrés reçus:', postsData);
          console.log(
            '📚 Discover: Nombre de posts filtrés:',
            postsData?.posts?.length || 0
          );

          setPosts(postsData?.posts || []);
        } catch (error) {
          console.error('Erreur lors du chargement des posts filtrés:', error);
        }
      };

      loadFilteredPosts();
    }
  }, [searchTerm, selectedTags, activeTab, loading]);

  // Gestionnaires d'événements
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleTabChange = (newTab: number) => {
    setActiveTab(newTab);
  };

  const handleLike = async (postId: string) => {
    // TODO: Implémenter la fonctionnalité de like
    console.log('Like post:', postId);
  };

  const handlePlaceClick = (place: unknown) => {
    // Navigation vers la page publique du lieu si elle existe
    console.log('Place clicked:', place);
    // navigate(`/public/places/${place._id}`);
  };

  const handleViewAllPlaces = (journalId: string) => {
    // Navigation vers la page publique du journal
    navigate(`/public/journals/${journalId}`);
  };

  const renderPost = (post: DiscoverPost) => {
    if (post.type === 'place') {
      const place = post.content as DiscoverPlace;
      const user = {
        ...post.user,
        avatar: post.user.avatar?.url
          ? { url: post.user.avatar.url }
          : undefined,
      };
      return (
        <PlaceCard
          place={place}
          user={user}
          likes={post.likes}
          comments={post.comments}
          views={post.views}
          isLiked={post.is_liked}
          onLike={() => handleLike(post._id)}
        />
      );
    } else {
      const journal = {
        ...(post.content as DiscoverJournal),
        cover_image: (post.content as DiscoverJournal).cover_image || '',
      };
      const user = {
        ...post.user,
        avatar: post.user.avatar?.url
          ? { url: post.user.avatar.url }
          : undefined,
      };
      return (
        <JournalCard
          journal={journal}
          user={user}
          likes={post.likes}
          comments={post.comments}
          views={post.views}
          isLiked={post.is_liked}
          onLike={() => handleLike(post._id)}
          onPlaceClick={handlePlaceClick}
          onViewAllPlaces={() => handleViewAllPlaces(journal._id)}
        />
      );
    }
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

          {/* Tabs Lieux/Journaux */}
          <DiscoverTabs activeTab={activeTab} onTabChange={handleTabChange} />
        </Box>

        {/* Contenu principal */}
        {loading ? (
          <Grid container spacing={3}>
            {/* Afficher les skeletons selon l'onglet actif */}
            {activeTab === 0 ? (
              // Skeletons pour les lieux
              <PlaceCardSkeleton count={8} />
            ) : activeTab === 1 ? (
              // Skeletons pour les journaux
              <JournalCardSkeleton count={6} />
            ) : (
              // Skeletons mixtes pour tous
              <>
                <PlaceCardSkeleton count={4} />
                <JournalCardSkeleton count={3} />
              </>
            )}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {posts
              .filter((post) => {
                if (activeTab === 0) return post.type === 'place';
                if (activeTab === 1) return post.type === 'journal';
                return true;
              })
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
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Discover;
