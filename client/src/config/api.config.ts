// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  TIMEOUT: 30000, // 30 secondes pour éviter les AbortError
} as const;

// Instance API basée sur fetch
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout: number) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const config: RequestInit = {
      ...options,
      credentials: 'include', // Important pour envoyer les cookies HTTPOnly
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('🌐 API Response:', {
        url: `${this.baseURL}${endpoint}`,
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('🌐 API Error:', {
          status: response.status,
          errorData,
          endpoint,
        });
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('🌐 API Success:', result);
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async get(endpoint: string, params?: Record<string, any>): Promise<any> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            // Pour les arrays, on les joint avec des virgules
            if (value.length > 0) {
              searchParams.append(key, value.join(','));
            }
          } else {
            searchParams.append(key, String(value));
          }
        }
      });

      const queryString = searchParams.toString();
      if (queryString) {
        url = `${endpoint}?${queryString}`;
      }
    }
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint: string, data?: any): Promise<any> {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint: string, data?: any): Promise<any> {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data?: any): Promise<any> {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string): Promise<any> {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient(API_CONFIG.BASE_URL, API_CONFIG.TIMEOUT);

// Types pour les réponses d'erreur API
export interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Fonction utilitaire pour gérer les erreurs API
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as ApiError).message;
  }

  return 'Une erreur inattendue est survenue';
};
