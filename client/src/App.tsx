import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import ThemeProvider from './providers/ThemeProvider';
import { Box } from '@mui/material';
import Layout from './components/Layouts/Layout';
import Home from './pages/Home';
import { JournalProvider } from './context/JournalContext';
import Journals from './pages/Journals';

function App() {
  return (
    <JournalProvider>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Router>
          <Routes>
            {/* me routes vont içi */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="journals" element={<Journals />} />
              <Route path="profile" element={<div>Profil</div>} />
            </Route>
          </Routes>
        </Router>
      </Box>
    </JournalProvider>
  );
}

export default App;
