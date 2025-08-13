import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  RateReview as ReviewIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

import { adminService, type AdminStats } from '../services/admin.service';
import AdminStatsCards from '../components/admin/AdminStatsCards';
import UserManagement from '../components/admin/UserManagement';
import ContentModeration from '../components/admin/ContentModeration';
import SystemSettings from '../components/admin/SystemSettings';
import AdminAnalytics from '../components/admin/AdminAnalytics';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const statsData = await adminService.getStats();
      setStats(statsData);
      setError(null);
    } catch (err) {
      console.error('Error loading admin stats:', err);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* En-tête */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Administration MemoTrip
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Gestion de l'application et modération du contenu
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Cartes de statistiques rapides */}
      {stats && <AdminStatsCards stats={stats} />}

      {/* Onglets de navigation */}
      <Card sx={{ mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="Admin navigation tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              icon={<DashboardIcon />}
              label="Vue d'ensemble"
              id="admin-tab-0"
              aria-controls="admin-tabpanel-0"
            />
            <Tab
              icon={<PeopleIcon />}
              label="Utilisateurs"
              id="admin-tab-1"
              aria-controls="admin-tabpanel-1"
            />
            <Tab
              icon={<ReviewIcon />}
              label="Modération"
              id="admin-tab-2"
              aria-controls="admin-tabpanel-2"
            />
            <Tab
              icon={<TrendingUpIcon />}
              label="Analytiques"
              id="admin-tab-3"
              aria-controls="admin-tabpanel-3"
            />
            <Tab
              icon={<SettingsIcon />}
              label="Paramètres"
              id="admin-tab-4"
              aria-controls="admin-tabpanel-4"
            />
          </Tabs>
        </Box>

        {/* Contenu des onglets */}
        <TabPanel value={tabValue} index={0}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Vue d'ensemble de l'administration
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Actions rapides
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • {stats?.journals?.pending || 0} journaux en attente de
                      modération
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • {stats?.places?.pending || 0} lieux en attente de
                      modération
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • {stats?.users?.newThisMonth || 0} nouveaux utilisateurs
                      ce mois
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Activité récente
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • {stats?.journals?.newThisMonth || 0} nouveaux journaux
                      ce mois
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • {stats?.users?.active || 0} utilisateurs actifs
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • {stats?.journals?.public || 0} journaux publics
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <UserManagement />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <ContentModeration />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <AdminAnalytics />
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <SystemSettings />
        </TabPanel>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
