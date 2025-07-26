import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Providers
import ThemeProvider from './providers/ThemeProvider';
import { JournalProvider } from './context/JournalContext';
import { AuthProvider } from './context/AuthContext';
// Components
import { Box } from '@mui/material';
import ProtectedRoute from './components/ProtectedRoute';
// Layouts
import Layout from './components/Layouts/Layout';
//Pages
import Home from './pages/Home';
import Journals from './pages/Journals';
import JournalDetail from './pages/JournalDetail';
import EditJournal from './pages/EditJournal';
import PlaceDetail from './pages/PlaceDetail';
import NewJournal from './pages/NewJournal';
import Profile from './pages/Profile';
import MapView from './pages/MapView';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <JournalProvider>
          <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Router>
              <Routes>
                {/* Routes d'authentification (publiques) */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Routes protégées */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Home />} />
                  <Route path="journals" element={<Journals />} />
                  <Route path="journals/map" element={<MapView />} />
                  <Route path="journals/new" element={<NewJournal />} />
                  <Route path="journals/:id" element={<JournalDetail />} />
                  <Route path="journals/edit/:id" element={<EditJournal />} />
                  <Route path="place/:id" element={<PlaceDetail />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
              </Routes>
            </Router>
          </Box>
        </JournalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;
