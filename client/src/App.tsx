import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ThemeProvider from './providers/ThemeProvider';
import { Box } from '@mui/material';

function App() {
  return (
    <ThemeProvider>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Router>
          <Routes>
            {/* me routes vont içi */}
            <Route path="/" element={<div>Home Page</div>} />
          </Routes>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;
