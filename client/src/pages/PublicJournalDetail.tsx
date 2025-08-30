import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Grid,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Import des nouveaux composants
import {
  JournalHeader,
  JournalAuthorInfo,
  JournalTravelInfo,
  JournalStats,
  VisitedPlaceCard,
  PhotoGalleryGrid,
  JournalContent,
} from '../components';

// Types
interface User {
  _id: string;
  name: string;
  location: string;
  bio: string;
  avatar?: { url: string };
}

interface TravelInfo {
  duration: string;
  distance: string;
  season: string;
  budget: string;
}

interface VisitedPlace {
  _id: string;
  name: string;
  country: string;
  days: number;
  photos: Array<{ url: string }>;
}

interface Photo {
  url: string;
  caption: string;
}

interface PublicJournal {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  cover_image: string;
  tags: string[];
  user: User;
  likes: number;
  views: number;
  comments: number;
  shares: number;
  is_liked: boolean;
  travel_info: TravelInfo;
  places: VisitedPlace[];
  gallery: Photo[];
  journal_content: string;
  created_at: string;
}

const PublicJournalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [journal, setJournal] = useState<PublicJournal | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Données mockées pour le développement
  const mockJournals: { [key: string]: PublicJournal } = useMemo(
    () => ({
      '1': {
        _id: '1',
        title: 'Two Weeks in Mediterranean Paradise',
        subtitle: 'A Journey Through Ancient History and Modern Beauty',
        description:
          'An unforgettable Mediterranean adventure exploring ancient civilizations, stunning architecture, and breathtaking landscapes across Italy and Greece.',
        cover_image:
          'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=1200',
        tags: [
          'Méditerranée',
          'Histoire',
          'Photographie',
          'Culture',
          'Gastronomie',
        ],
        user: {
          _id: 'user1',
          name: 'Elena Rossi',
          location: 'Milan, Italy',
          bio: 'Travel blogger and photographer exploring the world one destination at a time.',
          avatar: { url: '/api/placeholder/60/60' },
        },
        likes: 234,
        views: 1876,
        comments: 45,
        shares: 12,
        is_liked: false,
        travel_info: {
          duration: '14 jours',
          distance: '2,450 km',
          season: 'Été 2024',
          budget: '€2,800',
        },
        places: [
          {
            _id: 'place1',
            name: 'Rome',
            country: 'Italy',
            days: 3,
            photos: [
              {
                url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=400',
              },
            ],
          },
          {
            _id: 'place2',
            name: 'Florence',
            country: 'Italy',
            days: 4,
            photos: [
              {
                url: 'https://images.unsplash.com/photo-1543949806-2c9935e6aa78?auto=format&fit=crop&q=80&w=400',
              },
            ],
          },
          {
            _id: 'place3',
            name: 'Santorini',
            country: 'Greece',
            days: 7,
            photos: [
              {
                url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=400',
              },
            ],
          },
        ],
        gallery: [
          {
            url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=400',
            caption: 'Colosseum at sunset',
          },
          {
            url: 'https://images.unsplash.com/photo-1543949806-2c9935e6aa78?auto=format&fit=crop&q=80&w=400',
            caption: 'Florence architecture',
          },
          {
            url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=400',
            caption: 'Santorini sunset',
          },
          {
            url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=400',
            caption: 'Mediterranean views',
          },
        ],
        journal_content: `Day 1-3: Rome - The Eternal City

Starting our Mediterranean adventure in Rome was the perfect choice. The first morning, we walked through the ancient streets as the city woke up. The Colosseum at sunrise was absolutely breathtaking - there's something magical about having this wonder almost to yourself.

We spent our days exploring the Roman Forum, getting lost in the narrow streets of Trastevere, and discovering hidden gems like the Orange Garden with its incredible view over the city. The food was incredible - from simple but perfect pasta dishes to the best gelato I've ever tasted.

Day 4-7: Florence - Renaissance Splendor

The train journey from Rome to Florence gave us beautiful views of the Tuscan countryside. Florence felt like an open-air museum with every corner revealing another masterpiece. The Uffizi was overwhelming in the best possible way, and climbing to the top of the Duomo was worth every step.

We took a day trip to the Chianti region for wine tasting. The rolling hills dotted with cypress trees looked exactly like the postcards, and the wine... well, let's just say we bought several bottles to take home!

Day 8-14: Santorini - Island Paradise

The ferry to Santorini was an adventure in itself. Watching the island appear on the horizon with its distinctive white buildings perched on the clifftops was magical. The sunsets here are legendary, and now I understand why.

We spent our days exploring the different villages, swimming in the unique black sand beaches, and taking countless photos of the iconic blue-domed churches. The local cuisine was a perfect blend of Greek and Mediterranean flavors - the fresh seafood and local wines were exceptional.

This journey through the Mediterranean has been everything I dreamed of and more. Each destination offered something unique, from ancient history in Rome to Renaissance art in Florence and natural beauty in Santorini. It's a trip I'll treasure forever.`,
        created_at: '2024-01-15',
      },
      journal1: {
        _id: 'journal1',
        title: 'European Adventure 2024',
        subtitle: 'Découverte de 5 pays européens en 3 semaines',
        description:
          "Un voyage inoubliable à travers l'Europe, découvrant 5 pays différents avec leur culture, architecture et gastronomie uniques.",
        cover_image:
          'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=1200',
        tags: [
          'Adventure',
          'Cultural',
          'Photography',
          'Architecture',
          'Gastronomie',
        ],
        user: {
          _id: 'user2',
          name: 'Carlos Mendez',
          location: 'Barcelona, Spain',
          bio: 'Passionate traveler exploring European culture and architecture one city at a time.',
          avatar: { url: '/api/placeholder/60/60' },
        },
        likes: 156,
        views: 1203,
        comments: 24,
        shares: 8,
        is_liked: false,
        travel_info: {
          duration: '21 jours',
          distance: '3,200 km',
          season: 'Printemps 2024',
          budget: '€3,500',
        },
        places: [
          {
            _id: 'place4',
            name: 'Paris',
            country: 'France',
            days: 4,
            photos: [
              {
                url: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?auto=format&fit=crop&q=80&w=400',
              },
            ],
          },
          {
            _id: 'place5',
            name: 'Amsterdam',
            country: 'Netherlands',
            days: 3,
            photos: [
              {
                url: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&q=80&w=400',
              },
            ],
          },
          {
            _id: 'place6',
            name: 'Prague',
            country: 'Czech Republic',
            days: 5,
            photos: [
              {
                url: 'https://images.unsplash.com/photo-1541849546-216549ae216f?auto=format&fit=crop&q=80&w=400',
              },
            ],
          },
          {
            _id: 'place7',
            name: 'Vienna',
            country: 'Austria',
            days: 4,
            photos: [
              {
                url: 'https://images.unsplash.com/photo-1516550135131-fe3dcb0beef1?auto=format&fit=crop&q=80&w=400',
              },
            ],
          },
          {
            _id: 'place8',
            name: 'Budapest',
            country: 'Hungary',
            days: 5,
            photos: [
              {
                url: 'https://images.unsplash.com/photo-1541965331-9646e0528b27?auto=format&fit=crop&q=80&w=400',
              },
            ],
          },
        ],
        gallery: [
          {
            url: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?auto=format&fit=crop&q=80&w=400',
            caption: 'Eiffel Tower at sunset',
          },
          {
            url: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&q=80&w=400',
            caption: 'Amsterdam canals',
          },
          {
            url: 'https://images.unsplash.com/photo-1541849546-216549ae216f?auto=format&fit=crop&q=80&w=400',
            caption: 'Prague old town',
          },
          {
            url: 'https://images.unsplash.com/photo-1516550135131-fe3dcb0beef1?auto=format&fit=crop&q=80&w=400',
            caption: 'Vienna architecture',
          },
        ],
        journal_content: `Day 1-4: Paris - The City of Light

Our European adventure began in the magical city of Paris. We spent our first morning wandering through Montmartre, watching the city wake up from the steps of the Sacré-Cœur. The view over Paris at sunrise was absolutely breathtaking.

We dedicated a full day to the Louvre - an overwhelming experience in the best possible way. Standing in front of the Mona Lisa was surreal, but discovering lesser-known masterpieces throughout the museum was equally rewarding. The evening walks along the Seine, especially at sunset, became our daily ritual.

Day 5-7: Amsterdam - Canals and Culture

The train journey from Paris to Amsterdam gave us beautiful views of the French and Dutch countryside. Amsterdam welcomed us with its unique charm - the canals, the historic buildings, and the incredibly friendly locals.

We rented bikes (when in Amsterdam!) and spent our days cycling through the city, discovering hidden courtyards and cozy cafés. The Anne Frank House was a deeply moving experience that we'll never forget. The evenings were spent in the Jordaan district, sampling local cuisine and craft beers.

Day 8-12: Prague - A Fairytale City

Prague exceeded all our expectations. The city feels like a living fairytale, with its medieval architecture and cobblestone streets. The Charles Bridge at dawn, with the morning mist rising from the Vltava River, was pure magic.

We spent hours exploring Prague Castle and the Old Town Square. The astronomical clock never failed to amaze us, and we made sure to catch it chiming every hour. The local Czech beer was exceptional, and the hearty traditional food was perfect after long days of exploration.

Day 13-16: Vienna - Imperial Elegance

Vienna brought a different kind of grandeur to our journey. The imperial palaces, the elegant coffee houses, and the rich musical heritage created an atmosphere of sophisticated beauty.

Schönbrunn Palace was a highlight - the gardens were spectacular, and the palace rooms told stories of imperial Austria. We attended a classical concert in one of Vienna's historic venues, which was an unforgettable cultural experience.

Day 17-21: Budapest - Thermal Baths and History

Our final destination, Budapest, provided the perfect ending to our European adventure. The city's dramatic setting along the Danube, with Buda Castle rising above the river, was stunning.

The thermal baths were a unique experience - relaxing in the outdoor pools of Széchenyi Baths while snow was falling around us was surreal. The evening walks across the Chain Bridge, with the parliament building illuminated across the river, became our favorite Budapest memory.

This 21-day journey through Europe showed us the incredible diversity of cultures, architectures, and cuisines that exist within relatively short distances. Each city had its own personality and charm, and we left with a deep appreciation for European history and culture.`,
        created_at: '2024-01-05',
      },
    }),
    []
  );

  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      const journalData = id ? mockJournals[id] : null;
      if (journalData) {
        setJournal(journalData);
        setIsLiked(journalData.is_liked);
      }
      setLoading(false);
    }, 500);
  }, [id, mockJournals]);

  const handleLike = () => {
    if (journal) {
      setJournal({
        ...journal,
        likes: isLiked ? journal.likes - 1 : journal.likes + 1,
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
      <JournalHeader
        title={journal.title}
        subtitle={journal.subtitle}
        coverImage={journal.cover_image}
        tags={journal.tags}
        isLiked={isLiked}
        onLike={handleLike}
      />

      {/* Informations de l'auteur */}
      <JournalAuthorInfo
        user={journal.user}
        publishedDate={journal.created_at}
      />

      {/* Informations de voyage et statistiques */}
      <JournalTravelInfo travelInfo={journal.travel_info} />
      <JournalStats
        likes={journal.likes}
        comments={journal.comments}
        views={journal.views}
        shares={journal.shares}
      />

      {/* Contenu principal */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Lieux visités */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <LocationOnIcon sx={{ fontSize: 24, color: '#FF6B35', mr: 1 }} />
            <Typography variant="h5" fontWeight="700" sx={{ color: '#1F2937' }}>
              Lieux visités ({journal.places.length})
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {journal.places.map((place) => (
              <Grid key={place._id} size={{ xs: 12, md: 6, lg: 4 }}>
                <VisitedPlaceCard place={place} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Galerie photo */}
        <PhotoGalleryGrid photos={journal.gallery} />

        {/* Journal de voyage */}
        <JournalContent content={journal.journal_content} />
      </Container>
    </Box>
  );
};

export default PublicJournalDetail;
