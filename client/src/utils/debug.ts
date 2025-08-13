import { authService } from '../services/auth.service';

// Fonctions de debug exposées globalement
declare global {
  interface Window {
    debugMemoTrip: {
      diagnoseStorage: () => void;
      clearAllStorage: () => void;
      checkAuth: () => void;
    };
  }
}

// Initialiser les outils de debug
export const initDebugTools = () => {
  window.debugMemoTrip = {
    // Diagnostiquer l'état du stockage
    diagnoseStorage: () => {
      authService.diagnoseStorage();
    },

    // Nettoyer complètement le stockage
    clearAllStorage: () => {
      authService.clearAllStorage();
      console.log('🔄 Actualisez la page pour voir les changements');
    },

    // Vérifier l'état de l'authentification
    checkAuth: () => {
      console.log("🔐 État de l'authentification:");
      console.log('  - Connecté:', authService.isAuthenticated());
      console.log('  - Token:', authService.getToken());
      console.log('  - Utilisateur:', authService.getUser());
    },
  };

  console.log('🛠️ Outils de debug MemoTrip disponibles:');
  console.log("  - debugMemoTrip.diagnoseStorage() - Voir l'état du stockage");
  console.log(
    '  - debugMemoTrip.clearAllStorage() - Nettoyer tout le stockage'
  );
  console.log("  - debugMemoTrip.checkAuth() - Vérifier l'authentification");
};
