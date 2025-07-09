import React from 'react';
import { AppBar, Toolbar, Avatar, Box, IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import logo from '../../assets/logo.svg';

export const AppHeader: React.FC = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'background.paper',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
        zIndex: 1200,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Logo et nom de l'app */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={logo}
              alt="Logo"
              style={{ width: 32, height: 32, marginRight: 16 }}
            />
            <Box
              sx={{
                width: 80,
                height: 8,
                borderRadius: 4,
                backgroundColor: 'text.disabled',
              }}
            />
          </Box>
        </Box>

        {/* Avatar utilisateur */}
        <IconButton>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            <AccountCircle />
          </Avatar>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
