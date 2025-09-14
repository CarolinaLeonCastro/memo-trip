import { authCookieService } from '../services/auth-cookie.service';

// Fonctions de debug exposées globalement (version cookies HTTPOnly)
declare global {
  interface Window {
    debugMemoTrip: {
      diagnoseAuth: () => Promise<void>;
      clearCache: () => void;
      checkAuth: () => Promise<void>;
    };
  }
}

// Initialiser les outils de debug pour cookies HTTPOnly
export const initDebugTools = () => {
  window.debugMemoTrip = {
    // Diagnostiquer l'authentification avec cookies
    diagnoseAuth: async () => {
      await authCookieService.diagnose();
    },

    // Nettoyer le cache (cookies gérés côté serveur)
    clearCache: () => {
      authCookieService.invalidateCache();
      //console.log('🍪 Cache invalidé. Les cookies sont gérés côté serveur.');
      //console.log('🔄 Actualisez la page pour voir les changements');
    },

    // Vérifier l'état de l'authentification
    checkAuth: async () => {
      //console.log("🍪 État de l'authentification (cookies HTTPOnly):");

      try {
        const user = await authCookieService.getUserSafely();
        //console.log('  - Connecté:', !!user);
        if (user) {
          //console.log('  - Nom:', user.name);
          //console.log('  - Email:', user.email);
          //console.log('  - Rôle:', user.role);
          //console.log('  - Statut:', user.status);
        }
      } catch (error) {
        console.log('  - Erreur:', (error as Error).message);
      }
    },
  };

  //console.log('🍪 Outils de debug MemoTrip (Cookies HTTPOnly):');
  //console.log('  - debugMemoTrip.diagnoseAuth() - Diagnostic complet');
  //console.log('  - debugMemoTrip.clearCache() - Invalider cache local');
  //console.log("  - debugMemoTrip.checkAuth() - Vérifier l'authentification");
  //console.log('  - authDiagnose() - Raccourci pour diagnostic (déjà exposé)');
};
