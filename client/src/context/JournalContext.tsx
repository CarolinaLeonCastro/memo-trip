import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { Journal } from '../types';
import type { Place } from '../types';

interface JournalContextType {
  journals: Journal[];
  addJournal: (journal: Omit<Journal, 'id'>) => void;
  updateJournal: (id: string, journal: Partial<Journal>) => void;
  deleteJournal: (id: string) => void;
  getJournal: (id: string) => Journal | undefined;
  addPlace: (journalId: string, place: Omit<Place, 'id' | 'journalId'>) => void;
  updatePlace: (
    journalId: string,
    placeId: string,
    place: Partial<Place>
  ) => void;
  deletePlace: (journalId: string, placeId: string) => void;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const useJournals = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournals must be used within a JournalProvider');
  }
  return context;
};

interface JournalProviderProps {
  children: ReactNode;
}

export const JournalProvider: React.FC<JournalProviderProps> = ({
  children,
}) => {
  const [journals, setJournals] = useState<Journal[]>([
    {
      id: '1',
      title: 'European Adventure',
      description: 'Amazing trip across Europe',
      startDate: new Date('2024-06-15'),
      endDate: new Date('2024-06-22'),
      userId: 'user1',
      places: [
        {
          id: '1',
          name: 'Eiffel Tower, Paris, France',
          description: 'Iconic iron lattice tower and symbol of Paris',
          latitude: 48.8584,
          longitude: 2.2945,
          dateVisited: new Date('2024-06-16'),
          photos: [
            'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1502602898536-47ad22581b52?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&q=80&w=800',
          ],
          journalId: '1',
        },
        {
          id: '2',
          name: 'Coliseum, Rome, Italy',
          description: 'Ancient amphitheatre in the centre of Rome',
          latitude: 41.8902,
          longitude: 12.4922,
          dateVisited: new Date('2024-06-18'),
          photos: [
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&q=80&w=800',
          ],
          journalId: '1',
        },
      ],
    },
  ]);

  const addJournal = (journalData: Omit<Journal, 'id'>) => {
    const newJournal: Journal = {
      ...journalData,
      id: Date.now().toString(),
      places: [],
    };
    setJournals((prev) => [...prev, newJournal]);
  };

  const updateJournal = (id: string, updates: Partial<Journal>) => {
    setJournals((prev) =>
      prev.map((journal) =>
        journal.id === id ? { ...journal, ...updates } : journal
      )
    );
  };

  const deleteJournal = (id: string) => {
    setJournals((prev) => prev.filter((journal) => journal.id !== id));
  };

  const getJournal = (id: string) => {
    return journals.find((journal) => journal.id === id);
  };

  const addPlace = (
    journalId: string,
    placeData: Omit<Place, 'id' | 'journalId'>
  ) => {
    const newPlace: Place = {
      ...placeData,
      id: Date.now().toString(),
      journalId,
    };

    setJournals((prev) =>
      prev.map((journal) =>
        journal.id === journalId
          ? { ...journal, places: [...journal.places, newPlace] }
          : journal
      )
    );
  };

  const updatePlace = (
    journalId: string,
    placeId: string,
    updates: Partial<Place>
  ) => {
    setJournals((prev) =>
      prev.map((journal) =>
        journal.id === journalId
          ? {
              ...journal,
              places: journal.places.map((place) =>
                place.id === placeId ? { ...place, ...updates } : place
              ),
            }
          : journal
      )
    );
  };

  const deletePlace = (journalId: string, placeId: string) => {
    setJournals((prev) =>
      prev.map((journal) =>
        journal.id === journalId
          ? {
              ...journal,
              places: journal.places.filter((place) => place.id !== placeId),
            }
          : journal
      )
    );
  };

  return (
    <JournalContext.Provider
      value={{
        journals,
        addJournal,
        updateJournal,
        deleteJournal,
        getJournal,
        addPlace,
        updatePlace,
        deletePlace,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};
