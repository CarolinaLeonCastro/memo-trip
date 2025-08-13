import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Book as BookIcon,
  Place as PlaceIcon,
  Public as PublicIcon,
} from '@mui/icons-material';

import { adminService, type AdminStats } from '../../services/admin.service';

interface AnalyticsCardProps {
  title: string;
  value: number;
  trend: number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  trend,
  icon,
  color,
}) => {
  const isPositive = trend >= 0;

  return (
    <Card>
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value.toLocaleString()}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {title}
            </Typography>
          </Box>
          <Box sx={{ color: `${color}.main` }}>{icon}</Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          {isPositive ? (
            <TrendingUpIcon color="success" fontSize="small" />
          ) : (
            <TrendingDownIcon color="error" fontSize="small" />
          )}
          <Typography
            variant="body2"
            color={isPositive ? 'success.main' : 'error.main'}
          >
            {isPositive ? '+' : ''}
            {trend}% ce mois
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const AdminAnalytics: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const analyticsData = await adminService.getStats();
      setStats(analyticsData);
      setError(null);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Erreur lors du chargement des analytiques');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!stats) {
    return <Alert severity="info">Aucune donnée disponible</Alert>;
  }

  // Calcul des tendances (simulation pour la démo)
  const userGrowth = Math.round(
    (stats.users.newThisMonth /
      Math.max(stats.users.total - stats.users.newThisMonth, 1)) *
      100
  );
  const journalGrowth = Math.round(
    (stats.journals.newThisMonth /
      Math.max(stats.journals.total - stats.journals.newThisMonth, 1)) *
      100
  );
  const engagementRate = Math.round(
    (stats.journals.public / Math.max(stats.journals.total, 1)) * 100
  );
  const activeUserRate = Math.round(
    (stats.users.active / Math.max(stats.users.total, 1)) * 100
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Analytiques et métriques
      </Typography>

      {/* Cartes de métriques principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsCard
            title="Croissance utilisateurs"
            value={userGrowth}
            trend={userGrowth}
            icon={<PeopleIcon />}
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsCard
            title="Nouveaux journaux"
            value={stats.journals.newThisMonth}
            trend={journalGrowth}
            icon={<BookIcon />}
            color="info"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsCard
            title="Taux d'engagement"
            value={engagementRate}
            trend={5} // Simulation
            icon={<PublicIcon />}
            color="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsCard
            title="Utilisateurs actifs"
            value={activeUserRate}
            trend={2} // Simulation
            icon={<TrendingUpIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Répartition des utilisateurs */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Répartition des utilisateurs
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="body2">Utilisateurs actifs</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {stats.users.active} ({activeUserRate}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={activeUserRate}
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="body2">Utilisateurs bloqués</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {stats.users.blocked} (
                    {Math.round(
                      (stats.users.blocked / stats.users.total) * 100
                    )}
                    %)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(stats.users.blocked / stats.users.total) * 100}
                  color="error"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="body2">En attente</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {stats.users.pending} (
                    {Math.round(
                      (stats.users.pending / stats.users.total) * 100
                    )}
                    %)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(stats.users.pending / stats.users.total) * 100}
                  color="warning"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistiques de contenu */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Statistiques de contenu
              </Typography>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="right">Statut</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <BookIcon fontSize="small" />
                          Journaux
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {stats.journals.total}
                      </TableCell>
                      <TableCell align="right">
                        <Box display="flex" flexDirection="column" gap={0.5}>
                          <Chip
                            label={`${stats.journals.published} publiés`}
                            size="small"
                            color="success"
                          />
                          <Chip
                            label={`${stats.journals.pending} en attente`}
                            size="small"
                            color="warning"
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <PlaceIcon fontSize="small" />
                          Lieux
                        </Box>
                      </TableCell>
                      <TableCell align="right">{stats.places.total}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${stats.places.pending} en attente`}
                          size="small"
                          color="warning"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <PublicIcon fontSize="small" />
                          Journaux publics
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {stats.journals.public}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${Math.round((stats.journals.public / stats.journals.total) * 100)}% du total`}
                          size="small"
                          color="info"
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Métriques de performance */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Métriques de performance (ce mois)
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box textAlign="center">
                    <Typography variant="h3" color="primary" fontWeight="bold">
                      {stats.users.newThisMonth}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Nouveaux utilisateurs
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box textAlign="center">
                    <Typography
                      variant="h3"
                      color="info.main"
                      fontWeight="bold"
                    >
                      {stats.journals.newThisMonth}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Nouveaux journaux
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box textAlign="center">
                    <Typography
                      variant="h3"
                      color="success.main"
                      fontWeight="bold"
                    >
                      {engagementRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Taux de publication publique
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box textAlign="center">
                    <Typography
                      variant="h3"
                      color="warning.main"
                      fontWeight="bold"
                    >
                      {stats.journals.pending + stats.places.pending}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Éléments à modérer
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminAnalytics;
