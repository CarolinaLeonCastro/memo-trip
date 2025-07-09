import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import ThemeProvider from './providers/ThemeProvider';
import AppHeader from './components/Layout/AppHeader';
import Home from './pages/Home';
import AllPlaces from './pages/AllPlaces';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <AppHeader />
                  <Box sx={{ pt: 8 }}>
                    <Home />
                  </Box>
                </>
              }
            />
            <Route
              path="/places"
              element={
                <>
                  <AppHeader />
                  <Box sx={{ pt: 8 }}>
                    <AllPlaces />{' '}
                  </Box>
                </>
              }
            />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
