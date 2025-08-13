import React from 'react';
import { Navigate } from 'react-router-dom';
import { Alert, Box, Container } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  // Si l'utilisateur n'est pas authentifié, rediriger vers login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur n'est pas admin, afficher un message d'erreur
  if (user?.role !== 'admin') {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">
          <strong>Accès refusé</strong>
          <br />
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          Seuls les administrateurs peuvent accéder au panel d'administration.
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
