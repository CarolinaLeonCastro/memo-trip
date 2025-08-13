import { api } from '../config/api.config';

export interface AdminStats {
  users: {
    total: number;
    active: number;
    blocked: number;
    pending: number;
    newThisMonth: number;
  };
  journals: {
    total: number;
    published: number;
    pending: number;
    public: number;
    newThisMonth: number;
  };
  places: {
    total: number;
    pending: number;
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'blocked' | 'pending';
  created_at: string;
  last_login?: string;
  avatar?: {
    url?: string;
  };
}

export interface PendingContent {
  journals: Array<{
    _id: string;
    title: string;
    description: string;
    user_id: {
      name: string;
      email: string;
    };
    createdAt: string;
    moderation_status: string;
  }>;
  places: Array<{
    _id: string;
    name: string;
    description: string;
    user_id: {
      name: string;
      email: string;
    };
    journal_id: {
      title: string;
    };
    createdAt: string;
    moderation_status: string;
  }>;
}

export interface SystemSettings {
  app: {
    name: string;
    version: string;
    description: string;
  };
  moderation: {
    autoApprove: boolean;
    requireApprovalForPublic: boolean;
  };
  limits: {
    maxPlacesPerJournal: number;
    maxPhotosPerPlace: number;
    maxFileSize: number;
  };
  features: {
    publicJournals: boolean;
    userRegistration: boolean;
    guestAccess: boolean;
  };
}

class AdminService {
  // Statistiques
  async getStats(): Promise<AdminStats> {
    const response = await api.get('/admin/stats');
    return response.data;
  }

  // Gestion des utilisateurs
  async getUsers(params?: {
    page?: number;
    limit?: number;
    status?: string;
    role?: string;
    search?: string;
  }) {
    const response = await api.get('/admin/users', { params });
    return response.data;
  }

  async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<User> {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  }

  async updateUserStatus(
    userId: string,
    status: 'active' | 'blocked' | 'pending'
  ): Promise<User> {
    const response = await api.patch(`/admin/users/${userId}/status`, {
      status,
    });
    return response.data;
  }

  // Modération du contenu
  async getPendingContent(
    type?: 'all' | 'journals' | 'places'
  ): Promise<PendingContent> {
    const response = await api.get('/admin/moderation/pending', {
      params: { type },
    });
    return response.data;
  }

  async moderateJournal(
    journalId: string,
    action: 'approve' | 'reject',
    reason?: string
  ) {
    const response = await api.patch(
      `/admin/moderation/journals/${journalId}`,
      {
        action,
        reason,
      }
    );
    return response.data;
  }

  async moderatePlace(
    placeId: string,
    action: 'approve' | 'reject',
    reason?: string
  ) {
    const response = await api.patch(`/admin/moderation/places/${placeId}`, {
      action,
      reason,
    });
    return response.data;
  }

  // Paramètres système
  async getSystemSettings(): Promise<SystemSettings> {
    const response = await api.get('/admin/settings');
    return response.data;
  }

  async updateSystemSettings(
    settings: Partial<SystemSettings>
  ): Promise<SystemSettings> {
    const response = await api.patch('/admin/settings', { settings });
    return response.data;
  }
}

export const adminService = new AdminService();
