import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Pagination,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

import { adminService, type User } from '../../services/admin.service';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({ open: false, title: '', message: '', action: () => {} });

  // Filtres et pagination
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    role: '',
    page: 1,
    limit: 10,
  });
  const [totalPages, setTotalPages] = useState(0);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers({
        page: filters.page,
        limit: filters.limit,
        search: filters.search || undefined,
        status: filters.status || undefined,
        role: filters.role || undefined,
      });
      setUsers(response.users);
      setTotalPages(response.pagination.pages);
      setError(null);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleRoleChange = async (
    userId: string,
    newRole: 'user' | 'admin'
  ) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      loadUsers();
      handleMenuClose();
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Erreur lors de la mise à jour du rôle');
    }
  };

  const handleStatusChange = async (
    userId: string,
    newStatus: 'active' | 'blocked'
  ) => {
    try {
      await adminService.updateUserStatus(userId, newStatus);
      loadUsers();
      handleMenuClose();
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  const confirmAction = (
    title: string,
    message: string,
    action: () => void
  ) => {
    setConfirmDialog({
      open: true,
      title,
      message,
      action,
    });
  };

  const getStatusChip = (status: string) => {
    const configs = {
      active: {
        label: 'Actif',
        color: 'success' as const,
        icon: <CheckCircleIcon />,
      },
      blocked: {
        label: 'Bloqué',
        color: 'error' as const,
        icon: <BlockIcon />,
      },
    };
    const config = configs[status as keyof typeof configs];
    return config ? (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        icon={config.icon}
      />
    ) : null;
  };

  const getRoleChip = (role: string) => {
    return role === 'admin' ? (
      <Chip label="Admin" color="secondary" size="small" icon={<AdminIcon />} />
    ) : (
      <Chip
        label="Utilisateur"
        color="default"
        size="small"
        icon={<PersonIcon />}
      />
    );
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setFilters((prev) => ({ ...prev, page: value }));
  };

  if (loading && users.length === 0) {
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

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Gestion des utilisateurs
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filtres */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Rechercher"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Statut</InputLabel>
            <Select
              value={filters.status}
              label="Statut"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="active">Actif</MenuItem>
              <MenuItem value="blocked">Bloqué</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Rôle</InputLabel>
            <Select
              value={filters.role}
              label="Rôle"
              onChange={(e) => handleFilterChange('role', e.target.value)}
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="user">Utilisateur</MenuItem>
              <MenuItem value="admin">Administrateur</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Tableau des utilisateurs */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Utilisateur</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Inscription</TableCell>
              <TableCell>Dernière connexion</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      src={user.avatar?.url}
                      sx={{ width: 40, height: 40 }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="body2" fontWeight="medium">
                      {user.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleChip(user.role)}</TableCell>
                <TableCell>{getStatusChip(user.status)}</TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>
                  {user.last_login
                    ? new Date(user.last_login).toLocaleDateString('fr-FR')
                    : 'Jamais'}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, user)}
                    size="small"
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPages}
          page={filters.page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Menu d'actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedUser && (
          <>
            <MenuItem
              onClick={() =>
                confirmAction(
                  'Changer le rôle',
                  `Changer le rôle de ${selectedUser.name} en ${selectedUser.role === 'admin' ? 'utilisateur' : 'administrateur'} ?`,
                  () =>
                    handleRoleChange(
                      selectedUser._id,
                      selectedUser.role === 'admin' ? 'user' : 'admin'
                    )
                )
              }
            >
              {selectedUser.role === 'admin' ? 'Retirer admin' : 'Faire admin'}
            </MenuItem>

            {selectedUser.status !== 'active' && (
              <MenuItem
                onClick={() =>
                  confirmAction(
                    'Activer utilisateur',
                    `Activer l'utilisateur ${selectedUser.name} ?`,
                    () => handleStatusChange(selectedUser._id, 'active')
                  )
                }
              >
                Activer
              </MenuItem>
            )}

            {selectedUser.status !== 'blocked' && (
              <MenuItem
                onClick={() =>
                  confirmAction(
                    'Bloquer utilisateur',
                    `Bloquer l'utilisateur ${selectedUser.name} ?`,
                    () => handleStatusChange(selectedUser._id, 'blocked')
                  )
                }
              >
                Bloquer
              </MenuItem>
            )}
          </>
        )}
      </Menu>

      {/* Dialog de confirmation */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setConfirmDialog((prev) => ({ ...prev, open: false }))
            }
          >
            Annuler
          </Button>
          <Button
            onClick={() => {
              confirmDialog.action();
              setConfirmDialog((prev) => ({ ...prev, open: false }));
            }}
            variant="contained"
            color="primary"
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
