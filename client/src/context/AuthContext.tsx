import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem('memotrip-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Erreur lors du parsing de l'utilisateur sauvé:", error);
        localStorage.removeItem('memotrip-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Remplacer par un vrai appel API
      // Simulation d'appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Validation simple pour la démo
      if (email && password.length >= 6) {
        const userData: User = {
          id: Date.now().toString(),
          email: email,
        };

        setUser(userData);
        localStorage.setItem('memotrip-user', JSON.stringify(userData));
        return true;
      } else {
        setError('Email ou mot de passe invalide');
        return false;
      }
    } catch {
      setError('Erreur lors de la connexion');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation
      if (!email || !email.includes('@')) {
        setError('Email invalide');
        return false;
      }

      if (password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        return false;
      }

      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return false;
      }

      // TODO: Remplacer par un vrai appel API
      // Simulation d'appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userData: User = {
        id: Date.now().toString(),
        email: email,
      };

      setUser(userData);
      localStorage.setItem('memotrip-user', JSON.stringify(userData));
      return true;
    } catch {
      setError("Erreur lors de l'inscription");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('memotrip-user');
    setError(null);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
