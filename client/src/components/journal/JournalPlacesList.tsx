import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import type { Place as ApiPlace } from '../../services/place-api';

// Fonction utilitaire pour calculer les jours
const calculateDays = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

// Fonction pour déterminer le statut de visite avec le nouveau système
const getVisitStatus = (placeDetails: ApiPlace | undefined) => {
  if (!placeDetails) return null;

  // 🚀 NOUVEAU : Utiliser le champ status s'il existe
  if (placeDetails.status) {
    return placeDetails.status === 'visited' ? 'visited' : 'to_visit';
  }

  // 🔄 FALLBACK : Logique de compatibilité avec l'ancien système
  // Pour les lieux planifiés (avec plannedStart)
  if (placeDetails.plannedStart && !placeDetails.date_visited) {
    return 'to_visit';
  }

  // Pour les lieux avec date_visited (ancien système ou lieux visités)
  if (placeDetails.date_visited) {
    const visitDate = new Date(placeDetails.date_visited);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    visitDate.setHours(0, 0, 0, 0);

    if (visitDate <= today) {
      return 'visited';
    } else {
      return 'to_visit';
    }
  }

  return null;
};

interface JournalPlacesListProps {
  journal: {
    id: string;
    places: Array<{
      id: string;
      name: string;
      description?: string;
      photos: string[];
      country?: string;
    }>;
  };
  placesDetails: Map<string, ApiPlace>;
}

export const JournalPlacesList: React.FC<JournalPlacesListProps> = ({
  journal,
  placesDetails,
}) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <LocationOnIcon sx={{ color: 'error.main' }} />
        <Typography
          variant="h6"
          sx={{ fontFamily: '"Chau Philomene One", cursive' }}
        >
          Lieux du voyage ({journal.places.length})
        </Typography>
        {journal.places.length > 0 && (
          <Button
            component={Link}
            to={`/place/new?journalId=${journal.id}`}
            variant="outlined"
            startIcon={<AddIcon />}
            size="small"
            sx={{ ml: 'auto' }}
          >
            Ajouter un lieu
          </Button>
        )}
      </Box>

      {journal.places.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            border: '2px dashed',
            borderColor: 'grey.300',
            borderRadius: 2,
            bgcolor: 'grey.50',
          }}
        >
          <LocationOnIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucun lieu visité
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Commencez à planifier votre voyage en ajoutant des lieux à visiter
          </Typography>
          <Button
            component={Link}
            to={`/place/new?journalId=${journal.id}`}
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mr: 2 }}
          >
            Ajouter un lieu
          </Button>
          <Button
            onClick={() => navigate(`/journals/${journal.id}/edit`)}
            variant="outlined"
            startIcon={<EditIcon />}
          >
            Modifier le journal
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {journal.places.map((place) => {
            const placeDetails = placesDetails.get(place.id);
            const mainPhoto =
              placeDetails?.photos?.[0]?.url ||
              place.photos[0] ||
              'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&q=80&w=400';

            const days = placeDetails
              ? calculateDays(placeDetails.start_date, placeDetails.end_date)
              : 1;

            const visited = getVisitStatus(placeDetails);

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={place.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 2,
                    },
                  }}
                  onClick={() => navigate(`/place/${place.id}`)}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="150"
                      image={mainPhoto}
                      alt={placeDetails?.name || place.name}
                    />
                    {/* Badge de statut de visite */}
                    {(() => {
                      const visitStatus = getVisitStatus(placeDetails);
                      if (!visitStatus) return null;

                      const isVisited = visitStatus === 'visited';
                      return (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: isVisited ? '#E8F5E8' : '#FFF3E0',
                            color: isVisited ? '#2E7D32' : '#F57C00',
                            borderRadius: 1,
                            px: 1.5,
                            py: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.5,
                            boxShadow: 2,
                          }}
                        >
                          {isVisited ? (
                            <CheckCircleIcon sx={{ fontSize: '0.9rem' }} />
                          ) : (
                            <ScheduleIcon sx={{ fontSize: '0.9rem' }} />
                          )}
                          <Typography
                            variant="caption"
                            color={isVisited ? '#2E7D32' : '#F57C00'}
                            sx={{ fontWeight: 600 }}
                          >
                            {isVisited ? 'Visité' : 'À visiter'}
                          </Typography>
                        </Box>
                      );
                    })()}
                  </Box>

                  <CardContent sx={{ p: 2 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ mb: 0.5 }}
                    >
                      {(placeDetails?.name || place.name).split(',')[0]}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        mb: 1,
                      }}
                    >
                      <LocationOnIcon
                        sx={{ fontSize: '0.875rem', color: 'error.main' }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {placeDetails?.location?.country ||
                          place.country ||
                          'Lieu non spécifié'}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        fontStyle: 'italic',
                        color: 'text.secondary',
                        fontSize: '0.8rem',
                        lineHeight: 1.3,
                        mb: 1,
                      }}
                    >
                      {placeDetails?.description?.substring(0, 100) + '...' ||
                        place.description?.substring(0, 100) + '...' ||
                        'Une expérience inoubliable dans ce lieu magnifique...'}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        color: visited === 'visited' ? '#2E7D32' : '#F57C00',
                      }}
                    >
                      {days} jour{days > 1 ? 's' : ''}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};
