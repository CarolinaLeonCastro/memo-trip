import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createCustomTheme } from '../theme';
import { ThemeModeProvider, useThemeMode } from '../context/ThemeContext';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProviderInner: React.FC<ThemeProviderProps> = ({ children }) => {
  const { isDarkMode } = useThemeMode();
  const theme = createCustomTheme(isDarkMode ? 'dark' : 'light');

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeModeProvider>
      <ThemeProviderInner>{children}</ThemeProviderInner>
    </ThemeModeProvider>
  );
};

export default ThemeProvider;
