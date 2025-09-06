import React, { useState, useEffect, useMemo } from 'react';
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
// import { useNavigate } from 'react-router-dom';

// Import des nouveaux composants
import {
  DiscoverStatsCard,
  DiscoverSearchBar,
  DiscoverTrendingTags,
  DiscoverTabs,
  PlaceCard,
  JournalCard,
} from '../components';

// Types
interface DiscoverStats {
  shared_places: number;
  public_journals: number;
  active_travelers: number;
}

interface DiscoverUser {
  _id: string;
  name: string;
  avatar?: { url: string };
}

interface DiscoverPlace {
  _id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  photos: Array<{ url: string }>;
  tags: string[];
  rating: number;
  date_visited: string;
}

interface DiscoverJournal {
  _id: string;
  title: string;
  description: string;
  cover_image: string;
  tags: string[];
  places_count: number;
  start_date: string;
  end_date: string;
}

interface DiscoverPost {
  _id: string;
  type: 'place' | 'journal';
  user: DiscoverUser;
  content: DiscoverPlace | DiscoverJournal;
  likes: number;
  comments: number;
  views: number;
  is_liked: boolean;
  created_at: string;
}

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
  // const navigate = useNavigate();
  const [posts, setPosts] = useState<DiscoverPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Données mockées pour les statistiques
  const stats: DiscoverStats = {
    shared_places: 2453,
    public_journals: 1087,
    active_travelers: 3241,
  };

  // Données mockées pour les posts
  const mockPosts: DiscoverPost[] = useMemo(
    () => [
      // Lieux variés
      {
        _id: '1',
        type: 'place',
        user: {
          _id: 'user1',
          name: 'Marco Rossi',
          avatar: { url: '/api/placeholder/40/40' },
        },
        content: {
          _id: 'place1',
          name: 'Coliseum',
          description:
            'Ancient amphitheatre in the centre of Rome, a must-see for history lovers!',
          city: 'Rome',
          country: 'Italy',
          photos: [
            {
              url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=400',
            },
          ],
          tags: ['Historic', 'Architecture', 'UNESCO'],
          rating: 5,
          date_visited: '2024-01-15',
        } as DiscoverPlace,
        likes: 124,
        comments: 18,
        views: 892,
        is_liked: false,
        created_at: '2024-01-15T10:30:00Z',
      },
      {
        _id: '2',
        type: 'place',
        user: {
          _id: 'user2',
          name: 'Sophie Laurent',
          avatar: { url: '/api/placeholder/40/40' },
        },
        content: {
          _id: 'place2',
          name: 'Eiffel Tower',
          description:
            "The perfect spot for sunset photos! Don't miss the light show at night ✨",
          city: 'Paris',
          country: 'France',
          photos: [
            {
              url: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?auto=format&fit=crop&q=80&w=400',
            },
          ],
          tags: ['Iconic', 'Photography', 'Romantic'],
          rating: 4,
          date_visited: '2024-01-10',
        } as DiscoverPlace,
        likes: 89,
        comments: 12,
        views: 456,
        is_liked: true,
        created_at: '2024-01-10T15:20:00Z',
      },
      {
        _id: '4',
        type: 'place',
        user: {
          _id: 'user4',
          name: 'Yuki Tanaka',
          avatar: { url: '/api/placeholder/40/40' },
        },
        content: {
          _id: 'place4',
          name: 'Rothenburg ob der Tauber',
          description:
            'Medieval town that looks like a fairytale! Perfect for history enthusiasts and photographers.',
          city: 'Rothenburg',
          country: 'Germany',
          photos: [
            {
              url: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=400',
            },
          ],
          tags: ['Medieval', 'Architecture', 'Photography'],
          rating: 5,
          date_visited: '2024-01-20',
        } as DiscoverPlace,
        likes: 67,
        comments: 8,
        views: 234,
        is_liked: false,
        created_at: '2024-01-20T14:15:00Z',
      },
      {
        _id: '5',
        type: 'place',
        user: {
          _id: 'user5',
          name: 'Anna Schmidt',
          avatar: { url: '/api/placeholder/40/40' },
        },
        content: {
          _id: 'place5',
          name: 'Santorini Sunset',
          description:
            'Most breathtaking sunset view in the world! The blue domes and white houses create pure magic.',
          city: 'Oia',
          country: 'Greece',
          photos: [
            {
              url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=400',
            },
          ],
          tags: ['Sunset', 'Romantic', 'Architecture'],
          rating: 5,
          date_visited: '2024-01-25',
        } as DiscoverPlace,
        likes: 198,
        comments: 32,
        views: 1456,
        is_liked: true,
        created_at: '2024-01-25T18:30:00Z',
      },
      {
        _id: '6',
        type: 'place',
        user: {
          _id: 'user6',
          name: 'James Wilson',
          avatar: { url: '/api/placeholder/40/40' },
        },
        content: {
          _id: 'place6',
          name: 'Machu Picchu',
          description:
            'Ancient Incan city in the clouds. The hike is challenging but absolutely worth every step!',
          city: 'Cusco',
          country: 'Peru',
          photos: [
            {
              url: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&q=80&w=400',
            },
          ],
          tags: ['Adventure', 'Historic', 'Hiking'],
          rating: 5,
          date_visited: '2024-02-01',
        } as DiscoverPlace,
        likes: 245,
        comments: 41,
        views: 2103,
        is_liked: false,
        created_at: '2024-02-01T08:45:00Z',
      },

      // Journaux variés
      {
        _id: '3',
        type: 'journal',
        user: {
          _id: 'user3',
          name: 'Carlos Mendez',
          avatar: { url: '/api/placeholder/40/40' },
        },
        content: {
          _id: 'journal1',
          title: 'European Adventure 2024',
          description:
            'Découverte de 5 pays européens en 3 semaines - un voyage inoubliable !',
          cover_image:
            'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=400',
          tags: ['Adventure', 'Cultural', 'Photography'],
          places_count: 15,
          start_date: '2024-01-01',
          end_date: '2024-01-21',
        } as DiscoverJournal,
        likes: 156,
        comments: 24,
        views: 1203,
        is_liked: false,
        created_at: '2024-01-05T09:15:00Z',
      },
      {
        _id: '7',
        type: 'journal',
        user: {
          _id: 'user7',
          name: 'Elena Rossi',
          avatar: { url: '/api/placeholder/40/40' },
        },
        content: {
          _id: 'journal2',
          title: 'Two Weeks in Mediterranean Paradise',
          description:
            'From the historic streets of Rome to the beautiful beaches of Santorini...',
          cover_image:
            'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=400',
          tags: ['Rome', 'Florence', 'Santorini'],
          places_count: 8,
          start_date: '2024-01-15',
          end_date: '2024-01-29',
        } as DiscoverJournal,
        likes: 234,
        comments: 45,
        views: 1876,
        is_liked: true,
        created_at: '2024-01-15T11:20:00Z',
      },
      {
        _id: '8',
        type: 'journal',
        user: {
          _id: 'user8',
          name: 'Alex Thompson',
          avatar: { url: '/api/placeholder/40/40' },
        },
        content: {
          _id: 'journal3',
          title: 'Solo Backpacking Through Southeast Asia',
          description:
            'An incredible journey of self-discovery through Thailand, Vietnam, and Cambodia.',
          cover_image:
            'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&q=80&w=400',
          tags: ['Bangkok', 'Ho Chi Minh', 'Siem Reap'],
          places_count: 12,
          start_date: '2024-02-01',
          end_date: '2024-02-30',
        } as DiscoverJournal,
        likes: 189,
        comments: 32,
        views: 1234,
        is_liked: false,
        created_at: '2024-02-01T16:30:00Z',
      },
    ],
    []
  );

  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, [mockPosts]);

  const handleLike = async (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              is_liked: !post.is_liked,
              likes: post.is_liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleTabChange = (tab: number) => {
    setActiveTab(tab);
  };

  const renderPost = (post: DiscoverPost) => {
    if (post.type === 'place') {
      return (
        <PlaceCard
          place={post.content as DiscoverPlace}
          user={post.user}
          likes={post.likes}
          comments={post.comments}
          views={post.views}
          isLiked={post.is_liked}
          onLike={() => handleLike(post._id)}
        />
      );
    } else {
      return (
        <JournalCard
          journal={post.content as DiscoverJournal}
          user={post.user}
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
            tags={TRENDING_TAGS}
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
