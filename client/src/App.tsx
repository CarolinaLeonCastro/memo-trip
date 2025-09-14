import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
// Providers
import ThemeProvider from './providers/ThemeProvider';
import { JournalProvider } from './context/JournalContext';
import { AuthProvider } from './context/AuthContext';
// Components
import { Box, CircularProgress } from '@mui/material';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
// Layouts
import Layout from './components/Layouts/Layout';
import PublicLayout from './components/Layouts/PublicLayout';

// Lazy-loaded Pages for code splitting
const Journals = lazy(() => import('./pages/Journals'));
const AllPlaces = lazy(() => import('./pages/AllPlaces'));
const JournalDetail = lazy(() => import('./pages/JournalDetail'));
const EditJournal = lazy(() => import('./pages/EditJournal'));
const EditPlace = lazy(() => import('./pages/EditPlace'));
const PlaceDetail = lazy(() => import('./pages/PlaceDetail'));
const NewJournal = lazy(() => import('./pages/NewJournal'));
const AddPlace = lazy(() => import('./pages/AddPlace'));
const Profile = lazy(() => import('./pages/Profile'));
const MapView = lazy(() => import('./pages/MapView'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminSetup = lazy(() => import('./pages/AdminSetup'));
const PublicJournals = lazy(() => import('./pages/PublicJournals'));
const PublicJournalDetail = lazy(() => import('./pages/PublicJournalDetail'));
const PublicPlaceDetail = lazy(() => import('./pages/PublicPlaceDetail'));
const Discover = lazy(() => import('./pages/Discover'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));
// Démonstration des composants Travel
//import AuthDebug from './components/debug/AuthDebug';

function App() {
  const LoadingFallback = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress />
    </Box>
  );

  return (
    <ThemeProvider>
      <AuthProvider>
        <JournalProvider>
          <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Router>
              {/* <AuthDebug /> */}
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Routes publiques avec Layout */}
                  <Route path="/public" element={<PublicLayout />}>
                    <Route path="journals" element={<PublicJournals />} />
                    <Route
                      path="journals/:id"
                      element={<PublicJournalDetail />}
                    />
                    <Route path="place/:id" element={<PublicPlaceDetail />} />
                  </Route>

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

                  {/* Route catch-all pour les pages non trouvées */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Router>
          </Box>
        </JournalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;
