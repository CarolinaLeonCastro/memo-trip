import React, { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
  Popover,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Clear as ClearIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useDebounce } from '../../hooks/useDebounce';

export interface PlaceFilters {
  search?: string;
  tag?: string;
  sort?: 'recent' | 'likes' | 'photos';
}

interface PlaceFilterToolbarProps {
  filters: PlaceFilters;
  onFiltersChange: (filters: PlaceFilters) => void;
  availableTags?: string[];
  totalResults?: number;
  loading?: boolean;
}

const SORT_OPTIONS = [
  { value: 'recent', label: 'Plus récents' },
  { value: 'likes', label: 'Plus appréciés' },
  { value: 'photos', label: 'Plus de photos' },
];

const PlaceFilterToolbar: React.FC<PlaceFilterToolbarProps> = ({
  filters,
  onFiltersChange,
  availableTags = [],
  totalResults,
  loading = false,
}) => {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [tagAnchorEl, setTagAnchorEl] = useState<HTMLButtonElement | null>(
    null
  );

  // Debounce la recherche
  const debouncedSearch = useDebounce(searchValue, 300);

  // Mettre à jour les filtres quand la recherche change (avec debounce)
  React.useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFiltersChange({ ...filters, search: debouncedSearch || undefined });
    }
  }, [debouncedSearch, filters, onFiltersChange]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSortChange = (sort: string) => {
    onFiltersChange({ ...filters, sort: sort as PlaceFilters['sort'] });
  };

  const handleTagSelect = (tag: string) => {
    onFiltersChange({ ...filters, tag: tag === filters.tag ? undefined : tag });
    setTagAnchorEl(null);
  };

  const handleClearFilters = () => {
    setSearchValue('');
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.search || filters.tag || filters.sort !== 'recent';

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        {/* Recherche */}
        <TextField
          placeholder="Rechercher des lieux..."
          value={searchValue}
          onChange={handleSearchChange}
          size="small"
          sx={{ flex: 1, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 20, color: 'action.active' }} />
              </InputAdornment>
            ),
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchValue('')}
                  sx={{ p: 0.5 }}
                >
                  <ClearIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Filtre par tag */}
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={(event) => setTagAnchorEl(event.currentTarget)}
          sx={{
            minWidth: 120,
            color: filters.tag ? 'primary.main' : 'text.secondary',
            borderColor: filters.tag ? 'primary.main' : 'divider',
          }}
        >
          {filters.tag || 'Tags'}
        </Button>

        <Popover
          open={Boolean(tagAnchorEl)}
          anchorEl={tagAnchorEl}
          onClose={() => setTagAnchorEl(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 2, minWidth: 250, maxWidth: 400 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Filtrer par catégorie
            </Typography>
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ flexWrap: 'wrap', gap: 0.5 }}
            >
              {availableTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant={filters.tag === tag ? 'filled' : 'outlined'}
                  color={filters.tag === tag ? 'primary' : 'default'}
                  onClick={() => handleTagSelect(tag)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Stack>
            {filters.tag && (
              <Button
                variant="text"
                size="small"
                startIcon={<ClearIcon />}
                onClick={() => handleTagSelect(filters.tag!)}
                sx={{ mt: 1 }}
              >
                Effacer le filtre
              </Button>
            )}
          </Box>
        </Popover>

        {/* Tri */}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="sort-select-label">Trier par</InputLabel>
          <Select
            labelId="sort-select-label"
            value={filters.sort || 'recent'}
            onChange={(e) => handleSortChange(e.target.value)}
            label="Trier par"
            startAdornment={<SortIcon sx={{ fontSize: 18, mr: 0.5 }} />}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Bouton clear */}
        {hasActiveFilters && (
          <IconButton
            onClick={handleClearFilters}
            size="small"
            color="error"
            sx={{
              border: '1px solid',
              borderColor: 'error.main',
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'white',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Stack>

      {/* Résultats */}
      {totalResults !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {loading ? 'Recherche...' : `${totalResults} lieux trouvés`}
          </Typography>

          {/* Filtres actifs */}
          {hasActiveFilters && (
            <Stack direction="row" spacing={0.5} sx={{ ml: 1 }}>
              {filters.search && (
                <Chip
                  label={`"${filters.search}"`}
                  size="small"
                  onDelete={() =>
                    onFiltersChange({ ...filters, search: undefined })
                  }
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.tag && (
                <Chip
                  label={filters.tag}
                  size="small"
                  onDelete={() =>
                    onFiltersChange({ ...filters, tag: undefined })
                  }
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.sort && filters.sort !== 'recent' && (
                <Chip
                  label={
                    SORT_OPTIONS.find((opt) => opt.value === filters.sort)
                      ?.label
                  }
                  size="small"
                  onDelete={() =>
                    onFiltersChange({ ...filters, sort: 'recent' })
                  }
                  color="primary"
                  variant="outlined"
                />
              )}
            </Stack>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PlaceFilterToolbar;
