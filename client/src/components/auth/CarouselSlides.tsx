import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import {
  TravelExplore,
  PhotoLibrary,
  Map,
  Assistant,
} from '@mui/icons-material';

interface CarouselItem {
  id: number;
  title: string;
  image: string;
  description: string;
  icon: React.ElementType;
  gradient: string[];
}

const carouselItems: CarouselItem[] = [
  {
    id: 1,
    title: 'Cartes de voyage',
    image: 'dashboard-carousel.png',
    description:
      'Créez des cartes de voyage personnalisées pour chaque destination. Ajoutez des photos, des notes et des événements.',
    icon: TravelExplore,
    gradient: ['#2563EB', '#1D4ED8'], // Primary main vers dark
  },
  {
    id: 2,
    title: 'Itinéraire',
    image: 'dashboard-carousel.png',
    description:
      'Créez un itinéraire personnalisé à partir de vos préférences. Prêt à explorer le monde, sans perdre de temps.',
    icon: Map,
    gradient: ['#06B6D4', '#0891B2'], // Secondary main vers dark
  },
  {
    id: 3,
    title: 'Carnets de voyage',
    image: 'dashboard-carousel.png',
    description:
      'Documentez vos aventures avec photos, notes et souvenirs. Gardez une trace de tous vos moments précieux.',
    icon: PhotoLibrary,
    gradient: ['#10B981', '#059669'], // Success main vers dark
  },
  {
    id: 4,
    title: 'Creer un journal de voyage',
    image: 'dashboard-carousel.png',
    description:
      'Documentez vos aventures avec photos, notes et souvenirs. Gardez une trace de tous vos moments précieux.',
    icon: Assistant,
    gradient: ['#F59E0B', '#D97706'], // Accent main vers dark
  },
];

const CarouselSlides: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const currentItem = carouselItems[currentIndex];

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: { xs: 4, md: 6 },
        background: `linear-gradient(135deg, ${currentItem.gradient[0]}, ${currentItem.gradient[1]})`,
        overflow: 'hidden',
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
          backgroundSize: '60px 60px',
          backgroundPosition: '0 0, 30px 30px',
          zIndex: 1,
        }}
      />

      {/* Section texte à gauche */}
      <Box
        sx={{
          flex: 0.8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          maxWidth: '45%',
          paddingRight: 6,
          zIndex: 2,
          color: 'white',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            marginBottom: 3,
            fontSize: { xs: '2rem', md: '2.5rem' },
            lineHeight: 1.1,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          {currentItem.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            lineHeight: 1.6,
            fontSize: { xs: '1rem', md: '1.2rem' },
            fontWeight: 500,
            marginBottom: 4,
            opacity: 0.9,
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }}
        >
          {currentItem.description}
        </Typography>

        {/* Dots indicator sous le texte */}
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            alignItems: 'center',
          }}
        >
          {carouselItems.map((_, index) => (
            <Box
              key={index}
              onClick={() => handleDotClick(index)}
              sx={{
                width: index === currentIndex ? 32 : 16,
                height: 16,
                borderRadius: 8,
                backgroundColor:
                  index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  transform: 'scale(1.1)',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Section mockup à droite */}
      <Box
        sx={{
          flex: 1.2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: '500px',
          }}
        >
          {/* Dashboard Image */}
          <Box
            sx={{
              position: 'relative',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <Box
              sx={{
                width: '450px',
                height: '300px',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow:
                  '0 20px 40px rgba(0,0,0,0.2), 0 8px 16px rgba(0,0,0,0.1)',
                position: 'relative',
                backgroundColor: 'white',
              }}
            >
              <img
                src="/assets/dashboard-carroussel.png"
                alt="Dashboard MemoTrip"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  borderRadius: '16px',
                }}
              />

              {/* Subtle gradient overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
                  borderRadius: '16px',
                  pointerEvents: 'none',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default CarouselSlides;
