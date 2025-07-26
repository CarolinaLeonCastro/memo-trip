import { API_CONFIG } from '../config/api.config';

// Configuration de base pour les appels API
const API_BASE_URL = API_CONFIG.BASE_URL;

// Interface pour les réponses d'authentification
export interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: {
      url?: string;
      filename?: string;
      uploadedAt?: string;
    };
    created_at: string;
  };
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

// Classe pour gérer les appels API d'authentification
class AuthService {
  // Connexion
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la connexion');
    }

    return response.json();
  }

  // Inscription
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de l'inscription");
    }

    return response.json();
  }

  // Déconnexion (côté serveur)
  async logout(): Promise<void> {
    const token = this.getToken();
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Erreur lors de la déconnexion côté serveur:', error);
      }
    }
  }

  // Vérifier l'utilisateur actuel
  async getCurrentUser(): Promise<{ user: AuthResponse['user'] }> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Aucun token trouvé');
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Token invalide ou expiré');
    }

    return response.json();
  }

  // Gestion du token dans sessionStorage
  getToken(): string | null {
    return sessionStorage.getItem('memotrip-token');
  }

  setToken(token: string): void {
    sessionStorage.setItem('memotrip-token', token);
  }

  removeToken(): void {
    sessionStorage.removeItem('memotrip-token');
  }

  // Gestion des données utilisateur dans sessionStorage
  getUser(): AuthResponse['user'] | null {
    const userData = sessionStorage.getItem('memotrip-user');
    return userData ? JSON.parse(userData) : null;
  }

  setUser(user: AuthResponse['user']): void {
    sessionStorage.setItem('memotrip-user', JSON.stringify(user));
  }

  removeUser(): void {
    sessionStorage.removeItem('memotrip-user');
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  }

  // Nettoyer toutes les données d'authentification
  clearAuth(): void {
    this.removeToken();
    this.removeUser();
  }
}

// Instance singleton du service d'authentification
export const authService = new AuthService();

// Intercepteur pour ajouter automatiquement le token aux requêtes
export const createAuthenticatedRequest = (
  options: RequestInit = {}
): RequestInit => {
  const token = authService.getToken();

  return {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };
};
