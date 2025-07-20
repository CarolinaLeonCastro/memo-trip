import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

import { fr } from 'date-fns/locale';
import { formatWithOptions } from 'date-fns/fp';
import { useJournals } from '../context/JournalContext';

const Journals: React.FC = () => {
  const { journals, deleteJournal } = useJournals();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJournals = journals.filter(
    (journal) =>
      journal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journal.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string, title: string) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer le journal "${title}" ?`
      )
    ) {
      deleteJournal(id);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
            Mes Journaux de Voyage
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Découvrez et gérez tous vos souvenirs de voyage
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/journals/new"
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
          sx={{ borderRadius: 2 }}
        >
          Nouveau Journal
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Rechercher un journal..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500 }}
        />
      </Box>

      {/* Journals Grid */}
      {filteredJournals.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <LocationIcon
              sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
            />
            <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
              {searchTerm
                ? 'Aucun journal trouvé'
                : 'Aucun journal pour le moment'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm
                ? "Essayez avec d'autres mots-clés"
                : 'Commencez votre première aventure en créant un nouveau journal'}
            </Typography>
            {!searchTerm && (
              <Button
                component={Link}
                to="/journals/new"
                variant="contained"
                startIcon={<AddIcon />}
                size="large"
              >
                Créer mon premier journal
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredJournals.map((journal) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={journal.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      journal.places[0]?.photos[0] ||
                      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800'
                    }
                    alt={journal.title}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      display: 'flex',
                      gap: 1,
                    }}
                  >
                    <IconButton
                      component={Link}
                      to={`/journals/${journal.id}/edit`}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.9)',
                        '&:hover': { bgcolor: 'white' },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(journal.id, journal.title)}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.9)',
                        '&:hover': { bgcolor: 'white' },
                      }}
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </Box>
                </Box>

                <CardContent
                  sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                >
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    {journal.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, flexGrow: 1 }}
                  >
                    {journal.description}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Chip
                      icon={<CalendarIcon />}
                      label={`${formatWithOptions({ locale: fr }, 'dd MMM')(journal.startDate)} - ${formatWithOptions({ locale: fr }, 'dd MMM yyyy')(journal.endDate)}`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {journal.places.length} lieu
                        {journal.places.length !== 1 ? 'x' : ''}
                      </Typography>
                    </Box>

                    <Button
                      component={Link}
                      to={`/journals/${journal.id}`}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    >
                      Voir détails →
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Journals;
