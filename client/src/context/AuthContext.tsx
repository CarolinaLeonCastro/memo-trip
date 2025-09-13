import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { User } from '../types';
import {
  authCookieService as authService, // Alias pour compatibilité
  type LoginRequest,
  type RegisterRequest,
} from '../services/auth-cookie.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  // Vérifier si l'utilisateur est connecté au chargement (optimisé avec JWT)
  useEffect(() => {
    // Exposer authService pour le débogage en développement
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      // Éviter les types `any` - interface pour window dev
      interface WindowDev extends Window {
        authService: typeof authService;
        authDiagnose: () => Promise<void>;
      }

      const windowDev = window as unknown as WindowDev;
      windowDev.authService = authService;
      windowDev.authDiagnose = () => authService.diagnose();
    }

    const initAuth = async () => {
      try {
        // Vérifier si l'utilisateur est connecté via cookie HTTPOnly
        const userData = await authService.getUserSafely();

        if (userData) {
          console.log(
            '🍪 Utilisateur connecté via cookie HTTPOnly:',
            userData.name
          );
          setUser(userData);
        } else {
          console.log("🍪 Aucun cookie d'authentification trouvé");
          setUser(null);
        }
      } catch (error) {
        console.error(
          "❌ Erreur lors de l'initialisation de l'authentification:",
          error
        );
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const credentials: LoginRequest = { email, password };
      const response = await authService.login(credentials);

      // Le token est maintenant stocké dans un cookie HTTPOnly sécurisé
      // Plus besoin de setToken ! 🎉
      setUser(response.user);

      // Invalider le cache pour forcer la synchronisation
      authService.invalidateCache();

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erreur lors de la connexion';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const userData: RegisterRequest = {
        name,
        email,
        password,
        confirmPassword,
      };
      const response = await authService.register(userData);

      // Le token est maintenant stocké dans un cookie HTTPOnly sécurisé
      // Plus besoin de setToken ! 🎉
      setUser(response.user);

      // Invalider le cache pour forcer la synchronisation
      authService.invalidateCache();

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de l'inscription";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      // Supprimer le cookie côté serveur
      await authService.logout();
    } catch (error) {
      console.error('⚠️ Erreur lors de la déconnexion côté serveur:', error);
    } finally {
      // Nettoyer l'état local même si le serveur échoue
      authService.invalidateCache();
      setUser(null);
      setError(null);
      setIsLoading(false);

      console.log('🍪 Déconnexion réussie - Cookie supprimé');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    isLoading,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
