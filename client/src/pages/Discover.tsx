import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  People as PeopleIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';

// Import des nouveaux composants
import {
  DiscoverStatsCard,
  DiscoverSearchBar,
  DiscoverTrendingTags,
  DiscoverTabs,
  PlaceCard,
  JournalCard,
} from '../components';

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
        const [statsData, postsData, tagsData] = await Promise.all([
          publicService.getDiscoverStats(),
          publicService.getDiscoverPosts({
            type:
              activeTab === 0 ? 'place' : activeTab === 1 ? 'journal' : 'all',
            limit: 12,
          }),
          publicService.getTrendingTags(),
        ]);

        setStats(statsData);
        setPosts(postsData.posts);

        // Utiliser les tags du serveur s'il y en a, sinon garder les tags par défaut
        if (tagsData && tagsData.length > 0) {
          setTrendingTags(tagsData.map((tag) => tag.tag));
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
          const postsData = await publicService.getDiscoverPosts({
            type:
              activeTab === 0 ? 'place' : activeTab === 1 ? 'journal' : 'all',
            search: searchTerm || undefined,
            tags: selectedTags.length > 0 ? selectedTags : undefined,
            limit: 12,
          });
          setPosts(postsData.posts);
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
        />
      );
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* En-tête */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ color: '#1976d2', mb: 0.5 }}
          >
            Découverte
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Explorez les voyages et lieux de la communauté MemoTrip
          </Typography>

          {/* Statistiques */}
          <Grid container spacing={3} sx={{ mb: 4, mt: 2 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <DiscoverStatsCard
                icon={
                  <LocationOnIcon sx={{ fontSize: 24, color: '#4F86F7' }} />
                }
                label="Lieux partagés"
                value={stats.shared_places}
                color="79, 134, 247"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <DiscoverStatsCard
                icon={<MenuBookIcon sx={{ fontSize: 24, color: '#4F86F7' }} />}
                label="Journaux publics"
                value={stats.public_journals}
                color="79, 134, 247"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <DiscoverStatsCard
                icon={<PeopleIcon sx={{ fontSize: 24, color: '#FF8A00' }} />}
                label="Voyageurs actifs"
                value={stats.active_travelers}
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
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={50} sx={{ color: '#4F86F7' }} />
          </Box>
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
