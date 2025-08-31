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
        bgcolor: 'white',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0',
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 8 }}>
          <TextField
            fullWidth
            placeholder="Rechercher des lieux, journaux ou utilisateurs..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#F8FAFC',
                border: '1px solid #E5E7EB',
                fontSize: '0.95rem',
                '& fieldset': { border: 'none' },
                '&:hover': {
                  bgcolor: '#F1F5F9',
                  border: '1px solid #D1D5DB',
                },
                '&.Mui-focused': {
                  bgcolor: 'white',
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
                color: '#6B7280',
                fontSize: '0.875rem',
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: '#E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ⚙️
              </Box>
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                Tout
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
