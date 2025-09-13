import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  Fade,
  Divider,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhotoIcon from '@mui/icons-material/Photo';

interface JournalStats {
  favorites: number;
  views: number;
  places: number;
  photos: number;
}

interface JournalStatsProps {
  stats: JournalStats;
}

// Composant pour chaque statistique minimaliste
const MinimalStat: React.FC<{
  icon: React.ReactElement;
  label: string;
  value: number;
  color: string;
  index: number;
}> = ({ icon, label, value, color, index }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Fade in timeout={500 + index * 100}>
      <Box
        sx={{
          textAlign: 'center',
          p: { xs: 2, sm: 3 },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: 2,
          '&:hover': {
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.02)'
                : 'rgba(0,0,0,0.01)',
            transform: 'translateY(-2px)',
            '& .stat-icon': {
              transform: 'scale(1.1)',
            },
          },
        }}
      >
        {/* Icône avec animation subtile */}
        <Box
          className="stat-icon"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
            borderRadius: '50%',
            bgcolor: `${color}08`,
            mb: { xs: 1, sm: 1.5 },
            transition: 'all 0.3s ease',
            color: color,
          }}
        >
          {React.cloneElement(icon, {
            sx: { fontSize: { xs: 20, sm: 24 } },
          })}
        </Box>

        {/* Valeur principale */}
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          fontWeight="700"
          sx={{
            color: theme.palette.text.primary,
            mb: 0.5,
            fontFamily: '"Inter", sans-serif',
            lineHeight: 1,
          }}
        >
          {value.toLocaleString()}
        </Typography>

        {/* Label */}
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
            fontWeight: 500,
            textTransform: 'capitalize',
          }}
        >
          {label}
        </Typography>
      </Box>
    </Fade>
  );
};

export const JournalStats: React.FC<JournalStatsProps> = ({ stats }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const statsData = [
    {
      icon: <FavoriteIcon />,
      label: "J'aime",
      value: stats.favorites,
      color: '#EF4444',
    },
    {
      icon: <VisibilityIcon />,
      label: 'Vues',
      value: stats.views,
      color: '#6366F1',
    },
    {
      icon: <LocationOnIcon />,
      label: 'Lieux',
      value: stats.places,
      color: '#10B981',
    },
    {
      icon: <PhotoIcon />,
      label: 'Photos',
      value: stats.photos,
      color: '#F59E0B',
    },
  ];

  // Calculer le total des interactions
  const totalInteractions = stats.favorites + stats.views;

  return (
    <Box
      sx={{
        py: { xs: 3, sm: 4, md: 1 },
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: { xs: 60, sm: 80 },
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${theme.palette.divider}, transparent)`,
        },
      }}
    >
      <Container maxWidth="lg">
        {/* En-tête minimaliste */}
        <Fade in timeout={300}>
          <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4, md: 5 } }}>
            {totalInteractions > 0 && (
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: { xs: '0.875rem', sm: '0.9rem' },
                  fontWeight: 400,
                }}
              >
                {totalInteractions.toLocaleString()} interactions au total
              </Typography>
            )}
          </Box>
        </Fade>

        {/* Grid des statistiques avec design épuré */}
        <Box
          sx={{
            maxWidth: { xs: '100%', sm: 600, md: 700 },
            mx: 'auto',
          }}
        >
          <Grid
            container
            spacing={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: theme.palette.background.paper,
              boxShadow:
                theme.palette.mode === 'dark'
                  ? '0 4px 20px rgba(0,0,0,0.1)'
                  : '0 4px 20px rgba(0,0,0,0.02)',
            }}
          >
            {statsData.map((item, index) => (
              <React.Fragment key={index}>
                <Grid
                  size={{ xs: 6, sm: 3 }}
                  sx={{
                    position: 'relative',
                    '&:not(:last-child)': {
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        right: 0,
                        top: '20%',
                        bottom: '20%',
                        width: '1px',
                        bgcolor: theme.palette.divider,
                        display: {
                          xs: index % 2 === 0 ? 'block' : 'none',
                          sm: 'block',
                        },
                      },
                    },
                  }}
                >
                  <MinimalStat {...item} index={index} />
                </Grid>

                {/* Divider horizontal pour mobile après chaque paire */}
                {isMobile && index === 1 && (
                  <Grid size={12}>
                    <Divider sx={{ my: 0 }} />
                  </Grid>
                )}
              </React.Fragment>
            ))}
          </Grid>
        </Box>

        {/* Note de bas de page subtile */}
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mt: { xs: 3, sm: 4 } }}>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.75rem',
                fontStyle: 'italic',
                opacity: 0.7,
              }}
            >
              Données mises à jour en temps réel
            </Typography>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};
