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

export interface DiscoverUser {
  _id: string;
  name: string;
  avatar?: {
    url?: string;
  };
}

export interface DiscoverPlace {
  _id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  photos: Array<{
    url: string;
    caption?: string;
  }>;
  tags: string[];
  rating?: number;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  date_visited: string;
}

export interface DiscoverJournal {
  _id: string;
  title: string;
  description: string;
  cover_image?: string;
  tags: string[];
  places_count: number;
  start_date: string;
  end_date: string;
}

export interface DiscoverPost {
  _id: string;
  type: 'place' | 'journal';
  user: DiscoverUser;
  content: DiscoverPlace | DiscoverJournal;
  likes: number;
  comments: number;
  views: number;
  is_liked: boolean;
  created_at: string;
}

export interface DiscoverStats {
  shared_places: number;
  public_journals: number;
  active_travelers: number;
}

export interface DiscoverFilters {
  search?: string;
  tags?: string[];
  type?: 'place' | 'journal' | 'all';
  sort?: 'recent' | 'popular' | 'trending';
  page?: number;
  limit?: number;
}

class PublicService {
  // Récupérer les journaux publics
  async getPublicJournals(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const response = await api.get('/api/public/journals', { params });
    return response.data.data;
  }

  // Récupérer un journal public par ID
  async getPublicJournalById(id: string) {
    const response = await api.get(`/api/public/journals/${id}`);
    return response.data.data;
  }

  // Récupérer les statistiques publiques
  async getPublicStats(): Promise<PublicStats> {
    const response = await api.get('/api/public/stats');
    return response.data.data;
  }

  // Récupérer les posts pour la page découverte
  async getDiscoverPosts(filters?: DiscoverFilters): Promise<{
    posts: DiscoverPost[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      console.log('🔗 Service: Appel API getDiscoverPosts avec filtres:', filters);
      const response = await api.get('/api/public/discover/posts', {
        params: filters,
      });
      
      console.log('🔗 Service: Réponse brute API:', response.data);
      console.log('🔗 Service: Structure de response.data:', {
        hasSuccess: 'success' in response.data,
        hasData: 'data' in response.data,
        dataType: typeof response.data.data,
        keys: Object.keys(response.data)
      });
      
      // Gérer différents formats de réponse
      let result;
      if (response.data.data) {
        result = response.data.data;
      } else if (response.data.posts) {
        result = response.data;
      } else {
        result = { posts: [], total: 0, page: 1, totalPages: 0 };
      }
      
      console.log('🔗 Service: Résultat final:', {
        postsCount: result.posts?.length || 0,
        total: result.total,
        page: result.page
      });
      
      return result;
    } catch (error) {
      console.error('❌ Service: Erreur getDiscoverPosts:', error);
      return { posts: [], total: 0, page: 1, totalPages: 0 };
    }
  }

  // Récupérer les statistiques de découverte
  async getDiscoverStats(): Promise<DiscoverStats> {
    try {
      console.log('🔗 Service: Appel API getDiscoverStats');
      const response = await api.get('/api/public/discover/stats');
      
      console.log('🔗 Service: Réponse stats brute:', response.data);
      
      // Gérer différents formats de réponse
      let result;
      if (response.data.data) {
        result = response.data.data;
      } else if (response.data.shared_places !== undefined) {
        result = response.data;
      } else {
        result = { shared_places: 0, public_journals: 0, active_travelers: 0 };
      }
      
      console.log('🔗 Service: Stats résultat final:', result);
      return result;
    } catch (error) {
      console.error('❌ Service: Erreur getDiscoverStats:', error);
      return { shared_places: 0, public_journals: 0, active_travelers: 0 };
    }
  }

  // Liker/Unliker un post
  async toggleLike(
    postId: string,
    type: 'place' | 'journal'
  ): Promise<{
    liked: boolean;
    likesCount: number;
  }> {
    const response = await api.post(
      `/api/public/discover/${type}s/${postId}/like`
    );
    return response.data.data;
  }

  // Récupérer les tags tendance
  async getTrendingTags(): Promise<
    Array<{
      tag: string;
      count: number;
    }>
  > {
    const response = await api.get('/api/public/discover/trending-tags');
    return response.data.data;
  }

  // Récupérer les voyageurs actifs
  async getActiveTravelers(): Promise<
    Array<{
      _id: string;
      name: string;
      avatar?: { url?: string };
      places_count: number;
      journals_count: number;
    }>
  > {
    const response = await api.get('/api/public/discover/active-travelers');
    return response.data.data;
  }

  // Récupérer les destinations populaires
  async getPopularDestinations(): Promise<
    Array<{
      city: string;
      country: string;
      count: number;
    }>
  > {
    const response = await api.get('/api/public/discover/popular-destinations');
    return response.data.data;
  }
}

export const publicService = new PublicService();
