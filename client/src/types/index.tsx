export interface User {
  id: string;
  email: string;
  name: string;
  role?: 'user' | 'admin';
  status?: 'active' | 'blocked' | 'pending';
  avatar?: {
    url?: string;
    filename?: string;
    uploadedAt?: string;
  };
  created_at?: string;
  last_login?: string;
}

export interface Journal {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  userId: string;
  places: Place[];
  mainPhoto?: string;
  tags?: string[];
  personalNotes?: string;
}

export interface Place {
  id: string;
  name: string;
  city: string;
  country: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;

  // === NOUVEAU : Statut du lieu ===
  status?: 'planned' | 'visited';

  // === DATES POUR LIEUX VISITÉS ===
  dateVisited: Date;
  startDate?: Date;
  endDate?: Date;
  visitedAt?: Date; // Date exacte de visite

  // === DATES POUR LIEUX PLANIFIÉS ===
  plannedStart?: Date; // Date de début planifiée
  plannedEnd?: Date; // Date de fin planifiée

  photos: string[];
  imageUrl?: string;
  tags: string[];
  visited: boolean; // Pour compatibilité (mapping vers status)
  rating?: number;
  weather?: string;
  budget?: number;
  isFavorite?: boolean;
  visitDuration?: number;
  notes?: string;
  journalId: string;
}
