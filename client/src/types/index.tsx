export interface User {
  id: string;
  email: string;
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
