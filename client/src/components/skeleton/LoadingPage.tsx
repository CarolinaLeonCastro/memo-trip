import React from 'react';
import { Container } from '@mui/material';
import LoadingSpinner from './LoadingSpinner';

interface LoadingPageProps {
  message?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({
  message = 'Chargement des données...',
}) => {
  return (
    <Container maxWidth="md">
      <LoadingSpinner message={message} size="large" />
    </Container>
  );
};

export default LoadingPage;
