import React from 'react';
import { Card, CardContent, Box, Skeleton, Stack, Grid } from '@mui/material';

interface JournalCardSkeletonProps {
  count?: number;
}

const JournalCardSkeleton: React.FC<JournalCardSkeletonProps> = ({
  count = 1,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Grid key={index} size={{ xs: 12, md: 6, lg: 6 }}>
          <Card
            sx={{
              borderRadius: 1,
              overflow: 'hidden',
              display: 'flex',
              height: '180px',
              border: '1px solid #f0f0f0',
            }}
          >
            {/* Image à gauche */}
            <Box sx={{ width: 240, flexShrink: 0 }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                sx={{ backgroundColor: 'grey.100' }}
              />
            </Box>

            {/* Contenu à droite */}
            <CardContent
              sx={{
                p: 3,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                {/* Titre */}
                <Skeleton
                  variant="text"
                  width="85%"
                  height={28}
                  sx={{ mb: 1 }}
                />

                {/* Description */}
                <Box sx={{ mb: 2 }}>
                  <Skeleton variant="text" width="100%" height={18} />
                  <Skeleton variant="text" width="70%" height={18} />
                </Box>

                {/* Tags */}
                <Stack direction="row" spacing={0.5} sx={{ mb: 2 }}>
                  <Skeleton variant="rounded" width={50} height={18} />
                  <Skeleton variant="rounded" width={40} height={18} />
                  <Skeleton variant="rounded" width={60} height={18} />
                </Stack>

                {/* Aperçu des lieux */}
                <Stack direction="row" spacing={0.5} sx={{ mb: 2 }}>
                  <Skeleton variant="rounded" width={80} height={24} />
                  <Skeleton variant="rounded" width={70} height={24} />
                  <Skeleton variant="rounded" width={60} height={24} />
                  <Skeleton variant="rounded" width={30} height={24} />
                </Stack>

                {/* Nombre de lieux */}
                <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
                  <Skeleton
                    variant="circular"
                    width={14}
                    height={14}
                    sx={{ mr: 0.5 }}
                  />
                  <Skeleton variant="text" width={60} height={16} />
                </Stack>
              </Box>

              {/* Footer avec info utilisateur et stats */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {/* Utilisateur */}
                <Stack direction="row" alignItems="center">
                  <Skeleton
                    variant="circular"
                    width={28}
                    height={28}
                    sx={{ mr: 1 }}
                  />
                  <Box>
                    <Skeleton variant="text" width={80} height={16} />
                    <Skeleton variant="text" width={60} height={14} />
                  </Box>
                </Stack>

                {/* Stats */}
                <Stack direction="row" spacing={1.5}>
                  <Stack direction="row" alignItems="center" spacing={0.3}>
                    <Skeleton variant="circular" width={14} height={14} />
                    <Skeleton variant="text" width={20} height={14} />
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.3}>
                    <Skeleton variant="circular" width={14} height={14} />
                    <Skeleton variant="text" width={20} height={14} />
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.3}>
                    <Skeleton variant="circular" width={14} height={14} />
                    <Skeleton variant="text" width={20} height={14} />
                  </Stack>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </>
  );
};

export default JournalCardSkeleton;
