import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { Journal } from '../types';
import type { Place } from '../types';
import { journalApi } from '../services/journal-api';
import { useAuth } from '../hooks/useAuth';

interface JournalContextType {
  journals: Journal[];
  addJournal: (journal: Omit<Journal, 'id'>) => Promise<void>;
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
  loadJournals: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
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
  const { user } = useAuth(); // Récupérer l'utilisateur connecté
  const [journals, setJournals] = useState<Journal[]>([]); // ✅ Démarrer avec un tableau vide

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour charger les journaux de l'utilisateur connecté
  const loadJournals = useCallback(async () => {
    if (!user?.id) {
      setJournals([]); // Si pas d'utilisateur, vider les journaux
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Appeler l'API pour récupérer les journaux de l'utilisateur
      const response = await journalApi.getJournals();

      // Convertir au format local
      const userJournals = response.data.map((journal) => ({
        id: journal._id,
        title: journal.title,
        description: journal.description || '',
        startDate: new Date(journal.start_date),
        endDate: new Date(journal.end_date),
        userId: journal.user_id,
        personalNotes: journal.personal_notes,
        tags: journal.tags || [],
        places: [], // TODO: convertir les places si nécessaire
        // ✅ Ajouter la photo de couverture récupérée
        mainPhoto: journal.cover_image || '',
      }));

      setJournals(userJournals);
    } catch (error) {
      console.error('Erreur lors du chargement des journaux:', error);
      setError('Erreur lors du chargement des journaux');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Charger les journaux quand l'utilisateur change
  useEffect(() => {
    loadJournals();
  }, [loadJournals]); // Recharger quand loadJournals change

  const addJournal = async (journalData: Omit<Journal, 'id'>) => {
    try {
      setIsLoading(true);
      setError(null);

      // Vérifier que l'utilisateur est connecté
      if (!user?.id) {
        throw new Error('Vous devez être connecté pour créer un journal');
      }

      // Convertir les données au format attendu par l'API
      const journalCreateData = {
        title: journalData.title,
        description: journalData.description,
        start_date: journalData.startDate.toISOString(),
        end_date: journalData.endDate.toISOString(),
        personal_notes: journalData.personalNotes,
        tags: journalData.tags || [],
        status: 'draft' as const,
        user_id: user.id,
        // ✅ Ajouter la photo de couverture
        cover_image:
          (journalData as Journal & { mainPhoto?: string }).mainPhoto || '',
      };

      // Appeler l'API backend pour créer le journal dans MongoDB Atlas
      await journalApi.createJournal(journalCreateData);

      // Recharger tous les journaux pour être sûr d'avoir les données à jour
      await loadJournals();
    } catch (error) {
      console.error('Erreur lors de la création du journal:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la création du journal'
      );
      throw error; // Propager l'erreur pour que le composant puisse la gérer
    } finally {
      setIsLoading(false);
    }
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
        loadJournals,
        isLoading,
        error,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};
