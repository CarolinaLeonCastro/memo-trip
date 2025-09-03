# Guide de Test - Logique Temporelle des Voyages

## 🎯 Objectif

Valider le comportement de l'ajout de lieu selon les 3 états temporels du voyage :

- **Voyage Futur** : Uniquement planification possible
- **Voyage En Cours** : Visités (passé) + Planifiés (futur) possibles
- **Voyage Passé** : Uniquement lieux visités possible

## 📋 Scénarios de Test

### Cas 1 : Voyage Futur

**Exemple** : Journal du 17-20 septembre 2025 (testé le 3 septembre 2025)

**Comportement attendu :**

- ✅ Message : "Ce voyage est futur. Vous pouvez seulement planifier vos visites."
- ✅ Statut disponible : Uniquement "📅 Je planifie visiter ce lieu"
- ✅ Dates autorisées : Entre 17/09/2025 et 20/09/2025
- ❌ Statut "Visité" désactivé

**Test :**

1. Créer un journal avec dates futures
2. Aller sur "Ajouter un lieu"
3. Sélectionner ce journal
4. Vérifier l'alerte orange et les contraintes

---

### Cas 2 : Voyage En Cours

**Exemple** : Journal du 1-5 septembre 2025 (testé le 3 septembre 2025)

**Comportement attendu :**

- ℹ️ Message : "Ce voyage est en cours. Vous pouvez ajouter vos visites passées et planifier celles à venir."
- ✅ Statuts disponibles : Les deux choix actifs
  - "✅ J'ai visité ce lieu" → dates entre 01/09/2025 et 03/09/2025 (aujourd'hui max)
  - "📅 Je planifie visiter ce lieu" → dates entre 03/09/2025 (aujourd'hui min) et 05/09/2025

**Test :**

1. Créer un journal incluant la date d'aujourd'hui
2. Tester les deux statuts et vérifier les contraintes de dates

---

### Cas 3 : Voyage Passé

**Exemple** : Journal du 15-25 août 2024 (testé le 3 septembre 2025)

**Comportement attendu :**

- ✅ Message : "Ce voyage est terminé. Vous pouvez seulement enregistrer les lieux visités."
- ✅ Statut disponible : Uniquement "✅ J'ai visité ce lieu"
- ✅ Dates autorisées : Entre 15/08/2024 et 25/08/2024
- ❌ Statut "Planifié" désactivé

**Test :**

1. Créer un journal avec dates passées
2. Vérifier l'alerte verte et les contraintes

## 🔧 Validation Technique

### Fonctions à Tester

1. **`getTravelStatus(journal)`**

   ```typescript
   // Voyage futur
   expect(getTravelStatus(futureJournal)).toBe('future');

   // Voyage en cours
   expect(getTravelStatus(ongoingJournal)).toBe('ongoing');

   // Voyage passé
   expect(getTravelStatus(pastJournal)).toBe('past');
   ```

2. **`validatePlaceDate(date, isVisited, constraints)`**

   ```typescript
   // Pour voyage futur + lieu visité = invalide
   expect(
     validatePlaceDate('2025-09-18', true, futureConstraints).isValid
   ).toBe(false);

   // Pour voyage en cours + lieu visité + date future = invalide
   expect(
     validatePlaceDate('2025-09-04', true, ongoingConstraints).isValid
   ).toBe(false);
   ```

3. **`suggestDefaultDates(isVisited, constraints)`**
   - Vérifier que les dates suggérées respectent les contraintes
   - Tester les cas limites (premier/dernier jour du voyage)

## 🎨 Interface Utilisateur

### Éléments à Vérifier

1. **Alerte d'information**
   - Couleur appropriée (orange/bleu/vert)
   - Message explicite selon l'état

2. **Contrôles de statut**
   - Radio buttons vs message en lecture seule
   - Désactivation appropriée des options

3. **Champs de dates**
   - Contraintes min/max respectées
   - Messages d'aide informatifs
   - Désactivation si statut non autorisé

4. **Validation en temps réel**
   - Messages d'erreur explicites
   - Prévention de la soumission si données invalides

## 🐛 Cas Limites à Tester

1. **Voyage d'un jour**
   - Aujourd'hui = date de début = date de fin
   - Vérifier le comportement "en cours"

2. **Changement de statut dynamique**
   - Passer de "Visité" à "Planifié" et vérifier l'ajustement des dates
   - Vérifier que les dates se réinitialisent appropriément

3. **Journal sans dates**
   - Fallback vers le comportement par défaut
   - Aucune contrainte appliquée

4. **Voyage très long (plusieurs mois)**
   - Performance des calculs de dates
   - Plages de dates étendues

## ✅ Checklist de Validation

- [ ] Voyage futur : Seule planification autorisée
- [ ] Voyage en cours : Deux statuts avec bonnes contraintes
- [ ] Voyage passé : Seule visite rétrospective autorisée
- [ ] Messages d'alerte appropriés
- [ ] Contraintes de dates respectées
- [ ] Suggestions de dates par défaut correctes
- [ ] Interface réactive aux changements
- [ ] Validation côté client fonctionnelle
- [ ] Cas limites gérés proprement
