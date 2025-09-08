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
import { placeApi, type PlaceCreateRequest } from '../services/place-api';
import { useAuth } from '../hooks/useAuth';

interface JournalContextType {
  journals: Journal[];
  addJournal: (journal: Omit<Journal, 'id'>) => Promise<void>;
  updateJournal: (id: string, journal: Partial<Journal>) => Promise<void>;
  deleteJournal: (id: string) => Promise<void>;
  getJournal: (id: string) => Journal | undefined;
  addPlace: (
    journalId: string,
    place: Omit<Place, 'id' | 'journalId'>
  ) => Promise<void>;
  updatePlace: (
    journalId: string,
    placeId: string,
    place: Partial<Place>
  ) => Promise<void>;
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
        places: journal.places
          ? journal.places.map((place: any) => ({
              id: place._id,
              name: place.name,
              city: place.location?.city || '',
              country: place.location?.country || '',
              description: place.description || '',
              address: place.location?.address || '',
              latitude: place.location?.coordinates?.[1],
              longitude: place.location?.coordinates?.[0],
              dateVisited: new Date(place.date_visited),
              startDate: place.start_date
                ? new Date(place.start_date)
                : new Date(place.date_visited),
              endDate: place.end_date
                ? new Date(place.end_date)
                : new Date(place.date_visited),
              photos: place.photos?.map((photo: any) => photo.url) || [],
              tags: place.tags || [],
              visited: true, // Si c'est dans la base, c'est visité
              rating: place.rating,
              weather: place.weather || '',
              budget: place.budget,
              isFavorite: place.is_favorite || false,
              visitDuration: place.visit_duration,
              notes: place.notes || '',
              journalId: journal._id,
            }))
          : [],
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

  const updateJournal = async (id: string, updates: Partial<Journal>) => {
    try {
      setIsLoading(true);
      setError(null);

      // Convertir les données au format attendu par l'API
      const updateData: {
        title?: string;
        description?: string;
        personal_notes?: string;
        tags?: string[];
        start_date?: string;
        end_date?: string;
        cover_image?: string;
      } = {};

      if (updates.title) updateData.title = updates.title;
      if (updates.description) {
        updateData.description = updates.description;
      }
      if (updates.personalNotes) {
        updateData.personal_notes = updates.personalNotes;
      }
      if (updates.tags) updateData.tags = updates.tags;
      if (updates.startDate) {
        updateData.start_date = updates.startDate.toISOString();
      }
      if (updates.endDate) {
        updateData.end_date = updates.endDate.toISOString();
      }
      if ((updates as Journal & { mainPhoto?: string }).mainPhoto) {
        updateData.cover_image = (
          updates as Journal & { mainPhoto?: string }
        ).mainPhoto;
      }

      // Appeler l'API backend pour modifier le journal dans MongoDB Atlas
      await journalApi.updateJournal(id, updateData);

      // Recharger tous les journaux pour être sûr d'avoir les données à jour
      await loadJournals();
    } catch (error) {
      console.error('Erreur lors de la modification du journal:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la modification du journal'
      );
      throw error; // Propager l'erreur pour que le composant puisse la gérer
    } finally {
      setIsLoading(false);
    }
  };

  const deleteJournal = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Appeler l'API backend pour supprimer le journal dans MongoDB Atlas
      await journalApi.deleteJournal(id);

      // Recharger tous les journaux pour être sûr d'avoir les données à jour
      await loadJournals();
    } catch (error) {
      console.error('Erreur lors de la suppression du journal:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la suppression du journal'
      );
      throw error; // Propager l'erreur pour que le composant puisse la gérer
    } finally {
      setIsLoading(false);
    }
  };

  const getJournal = (id: string) => {
    return journals.find((journal) => journal.id === id);
  };

  const addPlace = async (
    journalId: string,
    placeData: Omit<Place, 'id' | 'journalId'>
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      // Préparer les données pour l'API
      const placeCreateData: PlaceCreateRequest = {
        name: placeData.name,
        description: placeData.description || '',
        journal_id: journalId,
        location: {
          coordinates:
            placeData.latitude && placeData.longitude
              ? [Number(placeData.longitude), Number(placeData.latitude)]
              : [2.3488, 48.8534], // Coordonnées par défaut : Paris, France
          address: placeData.address || '',
          city: placeData.city || '',
          country: placeData.country || '',
        },
        date_visited: new Date(placeData.dateVisited).toISOString(),
        start_date: placeData.startDate
          ? new Date(placeData.startDate).toISOString()
          : new Date(placeData.dateVisited).toISOString(),
        end_date: placeData.endDate
          ? new Date(placeData.endDate).toISOString()
          : new Date(placeData.dateVisited).toISOString(),
        rating: placeData.rating || undefined,
        weather: placeData.weather || '',
        budget: placeData.budget || undefined,
        tags: placeData.tags || [],
        is_favorite: placeData.isFavorite || false,
        visit_duration: placeData.visitDuration || undefined,
        notes: placeData.notes || '',
      };

      // Nettoyer les valeurs undefined
      const cleanData = Object.fromEntries(
        Object.entries(placeCreateData).filter(
          ([_, value]) => value !== undefined
        )
      ) as PlaceCreateRequest;

      // Debug: Afficher les données envoyées
      console.log("📍 Données envoyées à l'API:", cleanData);

      // Créer la place via l'API
      const createdPlace = await placeApi.createPlace(cleanData);

      console.log('Place créée avec succès:', createdPlace);

      // 📸 Gérer l'upload des photos si il y en a
      if (placeData.photos && placeData.photos.length > 0) {
        try {
          console.log(
            `📷 Upload de ${placeData.photos.length} photos pour la place ${createdPlace._id}`
          );

          // Convertir les photos base64 en FormData
          const formData = new FormData();
          const captions: string[] = [];

          for (let i = 0; i < placeData.photos.length; i++) {
            const photoBase64 = placeData.photos[i];

            // Convertir base64 en blob avec le bon type MIME
            const response = await fetch(photoBase64);
            const blob = await response.blob();

            // Créer un blob avec le type MIME correct
            const imageBlob = new Blob([blob], { type: 'image/jpeg' });

            // Ajouter au FormData avec un nom de fichier unique
            formData.append(
              'photos',
              imageBlob,
              `place_photo_${Date.now()}_${i}.jpg`
            );
            captions.push(''); // Caption vide pour l'instant

            console.log(`📸 Photo ${i + 1} ajoutée: ${imageBlob.size} bytes`);
          }

          // Ajouter les captions
          captions.forEach((caption, index) => {
            formData.append(`captions[${index}]`, caption);
          });

          // Upload vers Cloudinary
          await placeApi.addPhotos(createdPlace._id, formData);

          console.log('✅ Photos uploadées avec succès vers Cloudinary');
        } catch (photoError) {
          console.error("❌ Erreur lors de l'upload des photos:", photoError);
          // Ne pas faire échouer la création de la place à cause des photos
          // L'utilisateur peut les ajouter plus tard
        }
      }

      // Recharger les journaux pour avoir les données à jour (avec photos)
      await loadJournals();
    } catch (error) {
      console.error('Erreur lors de la création de la place:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la création de la place'
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlace = async (
    _journalId: string,
    placeId: string,
    updates: Partial<Place>
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      // Préparer les données pour l'API en convertissant le format local vers le format API
      interface UpdateData {
        name?: string;
        description?: string;
        location?: {
          type: string;
          coordinates: [number, number];
          address: string;
          city: string;
          country: string;
        };
        date_visited?: string;
        start_date?: string;
        end_date?: string;
        rating?: number;
        weather?: string;
        budget?: number;
        tags?: string[];
        is_favorite?: boolean;
        visit_duration?: number;
        notes?: string;
        photos?: Array<{
          url: string;
          public_id?: string;
          width?: number;
          height?: number;
          format?: string;
          variants?: {
            thumbnail?: string;
            small?: string;
            medium?: string;
            large?: string;
            original?: string;
          };
          filename?: string;
          caption?: string;
          size?: number;
          mimetype?: string;
          uploadedAt?: Date;
        }>;
      }

      const updateData: UpdateData = {};

      if (updates.name) updateData.name = updates.name;
      if (updates.description !== undefined)
        updateData.description = updates.description;
      if (updates.latitude !== undefined && updates.longitude !== undefined) {
        updateData.location = {
          type: 'Point',
          coordinates: [Number(updates.longitude), Number(updates.latitude)],
          address: updates.address || '',
          city: updates.city || '',
          country: updates.country || '',
        };
      }
      if (updates.dateVisited)
        updateData.date_visited = new Date(updates.dateVisited).toISOString();
      if (updates.startDate)
        updateData.start_date = new Date(updates.startDate).toISOString();
      if (updates.endDate)
        updateData.end_date = new Date(updates.endDate).toISOString();
      if (updates.rating !== undefined) updateData.rating = updates.rating;
      if (updates.weather !== undefined) updateData.weather = updates.weather;
      if (updates.budget !== undefined) updateData.budget = updates.budget;
      if (updates.tags) updateData.tags = updates.tags;
      if (updates.isFavorite !== undefined)
        updateData.is_favorite = updates.isFavorite;
      if (updates.visitDuration !== undefined)
        updateData.visit_duration = updates.visitDuration;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      
      // Gérer les photos - Convertir les URLs simples en objets photo complets
      if (updates.photos !== undefined) {
        updateData.photos = updates.photos.map((photoUrl: string) => ({
          url: photoUrl,
          uploadedAt: new Date(),
        }));
      }

      console.log('📝 Mise à jour de la place - données envoyées:', updateData);

      // Appeler l'API pour mettre à jour la place
      await placeApi.updatePlace(placeId, updateData);

      // Recharger les journaux pour avoir les données à jour
      await loadJournals();

      console.log('Place mise à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la place:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la mise à jour de la place'
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePlace = async (journalId: string, placeId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(`🗑️ Suppression du lieu ${placeId} du journal ${journalId}`);

      // Appeler l'API pour supprimer réellement le lieu
      await placeApi.deletePlace(placeId);

      console.log('✅ Lieu supprimé avec succès du serveur');

      // Mettre à jour l'état local après suppression réussie
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

      console.log("✅ État local mis à jour - lieu retiré de l'interface");
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du lieu:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la suppression du lieu'
      );
      // Ne pas mettre à jour l'état local si l'API échoue
      throw error;
    } finally {
      setIsLoading(false);
    }
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
