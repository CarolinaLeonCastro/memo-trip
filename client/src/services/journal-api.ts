import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

// Types pour les journaux
export interface Journal {
  _id: string;
  title: string;
  description?: string;
  personal_notes?: string;
  start_date: string;
  end_date: string;
  cover_image?: string;
  status: 'draft' | 'published' | 'archived';
  is_public: boolean;
  slug?: string;
  tags: string[];
  user_id: string;
  places: string[];
  stats: {
    total_places: number;
    total_photos: number;
    total_days: number;
  };
  created_at: string;
  updated_at: string;
}

export interface JournalCreateRequest {
  title: string;
  description?: string;
  personal_notes?: string;
  start_date: string;
  end_date: string;
  cover_image?: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
}

export interface JournalUpdateRequest extends Partial<JournalCreateRequest> {
  title?: string;
}

export interface JournalListResponse {
  data: Journal[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  filters: {
    search?: string;
    status?: string;
    tags?: string;
    sort_by: string;
    sort_order: string;
  };
}

export interface JournalTogglePublicRequest {
  is_public: boolean;
  visibility?: string;
}

export interface JournalTogglePublicResponse {
  message: string;
  journal: Journal;
  public_url?: string;
}

export interface JournalListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'draft' | 'published' | 'archived';
  tags?: string;
  sort_by?: 'start_date' | 'created_at' | 'updated_at' | 'title';
  sort_order?: 'asc' | 'desc';
}

// Configuration Axios
const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    withCredentials: true, // Important pour envoyer les cookies HTTPOnly
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Intercepteur de réponse pour gérer les erreurs globalement
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        // Erreur de réponse du serveur
        const message =
          error.response.data?.message ||
          `Erreur HTTP ${error.response.status}`;
        throw new Error(message);
      } else if (error.request) {
        // Erreur de réseau
        throw new Error('Erreur de connexion au serveur');
      } else {
        // Autre erreur
        throw new Error(error.message || 'Une erreur inattendue est survenue');
      }
    }
  );

  return instance;
};

// Service API pour les journaux
class JournalApiService {
  private axiosInstance: ReturnType<typeof createAxiosInstance>;

  constructor() {
    this.axiosInstance = createAxiosInstance();
  }

  /**
   * GET /api/journals - Liste paginée et filtrée des journaux
   */
  async getJournals(params?: JournalListParams): Promise<JournalListResponse> {
    const response = await this.axiosInstance.get('/journals', { params });
    return response.data as JournalListResponse;
  }

  /**
   * POST /api/journals - Création d'un nouveau journal
   */
  async createJournal(data: JournalCreateRequest): Promise<Journal> {
    const response = await this.axiosInstance.post('/journals', data);
    return response.data as Journal;
  }

  /**
   * GET /api/journals/:id - Consultation d'un journal (ownership requis)
   */
  async getJournalById(id: string): Promise<Journal> {
    const response = await this.axiosInstance.get(`/journals/${id}`);
    return response.data as Journal;
  }

  /**
   * PUT /api/journals/:id - Modification d'un journal
   */
  async updateJournal(
    id: string,
    data: JournalUpdateRequest
  ): Promise<Journal> {
    const response = await this.axiosInstance.put(`/journals/${id}`, data);
    return response.data as Journal;
  }

  /**
   * DELETE /api/journals/:id - Suppression d'un journal (et dépendances éventuelles)
   */
  async deleteJournal(id: string): Promise<void> {
    await this.axiosInstance.delete(`/journals/${id}`);
  }

  /**
   * PATCH /api/journals/:id/toggle-public - Activation/désactivation du partage public
   */
  async togglePublic(
    id: string,
    data: JournalTogglePublicRequest
  ): Promise<JournalTogglePublicResponse> {
    const response = await this.axiosInstance.patch(
      `/journals/${id}/toggle-public`,
      data
    );
    return response.data as JournalTogglePublicResponse;
  }
}

// Instance singleton du service
export const journalApi = new JournalApiService();

// Export par défaut
export default journalApi;
