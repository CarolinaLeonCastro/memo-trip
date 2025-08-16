import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
} from '@mui/material';
import {
  PhotoCamera as PhotoIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

interface PlaceWithJournal {
  id: string;
  name: string;
  description: string;
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
  return (
    <Box
      sx={{
        width: 350,
        bgcolor: 'background.paper',
        borderLeft: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Sidebar Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: '#f8f9fa',
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
          Lieux ({places.length})
        </Typography>
      </Box>

      {/* Places List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {places.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              p: 3,
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
            {places.map((place, index) => (
              <ListItem
                key={place.id}
                sx={{
                  borderBottom:
                    index < places.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
                onClick={() => onPlaceClick(place)}
              >
                <ListItemAvatar>
                  <Avatar
                    src={place.photos[0]}
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 1,
                    }}
                  >
                    <PhotoIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ ml: 2 }}
                  primary={
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {place.name.split(',')[0]}
                      </Typography>
                      <Chip
                        label={place.isVisited ? 'Visité' : 'À visiter'}
                        size="small"
                        sx={{
                          bgcolor: place.isVisited ? '#E8F5E8' : '#FFF3E0',
                          color: place.isVisited ? '#2E7D32' : '#F57C00',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        {place.name.includes(',')
                          ? place.name.split(',').slice(1).join(',').trim()
                          : place.journalTitle}
                      </Typography>
                      {place.category && (
                        <Chip
                          label={place.category}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default MapSidebar;
