/**
 * Utilitaires pour la logique temporelle des voyages
 * Implémente les 3 cas : voyage futur, en cours, passé
 */

import type { Journal } from '../types';

/**
 * État temporel d'un voyage
 */
export type TravelStatus = 'future' | 'ongoing' | 'past';

/**
 * Interface pour les contraintes de dates selon l'état du voyage
 */
export interface TravelDateConstraints {
  status: TravelStatus;
  allowedStatuses: ('visited' | 'planned')[];
  visitedDateConstraints?: {
    min: string;
    max: string;
  };
  plannedDateConstraints?: {
    min: string;
    max: string;
  };
  infoMessage: string;
  helperText: string;
}

/**
 * Détermine l'état temporel d'un voyage par rapport à aujourd'hui
 * @param journal - Le journal de voyage
 * @returns L'état du voyage (future, ongoing, past)
 */
export const getTravelStatus = (journal: Journal): TravelStatus => {
  const today = new Date();
  const startDate = new Date(journal.startDate);
  const endDate = new Date(journal.endDate);

  // Normaliser les dates à 00:00:00 pour comparer uniquement les jours
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  if (today < startDate) {
    return 'future';
  } else if (today >= startDate && today <= endDate) {
    return 'ongoing';
  } else {
    return 'past';
  }
};

/**
 * Calcule les contraintes de dates et les messages selon l'état du voyage
 * @param journal - Le journal de voyage
 * @returns Les contraintes et messages appropriés
 */
export const getTravelDateConstraints = (
  journal: Journal
): TravelDateConstraints => {
  const status = getTravelStatus(journal);
  const today = new Date().toISOString().split('T')[0];
  const startDate = journal.startDate.toISOString().split('T')[0];
  const endDate = journal.endDate.toISOString().split('T')[0];

  const formatDate = (date: Date) => date.toLocaleDateString('fr-FR');

  switch (status) {
    case 'future':
      return {
        status: 'future',
        allowedStatuses: ['planned'],
        plannedDateConstraints: {
          min: startDate,
          max: endDate,
        },
        infoMessage:
          'Ce voyage est futur. Vous pouvez seulement planifier vos visites.',
        helperText: `Voyage prévu : ${formatDate(journal.startDate)} au ${formatDate(journal.endDate)}`,
      };

    case 'ongoing':
      return {
        status: 'ongoing',
        allowedStatuses: ['visited', 'planned'],
        visitedDateConstraints: {
          min: startDate,
          max: today, // Limité à aujourd'hui maximum
        },
        plannedDateConstraints: {
          min: today, // À partir d'aujourd'hui
          max: endDate,
        },
        infoMessage:
          'Ce voyage est en cours. Vous pouvez ajouter vos visites passées et planifier celles à venir.',
        helperText: `Voyage en cours : ${formatDate(journal.startDate)} au ${formatDate(journal.endDate)}`,
      };

    case 'past':
      return {
        status: 'past',
        allowedStatuses: ['visited'],
        visitedDateConstraints: {
          min: startDate,
          max: endDate,
        },
        infoMessage:
          'Ce voyage est terminé. Vous pouvez seulement enregistrer les lieux visités.',
        helperText: `Voyage terminé : ${formatDate(journal.startDate)} au ${formatDate(journal.endDate)}`,
      };

    default:
      throw new Error(`État de voyage non reconnu: ${status}`);
  }
};

/**
 * Valide qu'une date est conforme aux contraintes selon le statut du lieu et l'état du voyage
 * @param date - La date à valider (format YYYY-MM-DD)
 * @param isVisited - Si true, le lieu est marqué comme visité
 * @param constraints - Les contraintes de dates du voyage
 * @returns Un objet avec isValid et le message d'erreur éventuel
 */
export const validatePlaceDate = (
  date: string,
  isVisited: boolean,
  constraints: TravelDateConstraints
): { isValid: boolean; errorMessage?: string } => {
  const placeStatus = isVisited ? 'visited' : 'planned';

  // Vérifier si le statut est autorisé pour ce voyage
  if (!constraints.allowedStatuses.includes(placeStatus)) {
    return {
      isValid: false,
      errorMessage: isVisited
        ? 'Vous ne pouvez pas marquer un lieu comme visité pour ce voyage'
        : 'Vous ne pouvez pas planifier de nouveaux lieux pour ce voyage',
    };
  }

  const dateConstraints = isVisited
    ? constraints.visitedDateConstraints
    : constraints.plannedDateConstraints;

  if (!dateConstraints) {
    return {
      isValid: false,
      errorMessage: 'Contraintes de dates non définies pour ce statut',
    };
  }

  if (date < dateConstraints.min) {
    return {
      isValid: false,
      errorMessage: isVisited
        ? 'La date ne peut pas être avant le début du voyage'
        : 'La date ne peut pas être dans le passé',
    };
  }

  if (date > dateConstraints.max) {
    return {
      isValid: false,
      errorMessage: isVisited
        ? "La date ne peut pas être après la fin du voyage ou aujourd'hui"
        : 'La date ne peut pas être après la fin du voyage',
    };
  }

  return { isValid: true };
};

/**
 * Suggère des dates par défaut appropriées selon l'état du voyage et le statut du lieu
 * @param isVisited - Si le lieu est marqué comme visité
 * @param constraints - Les contraintes de dates du voyage
 * @returns Un objet avec startDate et endDate suggérées
 */
export const suggestDefaultDates = (
  isVisited: boolean,
  constraints: TravelDateConstraints
): { startDate: string; endDate: string } => {
  const dateConstraints = isVisited
    ? constraints.visitedDateConstraints
    : constraints.plannedDateConstraints;

  if (!dateConstraints) {
    // Fallback vers la date d'aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    return { startDate: today, endDate: today };
  }

  // Suggérer la première date possible dans la plage autorisée
  const suggestedDate = dateConstraints.min;

  return {
    startDate: suggestedDate,
    endDate: suggestedDate,
  };
};
