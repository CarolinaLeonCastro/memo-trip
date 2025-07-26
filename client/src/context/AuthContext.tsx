import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { User } from '../types';
import {
  authService,
  type LoginRequest,
  type RegisterRequest,
} from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<boolean>;
  logout: () => void;
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

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Vérifier s'il y a des données dans sessionStorage
        const storedUser = authService.getUser();
        const token = authService.getToken();

        if (storedUser && token) {
          // Vérifier la validité du token auprès du serveur
          try {
            const response = await authService.getCurrentUser();
            setUser(response.user);
          } catch {
            // Token invalide, nettoyer les données
            authService.clearAuth();
            setUser(null);
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors de l'initialisation de l'authentification:",
          error
        );
        authService.clearAuth();
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

      // Sauvegarder le token et les données utilisateur
      authService.setToken(response.token);
      authService.setUser(response.user);
      setUser(response.user);

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

      // Sauvegarder le token et les données utilisateur
      authService.setToken(response.token);
      authService.setUser(response.user);
      setUser(response.user);

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
    try {
      // Notifier le serveur de la déconnexion
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion côté serveur:', error);
    } finally {
      // Nettoyer les données locales dans tous les cas
      authService.clearAuth();
      setUser(null);
      setError(null);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
