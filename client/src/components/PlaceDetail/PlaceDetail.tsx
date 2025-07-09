import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Divider,
} from '@mui/material';
import { Download, Image } from '@mui/icons-material';

interface Place {
  id: string;
  title: string;
  location: string;
  images: string[];
  notes?: string;
}

interface PlaceDetailProps {
  place: Place;
  onDownload: () => void;
}

export const PlaceDetail: React.FC<PlaceDetailProps> = ({
  place,
  onDownload,
}) => {
  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          '@media (max-width: 960px)': { flexDirection: 'column' },
        }}
      >
        {/* Carte interactive */}
        <Box sx={{ flex: 2 }}>
          <Paper
            sx={{
              height: 400,
              backgroundColor: 'background.secondary',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Interactive Map View
            </Typography>
          </Paper>
        </Box>

        {/* Informations du lieu */}
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
                    {place.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {place.location}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={onDownload}
                  sx={{
                    backgroundColor: '#4A90E2',
                    '&:hover': {
                      backgroundColor: '#357ABD',
                    },
                  }}
                >
                  Download
                </Button>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Notes */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                  Notes
                </Typography>
                <Typography variant="body1" color="text.primary">
                  {place.notes ||
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."}
                </Typography>
              </Box>

              {/* Photos */}
              <Box>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                  Photos
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 'calc(50% - 4px)',
                        height: 120,
                        backgroundColor: 'background.secondary',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid',
                        borderColor: 'divider',
                        overflow: 'hidden',
                      }}
                    >
                      {place.images[index] ? (
                        <CardMedia
                          component="img"
                          height="100%"
                          width="100%"
                          image={place.images[index]}
                          alt={`${place.title} ${index + 1}`}
                          sx={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <Image sx={{ color: 'text.disabled', fontSize: 32 }} />
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default PlaceDetail;
