import React from 'react';
import {
  Chip,
  Avatar,
  Box,
  Typography,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  CheckCircle as VisitedIcon,
  Schedule as PlannedIcon,
} from '@mui/icons-material';
import type { PlacePreview } from './types';

interface PlacePreviewChipProps {
  place: PlacePreview;
  size?: 'small' | 'medium';
  variant?: 'default' | 'minimal';
  onClick?: (place: PlacePreview) => void;
}

const PlacePreviewChip: React.FC<PlacePreviewChipProps> = ({
  place,
  size = 'small',
  variant = 'default',
  onClick,
}) => {
  const theme = useTheme();

  const handleClick = () => {
    if (onClick) {
      onClick(place);
    }
  };

  const getLocationText = () => {
    if (place.city && place.country) {
      return `${place.city}, ${place.country}`;
    }
    if (place.city) return place.city;
    if (place.country) return place.country;
    return 'Lieu';
  };

  const getStatusIcon = () => {
    return place.status === 'visited' ? (
      <VisitedIcon
        sx={{
          fontSize: size === 'small' ? 14 : 16,
          color: theme.palette.success.main,
        }}
      />
    ) : (
      <PlannedIcon
        sx={{
          fontSize: size === 'small' ? 14 : 16,
          color: theme.palette.warning.main,
        }}
      />
    );
  };

  const chipLabel = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {variant === 'default' && getStatusIcon()}
      <Typography
        variant={size === 'small' ? 'caption' : 'body2'}
        sx={{
          fontWeight: 500,
          color: 'inherit',
          maxWidth: variant === 'minimal' ? '120px' : '140px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {place.name}
      </Typography>
    </Box>
  );

  const chipAvatar = place.coverImage ? (
    <Avatar
      src={place.coverImage}
      sx={{
        width: size === 'small' ? 20 : 24,
        height: size === 'small' ? 20 : 24,
        '& img': {
          objectFit: 'cover',
        },
      }}
    />
  ) : (
    <LocationIcon
      sx={{
        fontSize: size === 'small' ? 18 : 20,
        color: theme.palette.primary.main,
      }}
    />
  );

  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {place.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'grey.300' }}>
            {getLocationText()}
          </Typography>
          {variant === 'default' && (
            <Typography
              variant="caption"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 0.5,
                color:
                  place.status === 'visited'
                    ? 'success.light'
                    : 'warning.light',
              }}
            >
              {getStatusIcon()}
              {place.status === 'visited' ? 'Visité' : 'Planifié'}
            </Typography>
          )}
        </Box>
      }
      placement="top"
      arrow
    >
      <Chip
        avatar={chipAvatar}
        label={chipLabel}
        variant="outlined"
        size={size}
        onClick={onClick ? handleClick : undefined}
        sx={{
          maxWidth: '180px',
          backgroundColor: 'background.paper',
          borderColor: 'divider',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.2s ease-in-out',
          '&:hover': onClick
            ? {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover',
                transform: 'translateY(-1px)',
                boxShadow: theme.shadows[2],
              }
            : {},
          '& .MuiChip-label': {
            padding: size === 'small' ? '2px 4px' : '4px 6px',
          },
        }}
      />
    </Tooltip>
  );
};

export default PlacePreviewChip;
