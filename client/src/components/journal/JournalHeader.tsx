import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  Container,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { formatWithOptions } from 'date-fns/fp';
import { fr } from 'date-fns/locale';

interface JournalHeaderProps {
  journal: {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    location?: string;
    isShared?: boolean;
    isFavorite?: boolean;
  };
}

export const JournalHeader: React.FC<JournalHeaderProps> = ({ journal }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Calcul de la durée du voyage
  const duration =
    Math.ceil(
      (journal.endDate.getTime() - journal.startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  return (
    <Card
      sx={{
        position: 'static',
        mb: 3,
        borderRadius: 1,
        bgcolor: 'background.paper',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: { xs: 48, sm: 56 },
            py: { xs: 0.5, sm: 1 },
          }}
        >
          {/* Section gauche - Navigation et titre */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 2 },
              flex: 1,
              minWidth: 0,
            }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/journals')}
              sx={{
                color: 'text.primary',
                minWidth: 'auto',
                px: { xs: 0.5, sm: 1 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
              size={isMobile ? 'small' : 'medium'}
            >
              {isMobile ? '' : ''}
            </Button>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant={isMobile ? 'subtitle1' : 'h6'}
                fontWeight={600}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {journal.title}
              </Typography>

              {!isMobile && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mt: 0.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatWithOptions(
                      { locale: fr },
                      'dd MMM yyyy'
                    )(journal.startDate)}{' '}
                    -{' '}
                    {formatWithOptions(
                      { locale: fr },
                      'dd MMM yyyy'
                    )(journal.endDate)}
                  </Typography>

                  {journal.location && (
                    <Chip
                      label={journal.location}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.75rem',
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(144, 202, 249, 0.16)'
                            : '#E3F2FD',
                        color:
                          theme.palette.mode === 'dark' ? '#90CAF9' : '#1976D2',
                      }}
                    />
                  )}

                  <Chip
                    label={`${duration} jour${duration > 1 ? 's' : ''}`}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.75rem',
                      bgcolor:
                        theme.palette.mode === 'dark'
                          ? 'rgba(76, 175, 80, 0.16)'
                          : '#E8F5E8',
                      color:
                        theme.palette.mode === 'dark' ? '#81C784' : '#2E7D32',
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>

          {/* Section droite - Actions */}
          <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
            <IconButton
              sx={{
                color: journal.isFavorite ? 'error.main' : 'text.secondary',
              }}
              size={isMobile ? 'small' : 'medium'}
            >
              <FavoriteIcon />
            </IconButton>

            {journal.isShared && (
              <IconButton
                sx={{
                  color: 'primary.main',
                }}
                size={isMobile ? 'small' : 'medium'}
              >
                <ShareIcon />
              </IconButton>
            )}

            <Button
              startIcon={!isMobile && <EditIcon />}
              variant="outlined"
              onClick={() => navigate(`/journals/${journal.id}/edit`)}
              size={isMobile ? 'small' : 'medium'}
              sx={{ minWidth: { xs: 'auto', sm: 'auto' } }}
            >
              {isMobile ? <EditIcon /> : 'Modifier'}
            </Button>
          </Box>
        </Box>

        {/* Informations mobile - affichées sous le header principal en mobile */}
        {isMobile && (
          <Box
            sx={{
              borderTop: 1,
              borderColor: 'divider',
              pt: 1,
              pb: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.75rem' }}
            >
              {formatWithOptions(
                { locale: fr },
                'dd MMM yyyy'
              )(journal.startDate)}{' '}
              -{' '}
              {formatWithOptions(
                { locale: fr },
                'dd MMM yyyy'
              )(journal.endDate)}
            </Typography>

            {journal.location && (
              <Chip
                label={journal.location}
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.7rem',
                  bgcolor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(144, 202, 249, 0.16)'
                      : '#E3F2FD',
                  color: theme.palette.mode === 'dark' ? '#90CAF9' : '#1976D2',
                }}
              />
            )}

            <Chip
              label={`${duration} jour${duration > 1 ? 's' : ''}`}
              size="small"
              sx={{
                height: 18,
                fontSize: '0.7rem',
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(76, 175, 80, 0.16)'
                    : '#E8F5E8',
                color: theme.palette.mode === 'dark' ? '#81C784' : '#2E7D32',
              }}
            />
          </Box>
        )}
      </Container>
    </Card>
  );
};
