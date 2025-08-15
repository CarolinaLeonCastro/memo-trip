import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Tooltip,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Book as BookIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Logout as LogoutIcon,
  ExpandMore as ExpandMoreIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const { isDarkMode, toggleDarkMode } = useThemeMode();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/login');
  };

  const navigationItems = [
    {
      label: 'Mes Voyages',
      path: '/journals',
      icon: <BookIcon />,
    },
    {
      label: 'Profil',
      path: '/profile',
      icon: <PersonIcon />,
    },
    ...(user?.role === 'admin'
      ? [
          {
            label: 'Administration',
            path: '/admin',
            icon: <AdminIcon />,
          },
        ]
      : []),
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navigationItems.map((item) => (
          <ListItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              color: location.pathname.includes(item.path)
                ? 'primary.main'
                : 'text.primary',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: location.pathname.includes(item.path) ? 600 : 400,
              }}
            />
          </ListItem>
        ))}
        {/* Dark mode toggle in mobile drawer */}
        <ListItem>
          <ListItemIcon>
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </ListItemIcon>
          <ListItemText primary="Mode sombre" />
          <IconButton
            onClick={toggleDarkMode}
            sx={{
              ml: 'auto',
              color: 'text.primary',
            }}
          >
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </ListItem>

        <Divider sx={{ my: 1 }} />

        {/* User info in mobile drawer */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Connecté en tant que
          </Typography>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {user?.email}
          </Typography>
        </Box>

        <ListItem
          onClick={() => {
            handleLogout();
            handleDrawerToggle();
          }}
          sx={{
            color: 'error.main',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText primary="Se déconnecter" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar
          sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3, md: 4 } }}
        >
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 1 },
              }}
            >
              <img
                src=" ./src/assets/icon.png"
                alt="Logo"
                style={{ width: 40, height: 40 }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Chau Philomene One", cursive',
                }}
              >
                <Box component="span" sx={{ color: 'error.main' }}>
                  MEMO
                </Box>
                <Box component="span" sx={{ color: 'primary.main' }}>
                  TRIP
                </Box>
              </Typography>
            </Box>
          </Link>

          {isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Dark mode toggle for mobile */}
              <Tooltip title={isDarkMode ? 'Mode clair' : 'Mode sombre'}>
                <IconButton
                  onClick={toggleDarkMode}
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: location.pathname.includes(item.path)
                      ? 'primary.main'
                      : 'text.primary',
                    fontWeight: location.pathname.includes(item.path)
                      ? 600
                      : 500,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {/* Dark mode toggle for desktop */}
              <Tooltip title={isDarkMode ? 'Mode clair' : 'Mode sombre'}>
                <IconButton
                  onClick={toggleDarkMode}
                  sx={{
                    ml: 1,
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>

              {/* Menu utilisateur */}
              <Button
                onClick={handleUserMenuOpen}
                startIcon={
                  <Avatar
                    sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                  >
                    {user?.email?.charAt(0).toUpperCase()}
                  </Avatar>
                }
                endIcon={<ExpandMoreIcon />}
                sx={{
                  ml: 1,
                  color: 'text.primary',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                  {user?.email}
                </Box>
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Menu utilisateur */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        sx={{
          mt: 1,
          '& .MuiPaper-root': {
            minWidth: 200,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary">
            Connecté en tant que
          </Typography>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {user?.email}
          </Typography>
        </Box>

        <MenuItem
          component={Link}
          to="/profile"
          onClick={handleUserMenuClose}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Mon profil" />
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText primary="Se déconnecter" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;
