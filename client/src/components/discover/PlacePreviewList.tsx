import React from 'react';
import { Box, Stack } from '@mui/material';
import PlacePreviewChip from './PlacePreviewChip';
import PlaceCountChip from './PlaceCountChip';
import type { PlacePreview } from './types';

interface PlacePreviewListProps {
  places: PlacePreview[];
  remainingCount: number;
  maxDisplay?: number;
  size?: 'small' | 'medium';
  variant?: 'default' | 'minimal';
  onPlaceClick?: (place: PlacePreview) => void;
  onViewAllClick?: () => void;
}

const PlacePreviewList: React.FC<PlacePreviewListProps> = ({
  places,
  remainingCount,
  maxDisplay = 3,
  size = 'small',
  variant = 'default',
  onPlaceClick,
  onViewAllClick,
}) => {
  const displayPlaces = places.slice(0, maxDisplay);

  if (displayPlaces.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 1 }}>
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          flexWrap: 'wrap',
          gap: 0.5,
          alignItems: 'center',
        }}
      >
        {displayPlaces.map((place) => (
          <PlacePreviewChip
            key={place._id}
            place={place}
            size={size}
            variant={variant}
            onClick={onPlaceClick}
          />
        ))}

        {remainingCount > 0 && (
          <PlaceCountChip
            count={remainingCount}
            size={size}
            onClick={onViewAllClick}
          />
        )}
      </Stack>
    </Box>
  );
};

export default PlacePreviewList;
