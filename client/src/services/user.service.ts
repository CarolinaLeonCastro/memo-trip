import { api } from '../config/api.config';

export interface UserSettings {
  areJournalsPublic: boolean;
}

export interface UserSettingsResponse {
  success: boolean;
  data: UserSettings;
  message?: string;
}

export interface UserActivity {
  type: string;
  title: string;
  description: string;
  date: string;
  formattedDate: string;
  icon: string;
  color: string;
}

export interface UserActivityResponse {
  success: boolean;
  data: UserActivity[];
  meta: {
    total: number;
    limit: number;
  };
}

class UserService {
  // Récupérer les paramètres de l'utilisateur connecté
  async getSettings(): Promise<UserSettings> {
    try {
      // Ajouter un cache buster pour éviter les réponses en cache
      const cacheBuster = Date.now();
      const response = await api.get(`/api/users/settings?_cb=${cacheBuster}`);
      const data = response.data.data;

      console.log("🔍 Service: Réponse brute de l'API:", response.data);
      console.log('🔍 Service: Data extraite:', data);
      console.log(
        '🔍 Service: Structure complète:',
        JSON.stringify(response.data, null, 2)
      );

      // Gérer les différents formats de réponse possibles
      let areJournalsPublic = false;

      if (data?.areJournalsPublic !== undefined) {
        // Format attendu: {success: true, data: {areJournalsPublic: true}}
        areJournalsPublic = data.areJournalsPublic;
        console.log('🔍 Service: Format standard détecté');
      } else if (response.data?.areJournalsPublic !== undefined) {
        // Format alternatif: {areJournalsPublic: true}
        areJournalsPublic = response.data.areJournalsPublic;
        console.log('🔍 Service: Format alternatif détecté');
      }

      // S'assurer que les propriétés existent avec des valeurs par défaut
      const result = {
        areJournalsPublic: Boolean(areJournalsPublic),
      };

      console.log('🔍 Service: Résultat final:', result);
      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres:', error);
      // Retourner des valeurs par défaut en cas d'erreur
      return {
        areJournalsPublic: false,
      };
    }
  }

  // Mettre à jour les paramètres de l'utilisateur connecté
  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    try {
      console.log('📤 Envoi des paramètres:', settings);
      const response = await api.put('/api/users/settings', settings);
      console.log("✅ Réponse de l'API:", response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour des paramètres:', error);
      throw error;
    }
  }

  // Récupérer l'activité récente de l'utilisateur connecté
  async getUserActivity(limit = 10): Promise<UserActivity[]> {
    try {
      const response = await api.get(`/api/users/activity?limit=${limit}`);

      // Vérifier différentes structures possibles
      if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.error('❌ Structure de données inattendue:', response.data);
        return [];
      }
    } catch (error) {
      console.error("❌ Erreur lors de la récupération de l'activité:", error);
      // Retourner un tableau vide en cas d'erreur
      return [];
    }
  }
}

export const userService = new UserService();
