import React from 'react';
import { Typography, Box } from '@mui/material';

// Exemples d'utilisation de la police Chau Philomene One

const TypographyExamples: React.FC = () => {
  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" gutterBottom>
        Exemples d'utilisation de la police Chau Philomene One
      </Typography>

      {/* Utilisation avec la variante decorative */}
      <Typography variant="decorative" color="primary.main">
        Titre décoratif principal
      </Typography>

      {/* Utilisation directe avec sx */}
      <Typography
        variant="h3"
        sx={{
          fontFamily: '"Chau Philomene One", cursive',
          color: 'secondary.main',
        }}
      >
        Titre avec style personnalisé
      </Typography>

      {/* Utilisation pour un sous-titre */}
      <Typography
        variant="h6"
        sx={{
          fontFamily: '"Chau Philomene One", cursive',
          color: 'text.secondary',
          fontWeight: 400,
        }}
      >
        Sous-titre élégant
      </Typography>

      {/* Utilisation pour une citation ou un texte spécial */}
      <Typography
        sx={{
          fontFamily: '"Chau Philomene One", cursive',
          fontSize: '1.25rem',
          color: 'primary.dark',
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        "Une citation élégante avec la police décorative"
      </Typography>
    </Box>
  );
};

export default TypographyExamples;
