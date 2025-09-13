import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface DiscoverSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const DiscoverSearchBar: React.FC<DiscoverSearchBarProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <Box
      sx={{
        p: 4,
        mb: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0',
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 8 }}>
          <TextField
            fullWidth
            placeholder="Rechercher dans les journaux (titre et description)..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                bgcolor: 'surface.variant',
                border: '1px solid outline.main',
                fontSize: '0.95rem',
                '& fieldset': { border: 'none' },
                '&:hover': {
                  bgcolor: 'background.paper',
                  border: '1px solid #D1D5DB',
                },
                '&.Mui-focused': {
                  bgcolor: 'background.paper',
                  border: '1px solid #4F86F7',
                  boxShadow: '0 0 0 3px rgba(79, 134, 247, 0.1)',
                },
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              justifyContent: 'flex-end',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'text.secondary',
                fontSize: '0.875rem',
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: 'tertiary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ⚙️
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Tout
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
