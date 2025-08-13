import { api } from '../config/api.config';

export interface PublicJournal {
  _id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  cover_image?: string;
  tags: string[];
  user_id: {
    _id: string;
    name: string;
    avatar?: {
      url?: string;
    };
  };
  places?: Array<{
    _id: string;
    name: string;
    description: string;
    date_visited: string;
    rating?: number;
    photos?: Array<{
      url: string;
      caption?: string;
    }>;
    location?: {
      address?: string;
      city?: string;
      country?: string;
    };
  }>;
  stats: {
    total_places: number;
    total_photos: number;
    total_days: number;
  };
  createdAt: string;
}

export interface PublicStats {
  stats: {
    totalJournals: number;
    totalPlaces: number;
  };
  recentJournals: PublicJournal[];
}

class PublicService {
  // Récupérer les journaux publics
  async getPublicJournals(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const response = await api.get('/public/journals', { params });
    return response.data.data;
  }

  // Récupérer un journal public par ID
  async getPublicJournalById(id: string) {
    const response = await api.get(`/public/journals/${id}`);
    return response.data.data;
  }

  // Récupérer les statistiques publiques
  async getPublicStats(): Promise<PublicStats> {
    const response = await api.get('/public/stats');
    return response.data.data;
  }
}

export const publicService = new PublicService();
