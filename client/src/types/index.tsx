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
}

export interface Place {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  dateVisited: Date;
  photos: string[];
  journalId: string;
}
