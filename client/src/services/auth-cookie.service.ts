import { API_CONFIG } from '../config/api.config';

// Configuration de base pour les appels API
const API_BASE_URL = API_CONFIG.BASE_URL;

// Interface pour les réponses d'authentification (sans token)
export interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    role?: 'user' | 'admin';
    status?: 'active' | 'blocked' | 'pending';
    avatar?: {
      url?: string;
      filename?: string;
      uploadedAt?: string;
    };
    created_at: string;
    last_login?: string;
  };
  // Plus de token ! Il est maintenant dans un cookie HTTPOnly sécurisé
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

// Service d'authentification avec cookies HTTPOnly sécurisés
class AuthCookieService {
  // Options de requête avec cookies
  private getRequestOptions(method: string, body?: any): RequestInit {
    return {
      method,
      credentials: 'include', // CRUCIAL : envoie automatiquement les cookies
      headers: {
        'Content-Type': 'application/json',
      },
      ...(body && { body: JSON.stringify(body) }),
    };
  }

  // Connexion
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(
      `${API_BASE_URL}/auth/login`,
      this.getRequestOptions('POST', credentials)
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la connexion');
    }

    const data = await response.json();
    console.log('🍪 Connexion réussie - Token stocké dans cookie HTTPOnly');
    return data;
  }

  // Inscription
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(
      `${API_BASE_URL}/auth/register`,
      this.getRequestOptions('POST', userData)
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de l'inscription");
    }

    const data = await response.json();
    console.log('🍪 Inscription réussie - Token stocké dans cookie HTTPOnly');
    return data;
  }

  // Déconnexion (supprime le cookie côté serveur)
  async logout(): Promise<void> {
    try {
      await fetch(
        `${API_BASE_URL}/auth/logout`,
        this.getRequestOptions('POST')
      );
      console.log('🍪 Déconnexion réussie - Cookie supprimé');
    } catch (error) {
      console.error('Erreur lors de la déconnexion côté serveur:', error);
      // Ne pas bloquer la déconnexion côté client même si le serveur échoue
    }
  }

  // Vérifier l'utilisateur actuel
  async getCurrentUser(): Promise<{ user: AuthResponse['user'] }> {
    const response = await fetch(
      `${API_BASE_URL}/auth/me`,
      this.getRequestOptions('GET')
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        response.status === 401
          ? 'Non authentifié ou session expirée'
          : `Erreur serveur: ${errorText}`
      );
    }

    return response.json();
  }

  // 🚀 NOUVELLES MÉTHODES SIMPLIFIÉES

  /**
   * Vérifier si l'utilisateur est connecté
   * Note: Avec cookies HTTPOnly, on ne peut pas vérifier côté JS
   * On doit faire un appel serveur
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtenir les informations utilisateur avec gestion d'erreur
   */
  async getUserSafely(): Promise<AuthResponse['user'] | null> {
    try {
      const response = await this.getCurrentUser();
      return response.user;
    } catch {
      return null;
    }
  }

  /**
   * Vérifier les permissions (nécessite un appel serveur)
   */
  async hasRole(requiredRole: 'user' | 'admin'): Promise<boolean> {
    try {
      const user = await this.getUserSafely();
      if (!user) return false;

      // Admin a tous les droits
      if (user.role === 'admin') return true;

      return user.role === requiredRole;
    } catch {
      return false;
    }
  }

  /**
   * Vérifier si l'utilisateur est admin
   */
  async isAdmin(): Promise<boolean> {
    return this.hasRole('admin');
  }

  /**
   * Diagnostic de l'authentification avec cookies
   */
  async diagnose(): Promise<void> {
    console.group('🍪 Diagnostic AuthCookieService');

    console.log('🔒 Sécurité:');
    console.log('  ✅ Token inaccessible depuis JavaScript (protection XSS)');
    console.log('  ✅ Transmission automatique avec chaque requête');
    console.log('  ✅ Synchronisation automatique multi-onglets');
    console.log('  ✅ Gestion expiration côté serveur');

    try {
      const user = await this.getUserSafely();
      console.log('👤 État utilisateur:');
      if (user) {
        console.log(`  Nom: ${user.name}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Rôle: ${user.role}`);
        console.log(`  Statut: ${user.status}`);
        console.log('  ✅ Utilisateur connecté');
      } else {
        console.log('  ❌ Utilisateur non connecté');
      }
    } catch (error) {
      console.log('  ❌ Erreur lors de la vérification:', error.message);
    }

    console.log('🍪 Avantages des cookies HTTPOnly:');
    console.log('  • Résistance aux attaques XSS');
    console.log('  • Synchronisation automatique multi-onglets');
    console.log('  • Pas de gestion manuelle du token');
    console.log('  • Expiration automatique');

    console.groupEnd();
  }

  /**
   * Méthodes héritées pour compatibilité (maintenant simplifiées)
   */

  // Plus besoin de gérer le token côté client
  getToken(): null {
    console.warn('⚠️ getToken() est obsolète avec cookies HTTPOnly');
    return null;
  }

  setToken(): void {
    console.warn('⚠️ setToken() est obsolète avec cookies HTTPOnly');
  }

  removeToken(): void {
    console.warn(
      '⚠️ removeToken() est obsolète avec cookies HTTPOnly - utilisez logout()'
    );
  }

  // Gestion utilisateur en mémoire temporaire (pour les composants)
  private cachedUser: AuthResponse['user'] | null = null;
  private cacheExpiry: number = 0;
  private CACHE_DURATION = 30000; // 30 secondes

  async getUser(): Promise<AuthResponse['user'] | null> {
    const now = Date.now();

    // Utiliser le cache si valide
    if (this.cachedUser && now < this.cacheExpiry) {
      return this.cachedUser;
    }

    // Rafraîchir depuis le serveur
    try {
      const user = await this.getUserSafely();
      this.cachedUser = user;
      this.cacheExpiry = now + this.CACHE_DURATION;
      return user;
    } catch {
      this.cachedUser = null;
      return null;
    }
  }

  // Invalider le cache (après login/logout)
  invalidateCache(): void {
    this.cachedUser = null;
    this.cacheExpiry = 0;
  }

  // Méthodes simplifiées pour compatibilité
  setUser(): void {
    console.warn('⚠️ setUser() est obsolète avec cookies HTTPOnly');
  }

  removeUser(): void {
    this.invalidateCache();
  }

  clearAuth(): void {
    this.invalidateCache();
    // Le logout côté serveur est géré par la méthode logout()
  }

  // Méthodes de diagnostic héritées
  clearAllStorage(): void {
    console.log('🧹 Nettoyage cache utilisateur (cookies gérés côté serveur)');
    this.invalidateCache();
  }

  diagnoseStorage(): void {
    console.log('🍪 Stockage hybride:');
    console.log('  - Token: Cookie HTTPOnly sécurisé (inaccessible JS)');
    console.log('  - User: Cache temporaire côté client (30s)');
    console.log(
      '  - Cache utilisateur:',
      this.cachedUser ? '✅ Présent' : '❌ Absent'
    );
    console.log(
      '  - Cache expire dans:',
      Math.max(0, this.cacheExpiry - Date.now()),
      'ms'
    );
  }
}

// Instance singleton du service d'authentification avec cookies
export const authCookieService = new AuthCookieService();

// Exposer en mode dev
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).authCookieService = authCookieService;
  (window as any).diagAuth = () => authCookieService.diagnose();
}
