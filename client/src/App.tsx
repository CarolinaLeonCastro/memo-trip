import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Providers
import ThemeProvider from './providers/ThemeProvider';
import { JournalProvider } from './context/JournalContext';
import { AuthProvider } from './context/AuthContext';
// Components
import { Box } from '@mui/material';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
// Layouts
import Layout from './components/Layouts/Layout';
//Pages
import Journals from './pages/Journals';
import AllPlaces from './pages/AllPlaces';
import JournalDetail from './pages/JournalDetail';
import EditJournal from './pages/EditJournal';
import EditPlace from './pages/EditPlace';
import PlaceDetail from './pages/PlaceDetail';
import NewJournal from './pages/NewJournal';
import AddPlace from './pages/AddPlace';
import Profile from './pages/Profile';
import MapView from './pages/MapView';
import AdminDashboard from './pages/AdminDashboard';
import AdminSetup from './pages/AdminSetup';
import PublicJournals from './pages/PublicJournals';
import PublicJournalDetail from './pages/PublicJournalDetail';
import Discover from './pages/Discover';
import Login from './pages/Login';
import Register from './pages/Register';
//import AuthDebug from './components/debug/AuthDebug';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <JournalProvider>
          <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Router>
              {/* <AuthDebug /> */}
              <Routes>
                {/* Routes publiques */}
                <Route path="/public/journals" element={<PublicJournals />} />
                <Route
                  path="/public/journals/:id"
                  element={<PublicJournalDetail />}
                />
                <Route path="/setup" element={<AdminSetup />} />

                {/* Routes d'authentification */}
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
                  <Route index element={<MapView />} />
                  <Route path="discover" element={<Discover />} />
                  <Route path="journals" element={<Journals />} />
                  <Route path="places" element={<AllPlaces />} />
                  <Route path="journals/new" element={<NewJournal />} />
                  <Route path="journals/:id" element={<JournalDetail />} />
                  <Route path="journals/:id/edit" element={<EditJournal />} />
                  <Route path="place/new" element={<AddPlace />} />
                  <Route path="place/:id" element={<PlaceDetail />} />
                  <Route path="place/:id/edit" element={<EditPlace />} />
                  <Route path="profile" element={<Profile />} />
                  <Route
                    path="admin"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
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
