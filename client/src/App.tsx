import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import ThemeProvider from './providers/ThemeProvider';
import { Box } from '@mui/material';
import Layout from './components/Layouts/Layout';
import Home from './pages/Home';

import Journals from './pages/Journals';
import JournalDetail from './pages/JournalDetail';
import EditJournal from './pages/EditJournal';
import PlaceDetail from './pages/PlaceDetail';
import { JournalProvider } from './context/JournalContext';
import NewJournal from './pages/NewJournal';

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
              <Route path="journals/new" element={<NewJournal />} />
              <Route path="journals/:id" element={<JournalDetail />} />
              <Route path="journals/edit/:id" element={<EditJournal />} />
              <Route path="place/:id" element={<PlaceDetail />} />
              <Route path="profile" element={<div>Profil</div>} />
            </Route>
          </Routes>
        </Router>
      </Box>
    </JournalProvider>
  );
}

export default App;
