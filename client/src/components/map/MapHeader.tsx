import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Search as SearchIcon,
  Satellite as SatelliteIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import theme from '../../theme';

interface MapHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: 'all' | 'visited' | 'toVisit';
  onFilterStatusChange: (value: 'all' | 'visited' | 'toVisit') => void;
  mapType: 'street' | 'satellite';
  onMapTypeChange: (value: 'street' | 'satellite') => void;
}

const MapHeader: React.FC<MapHeaderProps> = ({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  mapType,
  onMapTypeChange,
}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: { xs: 0.5, sm: 1 },
        justifyContent: 'space-between',
        flexWrap: { xs: 'wrap', lg: 'nowrap' },
        gap: { xs: 1, sm: 2 },
      }}
    >
      {/* Left side - Title responsive */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          minWidth: { xs: '100%', sm: 'auto' },
          order: { xs: 1, sm: 1 },
        }}
      >
        <Typography
          variant="h3"
          color="primary.main"
          sx={{
            fontFamily: '"Chau Philomene One", cursive',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          }}
        >
          Carte des lieux
        </Typography>
      </Box>

      {/* Center - Search bar responsive */}
      <Box
        sx={{
          flex: { xs: 0, sm: 1 },
          display: 'flex',
          justifyContent: { xs: 'stretch', sm: 'center' },
          maxWidth: { xs: '100%', sm: 400 },
          mx: { xs: 0, sm: 2 },
          width: { xs: '100%', sm: 'auto' },
          order: { xs: 3, sm: 2 },
        }}
      >
        <TextField
          placeholder="Rechercher un lieu ou un pays..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '25px',
              backgroundColor: '#f5f5f5',
              border: 'none',
              fontSize: { xs: '14px', sm: '16px' },
              '& fieldset': {
                border: 'none',
              },
              '&:hover fieldset': {
                border: 'none',
              },
              '&.Mui-focused fieldset': {
                border: '1px solid #5B9BD5',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{
                    color: '#666',
                    fontSize: { xs: '18px', sm: '20px' },
                  }}
                />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Right side - Filter buttons responsive */}
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 0.5, sm: 1 },
          alignItems: 'center',
          order: { xs: 2, sm: 3 },
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
        }}
      >
        {/* Status filter buttons */}
        <ToggleButtonGroup
          exclusive
          value={filterStatus}
          onChange={(_, newValue) => newValue && onFilterStatusChange(newValue)}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              px: { xs: 1, sm: 2 },
              py: { xs: 0.25, sm: 0.5 },
              textTransform: 'none',
              fontSize: { xs: '10px', sm: '12px' },
              fontWeight: 500,
              minWidth: { xs: 'auto', sm: 'auto' },

              '&.Mui-selected': {
                color: 'white',
                borderColor: theme.palette.primary.main,
                '&:hover': {
                  filter: 'brightness(0.9)',
                },
              },
              '&[value="all"].Mui-selected': {
                backgroundColor: theme.palette.primary.main,
              },
              '&[value="visited"].Mui-selected': {
                backgroundColor: theme.palette.success.main,
              },
              '&[value="toVisit"].Mui-selected': {
                backgroundColor: theme.palette.warning.main,
              },
            },
          }}
        >
          <ToggleButton value="all">Tous</ToggleButton>
          <ToggleButton value="visited">Visités</ToggleButton>
          <ToggleButton value="toVisit">À visiter</ToggleButton>
        </ToggleButtonGroup>

        {/* Map type toggle */}
        <ToggleButtonGroup
          value={mapType}
          exclusive
          onChange={(_, newValue) => newValue && onMapTypeChange(newValue)}
          size="small"
          sx={{
            ml: { xs: 0.5, sm: 1 },
            '& .MuiToggleButton-root': {
              px: 1,
              py: 0.5,

              borderRadius: '6px !important',

              minWidth: '40px',
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main,

                '&:hover': {
                  backgroundColor: '#4A8BC2',
                },
              },
              '&:hover': {},
              '&:not(:first-of-type)': {
                marginLeft: '-1px',
              },
            },
          }}
        >
          <ToggleButton value="street">
            <MapIcon fontSize="small" sx={{ color: 'white' }} />
          </ToggleButton>
          <ToggleButton value="satellite">
            <SatelliteIcon fontSize="small" sx={{ color: 'white' }} />
          </ToggleButton>
        </ToggleButtonGroup>

        <Button
          variant="contained"
          startIcon={<LocationIcon />}
          onClick={() => navigate('/journals/new')}
          sx={{
            ml: 1,
            background: `linear-gradient(45deg, ${theme.palette.error.main} 30%, ${theme.palette.error.light} 90%)`,
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.error.dark} 30%, ${theme.palette.error.main} 90%)`,
            },

            px: 2,
            py: 0.8,
          }}
        >
          Ajouter un journal
        </Button>
      </Box>
    </Box>
  );
};

export default MapHeader;
