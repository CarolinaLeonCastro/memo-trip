import React from 'react';
import { AppBar, Toolbar, Avatar, Box, IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import logo from '../../assets/logo.png';
import brandName from '../../assets/memotrip.png';

export const AppHeader: React.FC = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'background.paper',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
        zIndex: 1200,
        height: '60px',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Logo et nom de l'app */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Logo" width={60} height={60} />
          </Box>
          {/* Nom de l'app, je veux que ça soit à coté du logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <img src={brandName} alt="Name" width={150} height={150} />
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
