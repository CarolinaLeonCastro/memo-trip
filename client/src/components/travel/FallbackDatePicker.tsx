import React from 'react';
import {
  TextField,
  Box,
  Typography,
  Alert,
  FormHelperText,
} from '@mui/material';
import { CheckCircle, Warning, Error } from '@mui/icons-material';

interface FallbackDatePickerProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate: string; // Format YYYY-MM-DD
  maxDate: string; // Format YYYY-MM-DD
  error?: string;
  required?: boolean;
  helperText?: string;
}

export const FallbackDatePicker: React.FC<FallbackDatePickerProps> = ({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  error,
  required = false,
  helperText,
}) => {
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = event.target.value;
    if (dateString) {
      onChange(new Date(dateString));
    } else {
      onChange(null);
    }
  };

  const dateValue = value ? value.toISOString().split('T')[0] : '';

  // Vérifier si la date est dans la plage autorisée
  const isDateValid =
    !value || (value >= new Date(minDate) && value <= new Date(maxDate));

  return (
    <Box sx={{ mb: 2 }}>
      {/* Information sur la période autorisée */}
      <Alert
        severity="info"
        sx={{ mb: 2, fontSize: '0.875rem' }}
        icon={<CheckCircle />}
      >
        <Typography variant="body2">
          Dates autorisées pour ce voyage :
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
          {new Date(minDate).toLocaleDateString('fr-FR')} →{' '}
          {new Date(maxDate).toLocaleDateString('fr-FR')}
        </Typography>
      </Alert>

      {/* Input date HTML5 simple */}
      <TextField
        fullWidth
        label={label}
        type="date"
        value={dateValue}
        onChange={handleDateChange}
        InputLabelProps={{ shrink: true }}
        inputProps={{
          min: minDate,
          max: maxDate,
        }}
        required={required ? true : undefined}
        error={!!error || !isDateValid}
        helperText={
          error ||
          (value && !isDateValid
            ? 'Date non autorisée pour ce voyage'
            : helperText)
        }
        InputProps={{
          endAdornment:
            value && isDateValid ? (
              <CheckCircle sx={{ color: 'success.main', ml: 1 }} />
            ) : value && !isDateValid ? (
              <Error sx={{ color: 'error.main', ml: 1 }} />
            ) : null,
        }}
      />

      {/* Message d'erreur personnalisé */}
      {error && (
        <FormHelperText
          error
          sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <Warning fontSize="small" />
          {error}
        </FormHelperText>
      )}

      {/* Aide contextuelle */}
      {!error && helperText && (
        <FormHelperText sx={{ mt: 1, color: 'text.secondary' }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default FallbackDatePicker;
