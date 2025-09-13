import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './Navbar';

const PublicLayout: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Box sx={{ pt: 0 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default PublicLayout;
