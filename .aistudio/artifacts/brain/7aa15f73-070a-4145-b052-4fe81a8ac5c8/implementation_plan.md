# YONYWOOD — ARCHITECTURE & PLAN D'IMPLÉMENTATION
## 1. La Carte à Quatre Visages & 2. Les Stories Coverflow (Page Studio)

Ce document présente l'audit complet du codebase de YonyWood, la modélisation des données, la solution technique d'enchaînement vidéo sans latence et les propositions d'architecture avant tout développement.

---

## 1. Audit de l'architecture actuelle du Feed et du lecteur vidéo

### 1.1 État des lieux de `DuoFeedScreen.tsx`
* **Structure actuelle** :
  * Le Feed fonctionne aujourd'hui sur une liste homogène de type `Duo[]` (`MOCK_DUOS` ou Firestore).
  * La navigation verticale (`currentIndex`) sélectionne un Duo documentaire.
  * La navigation horizontale (`slideIndex`: 0, 1 ou 2) parcourt les 3 séquences d'un même duo :
    - `slideIndex = 0` : Protagoniste A (vidéo solo + titre de la série + prénom).
    - `slideIndex = 1` : Protagoniste B (vidéo solo + titre de la série + prénom).
    - `slideIndex = 2` : Carte de résonance / curseur d'évaluation 0–100 (`ResonanceFaceToFaceCard`).
* **Stories actuelles** :
  * Les bulles en haut du Feed déclenchent une modale `FullscreenStoryViewer.tsx` avec défilement vertical plein écran.
  * L'utilisateur souhaite que le visionnage des stories adopte la présentation en cartes qui se suivent dans l'espace avec perspective 3D, **exactement comme le carrousel de la page Studio** (`SubmitStoryScreen.tsx`, illustré par la capture d'écran).

### 1.2 Points forts réutilisables
* Le moteur de carrousel 3D (`perspective: 1200px`, `transformStyle: preserve-3d`, cartes latérales inclinées à `rotateY(±26deg)` et `translateZ(-60px)`) est déjà parfaitement calibré dans `SubmitStoryScreen.tsx`.
* La synchronisation tactile (swipe horizontal / vertical), les contrôles sonores globaux (`celestialAudio`), et la détection d'orientation sont déjà en place.

---

## 2. Intégration dans les structures de données existantes

Pour intercaler par intermittence les Cartes à quatre visages dans le Feed sans casser la compatibilité avec les Duos, nous unifions le flux d'éléments sous un type polymorphe `FeedPublicationItem`.

```
                        ┌──────────────────────────────────────────────┐
                        │            FeedPublicationItem               │
                        └──────────────────────┬───────────────────────┘
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       ▼                                               ▼
          ┌──────────────────────────┐                   ┌──────────────────────────┐
          │  Type: 'duo'             │                   │  Type: 'four_faces'      │
          │  (Duo documentaire)     │                   │  (Carte 4 visages)       │
          │  - Protagoniste A (≤2m56)│                   │  - 4 Intervenants        │
          │  - Protagoniste B (≤2m56)│                   │  - 4 Séquences × 8s = 32s│
          │  - Curseur 0-100         │                   │  - 1 Question commune    │
          └──────────────────────────┘                   └──────────────────────────┘
```

### 2.1 Interface TypeScript proposée (`src/types.ts`)

```typescript
export interface FourFacesParticipant {
  id: string;
  name: string;
  firstName: string;
  avatarUrl: string;
  videoUrl: string; // Clip calibré à 8 secondes max
  durationSeconds: number; // Max 8s
  role?: string;
  territory?: string;
}

export interface FourFacesPublication {
  id: string;
  type: 'four_faces';
  questionId: string;
  questionTitle: string; // Ex: « Quel est le meilleur conseil que tu aies reçu ? »
  questionIconType: 'courage' | 'conseil' | 'transmission' | 'proverbe' | 'espoir';
  theme: string;
  artStyle: 'mosaic_quad' | 'illustrated_collection'; // Composition visuelle harmonieuse
  posterUrl: string; // Affiche illustrée globale de la carte réunissant les 4 visages
  participants: [
    FourFacesParticipant,
    FourFacesParticipant,
    FourFacesParticipant,
    FourFacesParticipant
  ]; // Strictement 4 personnes
  totalMaxDuration: 32; // 32 secondes
  createdAt: string;
}

export type FeedPublicationItem = 
  | { type: 'duo'; data: Duo }
  | { type: 'four_faces'; data: FourFacesPublication };
```

### 2.2 Règle d'intermittence éditoriale
* Dans le Feed de Dialogue, les cartes à quatre visages s'intercalent selon un rythme prédéfini (ex: 1 Carte 4 visages tous les 3 Duos, ou indexable par thématique commune).
* L'utilisateur glisse verticalement (swipe haut/bas) pour passer naturellement d'un Duo à une Carte à 4 visages, et vice-versa.

---

## 3. Direction artistique de la Carte à Quatre Visages

Conformément à la demande de l'utilisateur et aux principes de cartes illustrées de collection de YonyWood :
* **Format** : Vertical 9:16 unique (`max-w-[320px]`, `rounded-3xl`, bordure subtile, ombre cinéma).
* **Disposition des 4 visages** : 
  * Grille 2×2 intégrée harmonieuse ou médaillons géométriques inspirés des motifs de la carte centrale de la page Studio.
  * Une identité chromatique commune (teintes terre cuite `#A2482B`, or antique `#C89B3C`, bleu nuit et pierre).
* **Animation pendant la lecture** :
  * Pas de 4 vidéos jouées en même temps (interdit par le cahier des charges).
  * Quand la personne N parle (pendant ses 8 secondes) :
    - Son quadrant/visage s'anime en vidéo vivante (ou plein cadre centré avec rappel graphique des 3 autres en médaillons connectés).
    - Une pulsation lumineuse dorée subtile entoure son cadre.
    - Son prénom apparaît discrètement en bas à gauche de la carte.
    - Une jauge segmentée en 4 parties en haut de la carte indique la progression (8s | 8s | 8s | 8s = 32s).
  * À la 8e seconde, transition douce (cross-fade 200ms) vers la personne suivante.

---

## 4. Architecture technique : Synchronisation, Enchaînement & Zéro Latence

Pour garantir une expérience sans coupure ("buffering" ou écran noir entre les 8 secondes) :

```
             ┌─────────────────────────────────────────────────────────────┐
             │       FourFacesCardPlayer (1 seul élément <video>)         │
             └──────────────────────────────┬──────────────────────────────┘
                                            │
        ┌───────────────────────────────────┼───────────────────────────────────┐
        ▼                                   ▼                                   ▼
┌──────────────────┐               ┌──────────────────┐                ┌──────────────────┐
│ Séquence 1 (8s)  │ ──(auto-step)─► Séquence 2 (8s)  │ ──(auto-step)──► Séquence 3 & 4   │
│ Personne 1       │               │ Personne 2       │                │ Personnes 3 & 4  │
└──────────────────┘               └──────────────────┘                └──────────────────┘
        │                                   │                                   │
        ▼                                   ▼                                   ▼
 [Précharge clip 2]                  [Précharge clip 3]                  [Fin publication]
```

1. **Double tampon vidéo ou Préchargement Anticipé (Pre-buffering)** :
   - Dès que la carte 4 visages entre dans le viewport, les clips des 4 intervenants (ou la vidéo montée enchaînée des 4 fois 8s) sont préchargés dans le cache du navigateur (`preload="auto"`).
2. **Technique de lecture fluide** :
   - *Option A (Master Video unifiée avec chapitrage)* : La vidéo de 32 secondes est un master unique assemblant les 4 voix avec marqueurs temporels `[0-8s, 8-16s, 16-24s, 24-32s]`. C'est la solution la plus fluide et exempte de tout hoquet réseau.
   - *Option B (4 sources distinctes avec bascule sur `onEnded` / `timeupdate`)* : Si les sources restent 4 fichiers distincts, un système de double `<video>` cachée alterne de l'une à l'autre sans latence d'initialisation.
3. **Plafond strict de 8s par intervention & 32s au total** :
   - Un `setInterval` ou `requestAnimationFrame` garantit le passage automatique à la personne suivante exactement au cap des 8 secondes (ou à la fin naturelle du clip si $\le 8s$).
   - À 32 secondes, la publication affiche un badge discret de fin et invite à poursuivre le défilement dans le Feed.

---

## 5. Mode Stories révisé (Carrousel 3D comme sur la page Studio)

Pour répondre à la demande : *"Lorsque l'on clique sur les stories, j'aimerais qu'elles apparaissent les unes après les autres de la façon suivante, comme sur la page studio... au maximum 64 secondes... pas de bouton de navigation ni de texte... juste une icône pour la question et le prénom en bas à gauche"*.

### 5.1 Caractéristiques du nouveau composant `StoriesStudioCarousel`
* **Disposition spatiale** :
  - Identique à la capture d'écran de la page Studio : scène 3D avec carte centrale mise en avant (`scale(1)`, contour doré illuminé) et cartes adjacentes inclinées en perspective (`rotateY(±26deg)`).
  - Défilement par swipe horizontal ou clic sur les cartes latérales pour amener la suivante au centre.
* **Plafond strict de durée** :
  - Enregistré à 64 secondes maximum.
  - Barre de progression linéaire en haut de la carte calibrée sur 64 secondes maximum.
* **Épure visuelle totale** :
  - **Aucun texte descriptif** ni titre de catégorie verbeux au centre.
  - **Prénom seul en bas à gauche** (ex: « Amina », « Koffi ») dans une typographie fine et soignée.
  - **Une seule icône discrète en haut à droite** symbolisant la question/thème (au survol ou tap, affiche un tooltip minimaliste de la question).
  - Bouton Télé ou tap direct sur la carte pour play/pause.
* **Passerelle de retour au mode publication classique (Duos)** :
  - Un bouton d'action épuré en haut (ou flèche élégante « Revenir aux duos » / « Quitter ») pour fermer instantanément le carrousel et retrouver le Feed de duos exactement au bon endroit.
  - Option d'avancement direct vers le duo de l'auteur concerné.

---

## 6. Synthèse comparative des 3 formats du Feed

| Format | Durée Maximale | Composition Visuelle | Récit & Protagonistes | Commandes & Navigation |
| :--- | :--- | :--- | :--- | :--- |
| **Duo Documentaire** | 2 min 56 | 1 carte 9:16 centrale, 3 séquences horizontales | 2 protagonistes face-à-face sur la même question + curseur 0-100 | Swipe horizontal (séquences) / vertical (changer de duo) |
| **Carte à Quatre Visages** | 32 secondes (4 × 8s) | 1 carte 9:16 à 4 visages / composition de collection | 4 personnes successives répondant à la même question | Enchaînement automatique des 4 voix, swipe vertical pour continuer |
| **Stories (Studio Coverflow)** | 64 secondes | Carrousel 3D de cartes verticales (comme page Studio) | 1 personne par story (thématique généraliste) | Carte centrale active, prénom en bas à gauche, icône question en haut à droite, retour direct au duo |

---

## 7. Plan d'exécution par étapes (une fois validé)

1. **Phase 1 : Données & Types**
   - Créer `src/data/fourFacesFeedData.ts` contenant les publications modèles à 4 visages avec questions éditoriales fortes (Courage, Transmission, Proverbe, Meilleur conseil).
   - Déclarer les types `FourFacesPublication` et `FeedPublicationItem` dans `src/types.ts`.
2. **Phase 2 : Composant `FourFacesCard`**
   - Créer le composant de carte 9:16 à 4 visages avec enchaînement automatique des 4 séquences de 8 secondes (timer max 32s, indicateur 4 segments, highlight dynamique du visage qui parle).
   - Intégrer par intermittence dans `DuoFeedScreen.tsx`.
3. **Phase 3 : Révision du visionnage des Stories en carrousel Studio 3D**
   - Remplacer le visualiseur vertical classique par le carrousel 3D de cartes (reprenant la géométrie de `SubmitStoryScreen.tsx`).
   - Appliquer la règle des 64 secondes max, du prénom en bas à gauche et de l'icône de question seule en haut à droite, avec le bouton de retour au mode duos.
4. **Phase 4 : Tests & Vérification**
   - Vérifier la fluidité des transitions vidéo, la non-régression sur mobile et desktop, et la compilation complète.
