import React, { useState } from 'react';
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
} from '@mui/material';
import {
  CheckCircle,
  Schedule,
  Warning,
  Info,
  CameraAlt,
  Notes,
} from '@mui/icons-material';
import {
  validatePlaceDate,
  type TravelDateConstraints,
} from '../../utils/travel-logic';

interface PlaceStatusToggleProps {
  visited: boolean;
  onStatusChange: (isVisited: boolean) => void;
  selectedDate: string | null;
  constraints: TravelDateConstraints;
  hasAttachments?: boolean; // Photos, notes, etc.
  disabled?: boolean;
}

export const PlaceStatusToggle: React.FC<PlaceStatusToggleProps> = ({
  visited,
  onStatusChange,
  selectedDate,
  constraints,
  hasAttachments = false,
  disabled = false,
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<boolean | null>(null);

  // Valider si le changement de statut est possible
  const validateStatusChange = (
    newVisited: boolean
  ): { isValid: boolean; errorMessage?: string } => {
    if (!selectedDate) {
      return {
        isValid: false,
        errorMessage: "Veuillez d'abord sélectionner une date",
      };
    }

    const validation = validatePlaceDate(selectedDate, newVisited, constraints);

    // Vérifications supplémentaires pour le passage à "planifié"
    if (!newVisited && visited && hasAttachments) {
      return {
        isValid: false,
        errorMessage:
          'Ce lieu a des preuves de visite (photos, notes). Conversion non recommandée.',
      };
    }

    return validation;
  };

  const handleStatusChange = (
    event: React.MouseEvent<HTMLElement>,
    newStatus: string | null
  ) => {
    if (newStatus === null || disabled) return;

    const newVisited = newStatus === 'visited';
    const validation = validateStatusChange(newVisited);

    if (!validation.isValid) {
      // Afficher une alerte ou empêcher le changement
      return;
    }

    // Si on passe de "visité" à "planifié" avec des attachements, demander confirmation
    if (!newVisited && visited && hasAttachments) {
      setPendingStatus(newVisited);
      setShowConfirmDialog(true);
      return;
    }

    // Changement direct
    onStatusChange(newVisited);
  };

  const confirmStatusChange = () => {
    if (pendingStatus !== null) {
      onStatusChange(pendingStatus);
    }
    setShowConfirmDialog(false);
    setPendingStatus(null);
  };

  const cancelStatusChange = () => {
    setShowConfirmDialog(false);
    setPendingStatus(null);
  };

  // Vérifier la validité du statut actuel avec la date sélectionnée
  const currentValidation = selectedDate
    ? validatePlaceDate(selectedDate, visited, constraints)
    : { isValid: true };

  return (
    <Box>
      {/* Toggle Button Group */}
      <ToggleButtonGroup
        value={visited ? 'visited' : 'planned'}
        exclusive
        onChange={handleStatusChange}
        disabled={disabled}
        sx={{ mb: 2, width: '100%' }}
      >
        <ToggleButton
          value="planned"
          sx={{
            flex: 1,
            '&.Mui-selected': {
              bgcolor: 'info.main',
              color: 'white',
              '&:hover': { bgcolor: 'info.dark' },
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Schedule />
            <Typography variant="body2" fontWeight={500}>
              À visiter
            </Typography>
          </Box>
        </ToggleButton>

        <ToggleButton
          value="visited"
          sx={{
            flex: 1,
            '&.Mui-selected': {
              bgcolor: 'success.main',
              color: 'white',
              '&:hover': { bgcolor: 'success.dark' },
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle />
            <Typography variant="body2" fontWeight={500}>
              Visité
            </Typography>
          </Box>
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Alertes de validation */}
      {selectedDate && !currentValidation.isValid && (
        <Alert severity="error" sx={{ mb: 2 }} icon={<Warning />}>
          <Typography variant="body2">
            {currentValidation.errorMessage}
          </Typography>
        </Alert>
      )}

      {/* Information sur les attachements */}
      {hasAttachments && (
        <Alert severity="info" sx={{ mb: 2 }} icon={<Info />}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Ce lieu contient des preuves de visite :
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            <Chip
              icon={<CameraAlt />}
              label="Photos"
              size="small"
              variant="outlined"
              color="info"
            />
            <Chip
              icon={<Notes />}
              label="Notes"
              size="small"
              variant="outlined"
              color="info"
            />
          </Box>
        </Alert>
      )}

      {/* Dialog de confirmation pour conversion avec attachements */}
      <Dialog open={showConfirmDialog} onClose={cancelStatusChange}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="warning" />
            Confirmer la conversion
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Vous êtes sur le point de changer ce lieu de "Visité" à "À visiter".
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Ce lieu contient des preuves de visite (photos, notes). Êtes-vous
            sûr de vouloir le marquer comme non visité ?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Les preuves de visite seront conservées mais le statut sera
              modifié.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelStatusChange} color="inherit">
            Annuler
          </Button>
          <Button
            onClick={confirmStatusChange}
            color="warning"
            variant="contained"
          >
            Confirmer la conversion
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlaceStatusToggle;
