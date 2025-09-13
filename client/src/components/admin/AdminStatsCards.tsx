import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  Book as BookIcon,
  Place as PlaceIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import { type AdminStats } from '../../services/admin.service';

interface AdminStatsCardsProps {
  stats: AdminStats;
}

interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
}) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value.toLocaleString()}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {trend !== undefined && (
              <Chip
                label={`+${trend} ce mois`}
                size="small"
                color={trend > 0 ? 'success' : 'default'}
                sx={{ mt: 1 }}
              />
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}.main`, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

const AdminStatsCards: React.FC<AdminStatsCardsProps> = ({ stats }) => {
  return (
    <Grid container spacing={3}>
      {/* Utilisateurs totaux */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Utilisateurs"
          value={stats.users.total}
          subtitle={`${stats.users.active} actifs, ${stats.users.blocked} bloqués`}
          icon={<PeopleIcon />}
          color="primary"
          trend={stats.users.newThisMonth}
        />
      </Grid>

      {/* Journaux */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Journaux"
          value={stats.journals.total}
          subtitle={`${stats.journals.published} publiés, ${stats.journals.public} publics`}
          icon={<BookIcon />}
          color="info"
          trend={stats.journals.newThisMonth}
        />
      </Grid>

      {/* Lieux */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Lieux"
          value={stats.places.total}
          icon={<PlaceIcon />}
          color="success"
        />
      </Grid>

      {/* Cartes supplémentaires pour plus de détails */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Statut des utilisateurs
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              <Chip
                label={`${stats.users.active} Actifs`}
                color="success"
                variant="outlined"
              />
              <Chip
                label={`${stats.users.blocked} Bloqués`}
                color="error"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Contenu publié
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              <Chip
                icon={<PublicIcon />}
                label={`${stats.journals.public} Journaux publics`}
                color="info"
                variant="outlined"
              />
              <Chip
                icon={<BookIcon />}
                label={`${stats.journals.published} Journaux publiés`}
                color="primary"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AdminStatsCards;
