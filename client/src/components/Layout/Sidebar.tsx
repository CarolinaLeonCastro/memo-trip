import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Typography,
  Divider,
} from '@mui/material';
import { LocationOn, Add } from '@mui/icons-material';

interface Place {
  id: string;
  name: string;
  country: string;
}

interface SidebarProps {
  places: Place[];
  selectedPlace?: string;
  onPlaceSelect: (placeId: string) => void;
  onAddPlace: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  places,
  selectedPlace,
  onPlaceSelect,
  onAddPlace,
}) => {
  return (
    <Box
      sx={{
        width: 300,
        height: '100vh',
        backgroundColor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        pt: 8, // Pour compenser l'AppBar
      }}
    >
      {/* Header de la sidebar */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          My places
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAddPlace}
          sx={{
            backgroundColor: 'accent.main',
            color: 'accent.contrastText',
            '&:hover': {
              backgroundColor: 'accent.dark',
            },
          }}
        >
          Add A Place
        </Button>
      </Box>

      <Divider />

      {/* Liste des lieux */}
      <List sx={{ flex: 1, overflow: 'auto' }}>
        {places.map((place) => (
          <ListItem key={place.id} disablePadding>
            <ListItemButton
              selected={selectedPlace === place.id}
              onClick={() => onPlaceSelect(place.id)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon>
                <LocationOn
                  sx={{
                    color:
                      selectedPlace === place.id
                        ? 'primary.contrastText'
                        : 'text.secondary',
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={place.name}
                secondary={place.country}
                sx={{
                  '& .MuiListItemText-secondary': {
                    color:
                      selectedPlace === place.id
                        ? 'primary.contrastText'
                        : 'text.secondary',
                    opacity: 0.8,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
