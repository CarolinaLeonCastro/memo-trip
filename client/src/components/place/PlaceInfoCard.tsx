import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';

interface PracticalInfo {
  best_time_to_visit: string;
  average_cost: string;
  opening_hours: string;
  website?: string;
  recommendations: string;
}

interface PlaceInfoCardProps {
  practicalInfo?: PracticalInfo;
  address: string;
  coordinates: string;
  tags: string[];
}

export const PlaceInfoCard: React.FC<PlaceInfoCardProps> = ({
  practicalInfo,
  address,
  coordinates,
  tags,
}) => {
  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Informations pratiques */}
        {practicalInfo && (
          <>
            <Typography
              variant="h6"
              fontWeight="700"
              sx={{ mb: 3, color: '#1F2937', fontSize: '1.1rem' }}
            >
              Informations pratiques
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTimeIcon
                  sx={{ fontSize: 18, color: '#4F86F7', mr: 1 }}
                />
                <Typography
                  variant="body2"
                  fontWeight="600"
                  sx={{ color: '#1F2937' }}
                >
                  Meilleure période
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#6B7280', ml: 3 }}>
                {practicalInfo.best_time_to_visit}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoneyIcon
                  sx={{ fontSize: 18, color: '#10B981', mr: 1 }}
                />
                <Typography
                  variant="body2"
                  fontWeight="600"
                  sx={{ color: '#1F2937' }}
                >
                  Coût moyen
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#6B7280', ml: 3 }}>
                {practicalInfo.average_cost}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                fontWeight="600"
                sx={{ color: '#1F2937', mb: 1 }}
              >
                Horaires d'ouverture
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                {practicalInfo.opening_hours}
              </Typography>
            </Box>

            {practicalInfo.website && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LanguageIcon
                    sx={{ fontSize: 18, color: '#6366F1', mr: 1 }}
                  />
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ color: '#1F2937' }}
                  >
                    Site web
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#4F86F7',
                    ml: 3,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  {practicalInfo.website}
                </Typography>
              </Box>
            )}

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body2"
                fontWeight="600"
                sx={{ color: '#1F2937', mb: 1 }}
              >
                Recommandations
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#6B7280', lineHeight: 1.6 }}
              >
                {practicalInfo.recommendations}
              </Typography>
            </Box>
          </>
        )}

        {/* Localisation */}
        <Typography
          variant="h6"
          fontWeight="700"
          sx={{ mb: 2, color: '#1F2937', fontSize: '1.1rem' }}
        >
          Localisation
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOnIcon sx={{ fontSize: 18, color: '#EF4444', mr: 1 }} />
            <Typography
              variant="body2"
              fontWeight="600"
              sx={{ color: '#1F2937' }}
            >
              Adresse
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#6B7280', ml: 3 }}>
            {address}
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="body2"
            fontWeight="600"
            sx={{ color: '#1F2937', mb: 1 }}
          >
            Coordonnées
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280' }}>
            {coordinates}
          </Typography>
        </Box>

        {/* Tags */}
        <Typography
          variant="h6"
          fontWeight="700"
          sx={{ mb: 2, color: '#1F2937', fontSize: '1.1rem' }}
        >
          Tags
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{
                bgcolor: '#F1F5F9',
                color: '#4F86F7',
                fontWeight: '500',
                '&:hover': {
                  bgcolor: '#E0E7FF',
                },
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
