import { api } from '../config/api.config';

export interface UserSettings {
  areJournalsPublic: boolean;
}

export interface UserSettingsResponse {
  success: boolean;
  data: UserSettings;
  message?: string;
}

class UserService {
  // Récupérer les paramètres de l'utilisateur connecté
  async getSettings(): Promise<UserSettings> {
    const response = await api.get('/api/users/settings');
    return response.data.data;
  }

  // Mettre à jour les paramètres de l'utilisateur connecté
  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    const response = await api.put('/api/users/settings', settings);
    return response.data.data;
  }
}

export const userService = new UserService();
