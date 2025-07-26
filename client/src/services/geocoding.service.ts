const API_BASE_URL = 'http://localhost:3000/api'; // Ajustez selon votre config

export interface GeocodingResult {
  place_id: string;
  display_name: string;
  name: string;
  address: {
    house_number?: string;
    road?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  type: string;
  class: string;
  importance: number;
  bbox?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface ReverseGeocodingResult {
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export class GeocodingService {
  static async searchPlaces(
    query: string,
    limit: number = 5
  ): Promise<GeocodingResult[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString(),
      });

      const response = await fetch(
        `${API_BASE_URL}/geocoding/search?${params}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error searching places:', error);
      throw new Error('Failed to search places');
    }
  }

  static async reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<ReverseGeocodingResult> {
    try {
      const params = new URLSearchParams({
        lat: latitude.toString(),
        lon: longitude.toString(),
      });

      const response = await fetch(
        `${API_BASE_URL}/geocoding/reverse?${params}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      throw new Error('Failed to reverse geocode');
    }
  }
}
