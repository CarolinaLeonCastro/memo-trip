import React from 'react';
import { Box, Paper, Typography, Button, Alert } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { authCookieService } from '../../services/auth-cookie.service';

const AuthDebug: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  const diagnoseAuth = async () => {
    console.log("🔍 Diagnostic d'authentification MemoTrip");
    console.log('═'.repeat(50));

    console.log("📊 État du contexte d'authentification :");
    console.log('  - isAuthenticated:', isAuthenticated);
    console.log('  - user:', user);

    console.log('\n🔑 Informations utilisateur détaillées :');
    if (user) {
      console.log('  - ID:', user.id);
      console.log('  - Email:', user.email);
      console.log('  - Nom:', user.name);
      console.log('  - Rôle:', user.role || 'NON DÉFINI');
      console.log('  - Statut:', user.status || 'NON DÉFINI');
      console.log('  - Créé le:', user.created_at);
      console.log('  - Dernière connexion:', user.last_login || 'jamais');

      if (user.role === 'admin') {
        console.log('  🟢 UTILISATEUR ADMIN - Accès /admin autorisé');
      } else if (user.role === 'user') {
        console.log('  🔵 UTILISATEUR STANDARD - Accès /admin refusé');
      } else {
        console.log('  ❌ RÔLE NON DÉFINI - Problème potentiel');
      }
    } else {
      console.log('  ❌ Aucun utilisateur connecté');
    }

    console.log('\n🍪 Diagnostic des cookies HTTPOnly :');
    await authCookieService.diagnose();

    console.log('\n🛠️ Actions recommandées :');
    if (!isAuthenticated) {
      console.log("  1. Connectez-vous d'abord");
    } else if (!user?.role) {
      console.log('  1. Problème : Rôle utilisateur manquant');
      console.log('  2. Vérifiez la base de données');
      console.log('  3. Reconnectez-vous');
    } else if (user.role !== 'admin') {
      console.log("  1. Vous n'êtes pas admin");
      console.log('  2. Contactez un administrateur pour modifier votre rôle');
    } else {
      console.log('  ✅ Tout semble correct !');
    }
  };

  const clearAuth = async () => {
    try {
      await authCookieService.logout();
      authCookieService.invalidateCache();
      console.log('🍪 Déconnexion et nettoyage du cache terminés');
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
      authCookieService.invalidateCache();
      window.location.reload();
    }
  };

  // Affichage uniquement en mode développement
  if (process.env.NODE_ENV === 'development') {
    return null;
  }

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
      <Paper sx={{ p: 2, backgroundColor: 'rgba(0,0,0,0.8)', color: 'white' }}>
        <Typography variant="h6" gutterBottom>
          🔧 Debug Auth
        </Typography>

        <Typography variant="body2" gutterBottom>
          Statut: {isAuthenticated ? '✅ Connecté' : '❌ Déconnecté'}
        </Typography>

        {user && (
          <>
            <Typography variant="body2" gutterBottom>
              Utilisateur: {user.name}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Rôle: {user.role || '❌ Non défini'}
            </Typography>

            {user.role !== 'admin' && isAuthenticated && (
              <Alert severity="warning" sx={{ mt: 1, mb: 1 }}>
                Accès /admin refusé - Pas admin
              </Alert>
            )}

            {!user.role && isAuthenticated && (
              <Alert severity="error" sx={{ mt: 1, mb: 1 }}>
                Rôle manquant - Problème DB
              </Alert>
            )}
          </>
        )}

        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexDirection: 'column' }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => diagnoseAuth()}
            sx={{ color: 'white', borderColor: 'white' }}
          >
            🍪 Diagnostic Cookie
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => clearAuth()}
            sx={{ color: 'white', borderColor: 'white' }}
          >
            🍪 Logout & Clear
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthDebug;
