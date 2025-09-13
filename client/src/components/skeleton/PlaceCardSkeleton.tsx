import React from 'react';
import { Card, CardContent, Box, Skeleton, Stack, Grid } from '@mui/material';

interface PlaceCardSkeletonProps {
  count?: number;
  compact?: boolean;
}

const PlaceCardSkeleton: React.FC<PlaceCardSkeletonProps> = ({
  count = 1,
  compact = false,
}) => {
  const cardHeight = compact ? 200 : 380;
  const imageHeight = compact ? 120 : 160;

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
          <Card
            sx={{
              height: cardHeight,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            {/* Image skeleton */}
            <Skeleton
              variant="rectangular"
              height={imageHeight}
              sx={{ backgroundColor: 'grey.100' }}
            />

            {/* Content skeleton */}
            <CardContent
              sx={{
                flex: 1,
                p: compact ? 1.5 : 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                {/* Title */}
                <Skeleton
                  variant="text"
                  width="80%"
                  height={compact ? 20 : 24}
                  sx={{ mb: 0.5 }}
                />

                {/* Location */}
                <Stack direction="row" alignItems="center" sx={{ mb: 0.5 }}>
                  <Skeleton
                    variant="circular"
                    width={14}
                    height={14}
                    sx={{ mr: 0.5 }}
                  />
                  <Skeleton variant="text" width="60%" height={16} />
                </Stack>

                {/* Description */}
                {!compact && (
                  <Box sx={{ mb: 1 }}>
                    <Skeleton variant="text" width="100%" height={16} />
                    <Skeleton variant="text" width="70%" height={16} />
                  </Box>
                )}

                {/* Tags */}
                <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
                  <Skeleton variant="rounded" width={60} height={20} />
                  <Skeleton variant="rounded" width={45} height={20} />
                  <Skeleton variant="rounded" width={55} height={20} />
                </Stack>
              </Box>

              {/* Footer */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {/* Rating */}
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      variant="circular"
                      width={14}
                      height={14}
                    />
                  ))}
                </Stack>

                {/* Date */}
                <Stack direction="row" alignItems="center">
                  <Skeleton
                    variant="circular"
                    width={12}
                    height={12}
                    sx={{ mr: 0.5 }}
                  />
                  <Skeleton variant="text" width={40} height={14} />
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </>
  );
};

export default PlaceCardSkeleton;
