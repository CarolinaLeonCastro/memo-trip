import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

// Types pour les places
export interface Place {
  _id: string;
  user_id: string;
  journal_id: string;
  name: string;
  description?: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
    address?: string;
    city?: string;
    country?: string;
  };
  start_date: string; // Date de début de la visite
  end_date: string; // Date de fin de la visite
  date_visited: string; // Date principale (pour compatibilité)
  photos: PlacePhoto[];
  rating?: number;
  weather?: string;
  budget?: number;
  tags: string[];
  is_favorite: boolean;
  visit_duration?: number; // en minutes
  notes?: string;
  moderation_status: 'pending' | 'approved' | 'rejected';
  moderated_by?: string;
  moderated_at?: string;
  rejection_reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlacePhoto {
  _id?: string;
  url: string;
  filename?: string;
  caption?: string;
  size?: number;
  mimetype?: string;
  uploadedAt: string;
}

export interface PlaceCreateRequest {
  name: string;
  description?: string;
  journal_id: string;
  location: {
    coordinates: [number, number]; // [longitude, latitude]
    address?: string;
    city?: string;
    country?: string;
  };
  date_visited: string; // Date principale (pour compatibilité)
  start_date: string; // Date de début de visite
  end_date: string; // Date de fin de visite
  rating?: number;
  weather?: string;
  budget?: number;
  tags?: string[];
  is_favorite?: boolean;
  visit_duration?: number;
  notes?: string;
}

export interface PlaceUpdateRequest extends Partial<PlaceCreateRequest> {
  name?: string;
}

export interface PlaceListResponse {
  data: Place[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  filters: {
    search?: string;
    user_id?: string;
    journal_id?: string;
    city?: string;
    country?: string;
    rating_min?: number;
    rating_max?: number;
    sort_by: string;
    sort_order: string;
  };
}

export interface PlaceListParams {
  page?: number;
  limit?: number;
  search?: string;
  user_id?: string;
  journal_id?: string;
  city?: string;
  country?: string;
  rating_min?: number;
  rating_max?: number;
  sort_by?: 'date_visited' | 'createdAt' | 'updatedAt' | 'name' | 'rating';
  sort_order?: 'asc' | 'desc';
}

export interface NearbyPlacesParams {
  lat: number;
  lng: number;
  maxDistance?: number;
}

export interface PhotoUploadResponse {
  message: string;
  photos: PlacePhoto[];
  total_photos: number;
}

// Configuration Axios
const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Intercepteur de réponse pour gérer les erreurs
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const message =
          error.response.data?.message ||
          `Erreur HTTP ${error.response.status}`;
        throw new Error(message);
      } else if (error.request) {
        throw new Error('Erreur de connexion au serveur');
      } else {
        throw new Error(error.message || 'Une erreur inattendue est survenue');
      }
    }
  );

  return instance;
};

// Service API pour les places
class PlaceApiService {
  private axiosInstance: ReturnType<typeof createAxiosInstance>;

  constructor() {
    this.axiosInstance = createAxiosInstance();
  }

  /**
   * GET /api/places - Liste paginée et filtrée des places
   */
  async getPlaces(params?: PlaceListParams): Promise<PlaceListResponse> {
    const response = await this.axiosInstance.get('/api/places', { params });
    return response.data as PlaceListResponse;
  }

  /**
   * POST /api/places - Création d'une nouvelle place
   */
  async createPlace(data: PlaceCreateRequest): Promise<Place> {
    const response = await this.axiosInstance.post('/api/places', data);
    return response.data as Place;
  }

  /**
   * GET /api/places/:id - Consultation d'une place
   */
  async getPlaceById(id: string): Promise<Place> {
    const response = await this.axiosInstance.get(`/api/places/${id}`);
    return response.data as Place;
  }

  /**
   * PUT /api/places/:id - Modification d'une place
   */
  async updatePlace(id: string, data: PlaceUpdateRequest): Promise<Place> {
    const response = await this.axiosInstance.put(`/api/places/${id}`, data);
    return response.data as Place;
  }

  /**
   * DELETE /api/places/:id - Suppression d'une place
   */
  async deletePlace(id: string): Promise<void> {
    await this.axiosInstance.delete(`/api/places/${id}`);
  }

  /**
   * GET /api/places/nearby - Places à proximité
   */
  async getNearbyPlaces(
    params: NearbyPlacesParams
  ): Promise<{ data: Place[] }> {
    const response = await this.axiosInstance.get('/api/places/nearby', {
      params,
    });
    return response.data;
  }

  /**
   * POST /api/places/:id/photos - Ajouter des photos à une place
   */
  async addPhotos(
    placeId: string,
    formData: FormData
  ): Promise<PhotoUploadResponse> {
    const response = await this.axiosInstance.post(
      `/api/places/${placeId}/photos`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data as PhotoUploadResponse;
  }

  /**
   * GET /api/places/:id/photos - Récupérer les photos d'une place
   */
  async getPlacePhotos(placeId: string): Promise<{
    place_name: string;
    photos: PlacePhoto[];
    total: number;
  }> {
    const response = await this.axiosInstance.get(
      `/api/places/${placeId}/photos`
    );
    return response.data;
  }

  /**
   * DELETE /api/places/:id/photos/:photoId - Supprimer une photo
   */
  async removePhoto(
    placeId: string,
    photoId: string
  ): Promise<{
    message: string;
    total_photos: number;
  }> {
    const response = await this.axiosInstance.delete(
      `/api/places/${placeId}/photos/${photoId}`
    );
    return response.data;
  }
}

// Instance singleton du service
export const placeApi = new PlaceApiService();

// Export par défaut
export default placeApi;
