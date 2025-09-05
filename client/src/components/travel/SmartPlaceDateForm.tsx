import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Divider, Alert, Chip } from '@mui/material';
import { Schedule, Event, DateRange } from '@mui/icons-material';
import TravelSegmentSelector from './TravelSegmentSelector';
import FallbackDatePicker from './FallbackDatePicker';
import PlaceStatusToggle from './PlaceStatusToggle';
import {
  getTravelDateConstraints,
  validatePlaceDate,
  type TravelDateConstraints,
} from '../../utils/travel-logic';
import type { Journal } from '../../types';

interface SmartPlaceDateFormProps {
  journal: Journal;
  visited: boolean;
  onVisitedChange: (visited: boolean) => void;
  startDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  endDate: Date | null;
  onEndDateChange: (date: Date | null) => void;
  errors?: {
    startDate?: string;
    endDate?: string;
    visited?: string;
  };
  hasAttachments?: boolean;
}

export const SmartPlaceDateForm: React.FC<SmartPlaceDateFormProps> = ({
  journal,
  visited,
  onVisitedChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  errors = {},
  hasAttachments = false,
}) => {
  const [selectedSegment, setSelectedSegment] = useState<string>(
    visited ? 'visited' : 'planned'
  );
  const [constraints, setConstraints] = useState<TravelDateConstraints | null>(
    null
  );

  // Mettre à jour les contraintes quand le journal change
  useEffect(() => {
    const newConstraints = getTravelDateConstraints(journal);
    setConstraints(newConstraints);

    // Pour les voyages passés, forcer le statut "visité"
    if (newConstraints.status === 'past' && !visited) {
      onVisitedChange(true);
      setSelectedSegment('visited');
    }

    // Ajuster le segment sélectionné si nécessaire
    if (
      !newConstraints.allowedStatuses.includes(visited ? 'visited' : 'planned')
    ) {
      const fallbackSegment = newConstraints.allowedStatuses[0];
      setSelectedSegment(fallbackSegment);
      onVisitedChange(fallbackSegment === 'visited');
    }
  }, [journal, visited, onVisitedChange]);

  // Synchroniser le segment avec le statut visité
  useEffect(() => {
    setSelectedSegment(visited ? 'visited' : 'planned');
  }, [visited]);

  // Gérer le changement de segment
  const handleSegmentChange = (segmentId: string) => {
    setSelectedSegment(segmentId);
    const newVisited = segmentId === 'visited';
    onVisitedChange(newVisited);
  };

  // Gérer le changement de statut depuis le toggle
  const handleStatusChange = (newVisited: boolean) => {
    setSelectedSegment(newVisited ? 'visited' : 'planned');
    onVisitedChange(newVisited);
  };

  // Obtenir les contraintes de dates pour le segment sélectionné
  const getSegmentConstraints = () => {
    if (!constraints) return { min: '', max: '' };

    const segmentConstraints = visited
      ? constraints.visitedDateConstraints
      : constraints.plannedDateConstraints;
    return segmentConstraints || { min: '', max: '' };
  };

  const segmentConstraints = getSegmentConstraints();

  // Valider les dates sélectionnées
  const validateSelectedDates = () => {
    if (!constraints || !startDate) return { valid: true };

    const startDateStr = startDate.toISOString().split('T')[0];
    const startValidation = validatePlaceDate(
      startDateStr,
      visited,
      constraints
    );

    let endValidation = { isValid: true };
    if (endDate) {
      const endDateStr = endDate.toISOString().split('T')[0];
      endValidation = validatePlaceDate(endDateStr, visited, constraints);
    }

    return {
      valid: startValidation.isValid && endValidation.isValid,
      startError:
        'errorMessage' in startValidation
          ? startValidation.errorMessage || ''
          : '',
      endError:
        'errorMessage' in endValidation ? endValidation.errorMessage || '' : '',
    };
  };

  const dateValidation = validateSelectedDates();

  if (!constraints) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Chargement des contraintes de voyage...</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'primary.main',
        }}
      >
        <DateRange />
        {constraints.status === 'past'
          ? 'Date de visite'
          : 'Planification des dates'}
      </Typography>

      {/* Interface pour voyage passé avec dates de début et fin */}
      {constraints.status === 'past' ? (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Dates de visite
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <FallbackDatePicker
                label="Date de début de visite"
                value={startDate}
                onChange={onStartDateChange}
                minDate={segmentConstraints.min}
                maxDate={segmentConstraints.max}
                error={errors.startDate}
                required
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <FallbackDatePicker
                label="Date de fin de visite"
                value={endDate}
                onChange={onEndDateChange}
                minDate={
                  startDate
                    ? startDate.toISOString().split('T')[0]
                    : segmentConstraints.min
                }
                maxDate={segmentConstraints.max}
                error={errors.endDate}
              />
            </Box>
          </Box>
        </Box>
      ) : (
        <>
          {/* Sélecteur de segment */}
          <TravelSegmentSelector
            constraints={constraints}
            selectedSegment={selectedSegment}
            onSegmentChange={handleSegmentChange}
          />

          <Divider sx={{ my: 3 }} />

          {/* Toggle de statut */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Statut du lieu
            </Typography>
            <PlaceStatusToggle
              visited={visited}
              onStatusChange={handleStatusChange}
              selectedDate={startDate?.toISOString().split('T')[0] || null}
              constraints={constraints}
              hasAttachments={hasAttachments}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Sélection des dates */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Dates de {visited ? 'visite' : 'planification'}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', md: 'row' },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <FallbackDatePicker
                  label="Date de début"
                  value={startDate}
                  onChange={onStartDateChange}
                  minDate={segmentConstraints.min}
                  maxDate={segmentConstraints.max}
                  error={errors.startDate}
                  required
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <FallbackDatePicker
                  label="Date de fin"
                  value={endDate}
                  onChange={onEndDateChange}
                  minDate={
                    startDate
                      ? startDate.toISOString().split('T')[0]
                      : segmentConstraints.min
                  }
                  maxDate={segmentConstraints.max}
                  error={errors.endDate}
                />
              </Box>
            </Box>
          </Box>
        </>
      )}

      {/* Résumé de validation */}
      {startDate && (
        <Alert
          severity={dateValidation.valid ? 'success' : 'error'}
          sx={{ mt: 2 }}
          icon={visited ? <Event /> : <Schedule />}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="body2">
              {dateValidation.valid
                ? 'Configuration valide'
                : 'Configuration invalide'}
            </Typography>
            <Chip
              label={visited ? 'Lieu visité' : 'Lieu planifié'}
              size="small"
              color={visited ? 'success' : 'info'}
              sx={{ ml: 1 }}
            />
          </Box>
        </Alert>
      )}
    </Paper>
  );
};

export default SmartPlaceDateForm;
