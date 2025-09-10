import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  PhotoCamera as PhotoIcon,
  LocationOn as LocationIcon,
  Map as MapIcon,
  AdminPanelSettings as AdminIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import theme from '../../theme';

interface PlaceWithJournal {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  dateVisited: string;
  photos: string[];
  category?: string;
  isVisited: boolean;
  journalTitle: string;
  journalId: string;
}

interface MapSidebarProps {
  places: PlaceWithJournal[];
  onPlaceClick: (place: PlaceWithJournal) => void;
}

const MapSidebar: React.FC<MapSidebarProps> = ({ places, onPlaceClick }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  // Actions rapides avec conditions d'affichage
  const quickActions = [
    {
      icon: <MapIcon />,
      text: 'Mes voyages',
      onClick: () => navigate('/journals'),
      show: true,
    },
    {
      icon: <FavoriteIcon />,
      text: 'Mes favoris',
      onClick: () => navigate('/places?filter=favorites'),
      show: true,
    },
    {
      icon: <AdminIcon />,
      text: 'Administration',
      onClick: () => navigate('/admin'),
      show: user?.role === 'admin',
    },
  ].filter((action) => action.show);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Liste des lieux */}
      <Box sx={{ flex: 1, overflow: 'auto', px: isMobile ? 0 : 1 }}>
        {places.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              p: 2,
              textAlign: 'center',
            }}
          >
            <LocationIcon
              sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              Aucun lieu trouvé
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Modifiez vos filtres ou ajoutez de nouveaux lieux
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {places.slice(0, 3).map((place, index) => (
              <ListItem
                key={place.id}
                sx={{
                  cursor: 'pointer',
                  py: isMobile ? 1 : 0.4,
                  px: isMobile ? 1 : 2,
                  borderBottom:
                    index < places.length - 1
                      ? '1px solid rgba(0,0,0,0.08)'
                      : 'none',
                  '&:hover': {
                    bgcolor: 'rgba(91, 155, 213, 0.08)',
                    borderRadius: 1,
                  },
                }}
                onClick={() => onPlaceClick(place)}
              >
                <ListItemAvatar>
                  <Avatar
                    src={place.photos[0]}
                    sx={{
                      width: isMobile ? 50 : 60,
                      height: isMobile ? 50 : 60,
                      borderRadius: '8px',
                    }}
                  >
                    <PhotoIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ ml: 1.5 }}
                  primary={
                    <Box>
                      <Typography
                        variant={isMobile ? 'body1' : 'subtitle1'}
                        fontWeight={600}
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '180px',
                        }}
                      >
                        {place.name.split(',')[0]}
                      </Typography>
                      <Chip
                        label={place.isVisited ? 'Visité' : 'À visiter'}
                        size="small"
                        sx={{
                          bgcolor: place.isVisited ? '#E8F5E8' : '#FFF3E0',
                          color: place.isVisited ? '#2E7D32' : '#F57C00',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          mt: 0.5,
                          height: 20,
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '180px',
                      }}
                    >
                      {place.journalTitle}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Actions rapides optimisées pour mobile */}
      <Box
        sx={{
          p: isMobile ? 1 : 2,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            mb: 1.5,
            fontFamily: '"Chau Philomene One", cursive',
            color: 'primary.main',
            fontSize: isMobile ? '1rem' : '1.1rem',
          }}
        >
          Actions rapides
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outlined"
              startIcon={action.icon}
              onClick={action.onClick}
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                py: 1,
                fontSize: isMobile ? '0.85rem' : '0.9rem',
                borderColor: 'rgba(91, 155, 213, 0.3)',
                '&:hover': {
                  bgcolor: 'rgba(91, 155, 213, 0.08)',
                  borderColor: 'primary.main',
                },
              }}
            >
              {action.text}
            </Button>
          ))}
        </Box>

        {/* Bouton ajouter un journal en bas */}
        <Button
          variant="contained"
          startIcon={<LocationIcon />}
          onClick={() => navigate('/journals/new')}
          fullWidth
          sx={{
            mt: 1.5,
            background: `linear-gradient(45deg, ${theme.palette.error.main} 30%, ${theme.palette.error.light} 90%)`,
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.error.dark} 30%, ${theme.palette.error.main} 90%)`,
            },
            py: 1.2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Ajouter un journal
        </Button>
      </Box>
    </Box>
  );
};

export default MapSidebar;
