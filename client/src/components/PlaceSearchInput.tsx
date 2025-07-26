import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { LocationOn as LocationIcon } from '@mui/icons-material';
import {
  GeocodingService,
  type GeocodingResult,
} from '../services/geocoding.service';

interface PlaceSearchInputProps {
  onPlaceSelect: (place: GeocodingResult) => void;
  placeholder?: string;
  label?: string;
  error?: boolean;
  helperText?: string;
  value?: string;
}

const PlaceSearchInput: React.FC<PlaceSearchInputProps> = ({
  onPlaceSelect,
  placeholder = 'Rechercher un lieu...',
  label = 'Lieu',
  error = false,
  helperText,
  value = '',
}) => {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchPlaces = async (searchQuery: string) => {
    if (searchQuery.trim().length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const places = await GeocodingService.searchPlaces(searchQuery, 5);
      setResults(places);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchPlaces(value);
    }, 300);
  };

  const handlePlaceSelect = (place: GeocodingResult) => {
    setQuery(place.display_name);
    setShowResults(false);
    onPlaceSelect(place);
  };

  return (
    <Box ref={wrapperRef} sx={{ position: 'relative', width: '100%' }}>
      <TextField
        fullWidth
        label={label}
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        error={error}
        helperText={helperText}
        InputProps={{
          endAdornment: loading && <CircularProgress size={20} />,
        }}
      />

      {showResults && (results.length > 0 || loading) && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1300,
            mt: 1,
            maxHeight: 300,
            overflow: 'auto',
          }}
        >
          <List dense>
            {results.map((place, index) => (
              <React.Fragment key={place.place_id}>
                <ListItem
                  component="button"
                  onClick={() => handlePlaceSelect(place)}
                  sx={{
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <LocationIcon
                    sx={{
                      mr: 2,
                      color: 'primary.main',
                      fontSize: 20,
                    }}
                  />
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={500}>
                        {place.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {place.display_name}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < results.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default PlaceSearchInput;
