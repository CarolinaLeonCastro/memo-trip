import { api } from '../config/api.config';

export interface PublicPlacePreview {
  _id: string;
  name: string;
  city: string;
  country: string;
  coverImage?: string | null;
  status: 'visited' | 'planned';
}

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
  samplePlaces?: PublicPlacePreview[];
  remainingPlacesCount?: number;
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
  samplePlaces?: PublicPlacePreview[];
  remainingPlacesCount?: number;
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

  // Récupérer un journal public par ID avec filtres optionnels pour les lieux
  async getPublicJournalById(
    id: string,
    filters?: {
      q?: string;
      tag?: string;
      sort?: string;
      page?: number;
      limit?: number;
    }
  ) {
    try {
      console.log(
        '🔗 Service: Appel API getPublicJournalById pour:',
        id,
        'avec filtres:',
        filters
      );
      const response = await api.get(`/api/public/journals/${id}`, {
        params: filters,
      });
      console.log('🔗 Service: Réponse brute journal:', response.data);

      // Vérifier si la réponse a le format {success: true, data: ...}
      if (response.data.success !== undefined) {
        if (response.data.success) {
          console.log('✅ Service: Format avec success=true, retour data');
          return response.data.data;
        } else {
          console.error(
            '❌ Service: API retourne success=false:',
            response.data.message
          );
          return null;
        }
      } else {
        // La réponse est directement l'objet journal (format attendu basé sur les logs)
        console.log('✅ Service: Format direct, retour de response.data');
        return response.data;
      }
    } catch (error) {
      console.error('❌ Service: Erreur API getPublicJournalById:', error);
      return null;
    }
  }

  // Récupérer un lieu public par ID avec toutes ses photos
  async getPublicPlaceById(id: string) {
    try {
      console.log('🔗 Service: Appel API getPublicPlaceById pour:', id);
      const response = await api.get(`/api/public/places/${id}`);
      console.log('🔗 Service: Réponse brute lieu:', response.data);

      // Vérifier si la réponse a le format {success: true, data: ...}
      if (response.data.success !== undefined) {
        if (response.data.success) {
          console.log('✅ Service: Format avec success=true, retour data');
          return response.data.data;
        } else {
          console.error(
            '❌ Service: API retourne success=false:',
            response.data.message
          );
          return null;
        }
      } else {
        // La réponse est directement l'objet lieu (format direct)
        console.log('✅ Service: Format direct, retour de response.data');
        return response.data;
      }
    } catch (error) {
      console.error('❌ Service: Erreur API getPublicPlaceById:', error);
      return null;
    }
  }

  // Récupérer un lieu public par ID (ancienne version, maintenant un alias)
  async getPublicPlaceByIdLegacy(id: string) {
    try {
      console.log('🔗 Service: Appel API getPublicPlaceByIdLegacy pour:', id);
      const response = await api.get(`/api/public/places/${id}`);
      console.log('🔗 Service: Réponse brute lieu:', response.data);

      if (response.data.success) {
        console.log('✅ Service: Lieu trouvé avec succès');
        return response.data.data;
      } else {
        console.error(
          '❌ Service: API retourne success=false:',
          response.data.message
        );
        return null;
      }
    } catch (error) {
      console.error('❌ Service: Erreur API getPublicPlaceByIdLegacy:', error);
      return null;
    }
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
      console.log(
        '🔗 Service: Appel API getDiscoverPosts avec filtres:',
        filters
      );

      // Nettoyer les filtres undefined
      const cleanFilters = filters
        ? Object.fromEntries(
            Object.entries(filters).filter(
              ([, value]) => value !== undefined && value !== null
            )
          )
        : {};

      console.log('🔗 Service: Filtres nettoyés:', cleanFilters);

      const response = await api.get(
        '/api/public/discover/posts',
        cleanFilters
      );

      console.log('🔗 Service: Réponse brute API:', response.data);
      console.log('🔗 Service: Structure de response.data:', {
        hasSuccess: 'success' in response.data,
        hasData: 'data' in response.data,
        dataType: typeof response.data.data,
        keys: Object.keys(response.data),
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
        page: result.page,
      });

      return result;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn(
          '⚠️ Service: Requête annulée (timeout ou abort):',
          error.message
        );
      } else {
        console.error('❌ Service: Erreur getDiscoverPosts:', error);
      }
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
    targetId: string,
    targetType: 'place' | 'journal'
  ): Promise<{
    liked: boolean;
    likesCount: number;
  }> {
    console.log('📡 Service toggleLike appelé avec:', { targetId, targetType });

    try {
      const response = await api.post('/api/public/like', {
        targetId,
        targetType,
      });

      console.log('📡 Réponse complète API:', response);
      console.log('📡 Données de la réponse:', response.data);
      console.log('📡 response.data.success:', response.data?.success);
      console.log('📡 response.data.data:', response.data?.data);
      console.log('📡 Type de response.data.data:', typeof response.data?.data);

      // Version simplifiée - essayons différentes structures
      if (response.data) {
        // Cas 1: Structure normale {success: true, data: {liked, likesCount}}
        if (response.data.success && response.data.data) {
          const result = response.data.data;
          console.log('✅ Structure normale détectée:', result);
          return {
            liked: result.liked,
            likesCount: result.likesCount,
          };
        }

        // Cas 2: Données directement dans response.data
        if (typeof response.data.liked === 'boolean') {
          console.log('✅ Structure directe détectée:', response.data);
          return {
            liked: response.data.liked,
            likesCount: response.data.likesCount,
          };
        }

        // Cas 3: Debug - afficher toute la structure
        console.error('❌ Structure inconnue:', {
          responseData: response.data,
          keys: Object.keys(response.data),
          success: response.data.success,
          data: response.data.data,
        });
      }

      throw new Error('Structure de réponse inattendue');
    } catch (error) {
      console.error('❌ Erreur dans toggleLike service:', error);
      throw error;
    }
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
