import React, { useState } from 'react';
import { useJournals } from '../context/JournalContext';
import { fr } from 'date-fns/locale';
import { formatWithOptions } from 'date-fns/fp';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Box,
  Grid,
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  PhotoCamera as PhotoCameraIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import type { Place } from '../types';
import EditPlaceModal from './EditPlaceModal';

interface PlaceCardProps {
  place: Place;
  journalId: string;
  onPhotosClick: () => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  journalId,
  onPhotosClick,
}) => {
  const { deletePlace } = useJournals();
  const [showEditModal, setShowEditModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    if (
      window.confirm(`Êtes-vous sûr de vouloir supprimer "${place.name}" ?`)
    ) {
      deletePlace(journalId, place.id);
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    setShowEditModal(true);
    handleMenuClose();
  };

  return (
    <>
      <Card elevation={2} sx={{ overflow: 'hidden' }}>
        <Grid container>
          <Grid size={{ xs: 12, md: 4 }}>
            {place.photos.length > 0 ? (
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={place.photos[0]}
                  alt={place.name}
                  sx={{
                    cursor: 'pointer',
                    transition: 'opacity 0.3s',
                    '&:hover': { opacity: 0.9 },
                  }}
                  onClick={onPhotosClick}
                />
                {place.photos.length > 1 && (
                  <Chip
                    label={`+${place.photos.length - 1}`}
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                    }}
                  />
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.200',
                }}
              >
                <PhotoCameraIcon sx={{ fontSize: 48, color: 'grey.400' }} />
              </Box>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {place.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {place.description}
                  </Typography>
                </Box>

                <IconButton
                  onClick={handleMenuClick}
                  size="small"
                  sx={{ ml: 1 }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={formatWithOptions(
                    { locale: fr },
                    'dd MMM yyyy'
                  )(place.dateVisited)}
                  size="small"
                  variant="outlined"
                />

                {place.latitude != null && place.longitude != null && (
                  <Chip
                    icon={<LocationOnIcon />}
                    label={`${place.latitude.toFixed(4)}, ${place.longitude.toFixed(4)}`}
                    size="small"
                    variant="outlined"
                  />
                )}

                {place.photos.length > 0 && (
                  <Chip
                    icon={<PhotoCameraIcon />}
                    label={`${place.photos.length} photo${place.photos.length !== 1 ? 's' : ''}`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} />
          Modifier
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Supprimer
        </MenuItem>
      </Menu>

      {showEditModal && (
        <EditPlaceModal
          place={place}
          journalId={journalId}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
};

export default PlaceCard;
