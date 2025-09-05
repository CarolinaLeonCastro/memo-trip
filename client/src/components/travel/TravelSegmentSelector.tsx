import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Typography,
  Alert,
} from '@mui/material';
import { DateRange, Event, Schedule } from '@mui/icons-material';
import { formatWithOptions } from 'date-fns/fp';
import { fr } from 'date-fns/locale';
import type { TravelDateConstraints } from '../../utils/travel-logic';

interface TravelSegment {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  color: string;
  icon: React.ReactNode;
}

interface TravelSegmentSelectorProps {
  constraints: TravelDateConstraints;
  selectedSegment: string;
  onSegmentChange: (segmentId: string) => void;
  journalStartDate: Date;
  journalEndDate: Date;
}

export const TravelSegmentSelector: React.FC<TravelSegmentSelectorProps> = ({
  constraints,
  selectedSegment,
  onSegmentChange,
  journalStartDate,
  journalEndDate,
}) => {
  const formatDate = formatWithOptions({ locale: fr }, 'dd MMM yyyy');

  // Générer les segments disponibles selon les contraintes
  const getAvailableSegments = (): TravelSegment[] => {
    const segments: TravelSegment[] = [];

    // Segment "Lieux visités" si autorisé
    if (
      constraints.allowedStatuses.includes('visited') &&
      constraints.visitedDateConstraints
    ) {
      segments.push({
        id: 'visited',
        label: 'Lieux visités',
        startDate: constraints.visitedDateConstraints.min,
        endDate: constraints.visitedDateConstraints.max,
        color: '#4CAF50',
        icon: <Event />,
      });
    }

    // Segment "Lieux planifiés" si autorisé
    if (
      constraints.allowedStatuses.includes('planned') &&
      constraints.plannedDateConstraints
    ) {
      segments.push({
        id: 'planned',
        label: 'Lieux planifiés',
        startDate: constraints.plannedDateConstraints.min,
        endDate: constraints.plannedDateConstraints.max,
        color: '#2196F3',
        icon: <Schedule />,
      });
    }

    return segments;
  };

  const segments = getAvailableSegments();
  const selectedSegmentData = segments.find((s) => s.id === selectedSegment);

  return (
    <Box sx={{ mb: 3 }}>
      {/* Sélecteur de segment */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="segment-select-label">Type de lieu</InputLabel>
        <Select
          labelId="segment-select-label"
          value={selectedSegment}
          label="Type de lieu"
          onChange={(e) => onSegmentChange(e.target.value)}
          sx={{
            '& .MuiSelect-icon': {
              color: selectedSegmentData?.color || 'inherit',
            },
          }}
        >
          {segments.map((segment) => (
            <MenuItem key={segment.id} value={segment.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ color: segment.color }}>{segment.icon}</Box>
                <Typography>{segment.label}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Information sur le segment sélectionné */}
      {selectedSegmentData && (
        <Box sx={{ mb: 2 }}>
          <Alert
            severity="info"
            sx={{
              '& .MuiAlert-icon': { color: selectedSegmentData.color },
              bgcolor: `${selectedSegmentData.color}08`,
              border: `1px solid ${selectedSegmentData.color}40`,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Dates autorisées pour {selectedSegmentData.label.toLowerCase()} :
            </Typography>
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}
            >
              <Chip
                icon={<DateRange />}
                label={`${formatDate(new Date(selectedSegmentData.startDate))} → ${formatDate(new Date(selectedSegmentData.endDate))}`}
                size="small"
                sx={{
                  bgcolor: selectedSegmentData.color,
                  color: 'white',
                  fontWeight: 500,
                }}
              />
            </Box>
          </Alert>
        </Box>
      )}

      {/* Message d'information général */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'grey.50',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {constraints.infoMessage}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 0.5, display: 'block' }}
        >
          {constraints.helperText}
        </Typography>
      </Box>
    </Box>
  );
};

export default TravelSegmentSelector;
