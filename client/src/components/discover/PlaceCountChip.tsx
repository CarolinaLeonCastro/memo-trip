import React from 'react';
import { Chip, Typography, useTheme, alpha } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface PlaceCountChipProps {
  count: number;
  size?: 'small' | 'medium';
  onClick?: () => void;
}

const PlaceCountChip: React.FC<PlaceCountChipProps> = ({
  count,
  size = 'small',
  onClick,
}) => {
  const theme = useTheme();

  if (count <= 0) return null;

  return (
    <Chip
      icon={<AddIcon sx={{ fontSize: size === 'small' ? 14 : 16 }} />}
      label={
        <Typography
          variant={size === 'small' ? 'caption' : 'body2'}
          sx={{ fontWeight: 600 }}
        >
          {count}
        </Typography>
      }
      size={size}
      variant="filled"
      onClick={onClick}
      sx={{
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        color: 'primary.main',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick
          ? {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
              transform: 'translateY(-1px)',
              boxShadow: theme.shadows[2],
            }
          : {},
        '& .MuiChip-label': {
          padding: size === 'small' ? '2px 4px' : '4px 6px',
        },
        '& .MuiChip-icon': {
          marginLeft: size === 'small' ? '4px' : '6px',
          marginRight: size === 'small' ? '-2px' : '-1px',
        },
      }}
    />
  );
};

export default PlaceCountChip;
