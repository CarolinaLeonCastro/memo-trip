import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Button,
  CircularProgress,
  Stack,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon,
  Visibility as VisibilityIcon,
  LocationOn as LocationOnIcon,
  TrendingUp as TrendingUpIcon,
  ArrowBack as ArrowBackIcon,
  MenuBook as MenuBookIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';

// Types pour la page découverte
interface DiscoverUser {
  _id: string;
  name: string;
  avatar?: {
    url?: string;
  };
}

interface DiscoverPlace {
  _id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  photos: Array<{
    url: string;
    caption?: string;
  }>;
  tags: string[];
  rating?: number;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  date_visited: string;
}

interface DiscoverJournal {
  _id: string;
  title: string;
  description: string;
  cover_image?: string;
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

interface DiscoverStats {
  shared_places: number;
  public_journals: number;
  active_travelers: number;
}

const TRENDING_TAGS = [
  '#Historic',
  '#Architecture',
  '#Photography',
  '#Romantic',
  '#Beach',
  '#Nature',
  '#Food',
  '#Adventure',
  '#Cultural',
  '#UNESCO',
  '#Museum',
  '#Festival',
];

const Discover: React.FC = () => {
  const navigate = useNavigate();

  // États
  const [posts, setPosts] = useState<DiscoverPost[]>([]);
  const [stats] = useState<DiscoverStats>({
    shared_places: 1234,
    public_journals: 567,
    active_travelers: 2890,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>(
    'recent'
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Données mockées pour le développement
  const mockPosts: DiscoverPost[] = useMemo(
    () => [
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
          photos: [{ url: '/api/placeholder/400/250' }],
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
          photos: [{ url: '/api/placeholder/400/250' }],
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
          cover_image: '/api/placeholder/400/250',
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
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const getImageUrl = (
    photos: Array<{ url: string }> | string | undefined
  ): string => {
    if (Array.isArray(photos) && photos.length > 0) {
      return photos[0].url;
    }
    if (typeof photos === 'string') {
      return photos;
    }
    return '/api/placeholder/400/250';
  };

  const renderPost = (post: DiscoverPost) => (
    <Card
      key={post._id}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        backgroundColor: 'white',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* Image */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={getImageUrl(
            post.type === 'place'
              ? (post.content as DiscoverPlace).photos
              : (post.content as DiscoverJournal).cover_image
          )}
          alt={
            post.type === 'place'
              ? (post.content as DiscoverPlace).name
              : (post.content as DiscoverJournal).title
          }
          sx={{
            objectFit: 'cover',
            cursor: 'pointer',
          }}
          onClick={() => {
            if (post.type === 'place') {
              navigate(`/place/${post.content._id}`);
            } else {
              navigate(`/public/journals/${post.content._id}`);
            }
          }}
        />

        {/* Heart overlay sur l'image */}
        <IconButton
          onClick={() => handleLike(post._id)}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: 'rgba(255,255,255,0.9)',
            color: post.is_liked ? '#FF6B35' : '#666',
            '&:hover': {
              backgroundColor: 'white',
              color: '#FF6B35',
            },
            width: 40,
            height: 40,
          }}
        >
          {post.is_liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>

      {/* Contenu */}
      <CardContent sx={{ p: 2 }}>
        {post.type === 'place' ? (
          <>
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: '1.1rem' }}
            >
              {(post.content as DiscoverPlace).name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOnIcon sx={{ fontSize: 16, color: '#666', mr: 0.5 }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: '0.875rem' }}
              >
                {(post.content as DiscoverPlace).city},{' '}
                {(post.content as DiscoverPlace).country}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: '0.85rem',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mb: 1.5,
              }}
            >
              {(post.content as DiscoverPlace).description}
            </Typography>
          </>
        ) : (
          <>
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: '1.1rem' }}
            >
              {(post.content as DiscoverJournal).title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: '0.85rem',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mb: 1.5,
              }}
            >
              {(post.content as DiscoverJournal).description}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <MenuBookIcon sx={{ fontSize: 16, color: '#666', mr: 0.5 }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: '0.875rem' }}
              >
                {(post.content as DiscoverJournal).places_count} lieux
              </Typography>
            </Box>
          </>
        )}

        {/* Footer avec utilisateur et stats */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={post.user.avatar?.url}
              sx={{
                width: 28,
                height: 28,
                mr: 1,
                bgcolor: '#1976d2',
                fontSize: '0.75rem',
              }}
            >
              {post.user.name.charAt(0)}
            </Avatar>
            <Typography
              variant="caption"
              fontWeight="medium"
              sx={{ fontSize: '0.8rem' }}
            >
              {post.user.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: '0.75rem' }}
              >
                {post.likes}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CommentIcon sx={{ fontSize: 14, color: '#666' }} />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: '0.75rem' }}
              >
                {post.comments}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <VisibilityIcon sx={{ fontSize: 14, color: '#666' }} />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: '0.75rem' }}
              >
                {post.views}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#E3F2FD' }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* En-tête */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                mr: 2,
                bgcolor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': { bgcolor: 'white' },
              }}
            >
              <ArrowBackIcon sx={{ color: '#1976d2' }} />
            </IconButton>
            <Box>
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
            </Box>
          </Box>

          {/* Statistiques */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: '#1976d2',
                  color: 'white',
                  borderRadius: 1,
                  boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
                }}
              >
                <LocationOnIcon sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                  Lieux partagés
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  {stats.shared_places.toLocaleString()}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: '#1976d2',
                  color: 'white',
                  borderRadius: 1,
                  boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
                }}
              >
                <MenuBookIcon sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                  Journaux publics
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  {stats.public_journals.toLocaleString()}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: '#1976d2',
                  color: 'white',
                  borderRadius: 1,
                  boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
                }}
              >
                <PeopleIcon sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                  Voyageurs actifs
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  {stats.active_travelers.toLocaleString()}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Barre de recherche et filtres */}
          <Box
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 1,
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField
                  fullWidth
                  placeholder="Rechercher des lieux, journaux ou utilisateurs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#1976d2' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      bgcolor: '#F5F9FD',
                      border: 'none',
                      '&:hover': {
                        bgcolor: '#EBF4FE',
                      },
                      '&.Mui-focused': {
                        bgcolor: 'white',
                        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as 'recent' | 'popular' | 'trending'
                    )
                  }
                  displayEmpty
                  fullWidth
                  sx={{
                    borderRadius: 1,
                    bgcolor: '#F5F9FD',
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  }}
                >
                  <MenuItem value="recent">🕒 Plus récent</MenuItem>
                  <MenuItem value="popular">🔥 Plus populaire</MenuItem>
                  <MenuItem value="trending">📈 Tendance</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Box>

          {/* Tags tendance */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUpIcon sx={{ color: '#1976d2', mr: 1, fontSize: 28 }} />
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ color: '#1976d2' }}
              >
                Tags tendance
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {TRENDING_TAGS.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => handleTagClick(tag)}
                  sx={{
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 'medium',
                    bgcolor: selectedTags.includes(tag) ? '#1976d2' : 'white',
                    color: selectedTags.includes(tag) ? 'white' : '#1976d2',
                    border: `2px solid ${selectedTags.includes(tag) ? '#1976d2' : '#E3F2FD'}`,
                    '&:hover': {
                      bgcolor: selectedTags.includes(tag)
                        ? '#1565c0'
                        : '#1976d2',
                      color: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Tabs Lieux/Journaux */}
          <Box sx={{ mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={(_e, newValue) => setActiveTab(newValue)}
              sx={{
                '& .MuiTabs-indicator': {
                  bgcolor: '#1976d2',
                  height: 3,
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#666',
                  '&.Mui-selected': {
                    color: '#1976d2',
                  },
                },
              }}
            >
              <Tab
                icon={<LocationOnIcon />}
                iconPosition="start"
                label="Lieux"
                sx={{ mr: 2 }}
              />
              <Tab
                icon={<MenuBookIcon />}
                iconPosition="start"
                label="Journaux"
              />
            </Tabs>
          </Box>
        </Box>

        {/* Contenu principal */}
        <Grid container spacing={4}>
          {/* Feed des posts en grille masonry */}
          <Grid size={{ xs: 12, lg: 9 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={50} sx={{ color: '#1976d2' }} />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {posts.map((post) => (
                  <Grid key={post._id} size={{ xs: 12, sm: 6, md: 4 }}>
                    {renderPost(post)}
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, lg: 3 }}>
            <Stack spacing={3}>
              {/* Voyageurs actifs */}
              <Box
                sx={{
                  p: 3,
                  borderRadius: 1,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ color: '#1976d2', mb: 2 }}
                >
                  👤 Voyageurs actifs
                </Typography>
                <Stack spacing={2}>
                  {[
                    {
                      name: 'Emma Wilson',
                      places: 42,
                      avatar: '/api/placeholder/40/40',
                    },
                    {
                      name: 'Jean Dupont',
                      places: 38,
                      avatar: '/api/placeholder/40/40',
                    },
                    {
                      name: 'Maria Garcia',
                      places: 35,
                      avatar: '/api/placeholder/40/40',
                    },
                  ].map((traveler, index) => (
                    <Box
                      key={index}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Avatar
                        src={traveler.avatar}
                        sx={{
                          width: 40,
                          height: 40,
                          mr: 2,
                          bgcolor: '#1976d2',
                        }}
                      >
                        {traveler.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {traveler.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {traveler.places} lieux visités
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          borderColor: '#1976d2',
                          color: '#1976d2',
                          fontSize: '0.75rem',
                          '&:hover': {
                            bgcolor: '#1976d2',
                            color: 'white',
                          },
                        }}
                      >
                        Suivre
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Destinations populaires */}
              <Box
                sx={{
                  p: 3,
                  borderRadius: 1,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ color: '#1976d2', mb: 2 }}
                >
                  🌍 Destinations populaires
                </Typography>
                <Stack spacing={1.5}>
                  {[
                    { name: 'Paris, France', count: 234 },
                    { name: 'Tokyo, Japon', count: 189 },
                    { name: 'New York, USA', count: 167 },
                    { name: 'Barcelona, Espagne', count: 145 },
                    { name: 'Rome, Italie', count: 132 },
                  ].map((destination, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1,
                        px: 2,
                        bgcolor: '#F5F9FD',
                        borderRadius: 2,
                        '&:hover': {
                          bgcolor: '#EBF4FE',
                        },
                      }}
                    >
                      <Typography variant="body2" fontWeight="medium">
                        {destination.name}
                      </Typography>
                      <Chip
                        label={destination.count}
                        size="small"
                        sx={{
                          bgcolor: '#1976d2',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Discover;
