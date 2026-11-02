# Évolution du Triptyque des Duos & Refonte de la Carte d'Évaluation 3 Critères

Ce plan propose une refonte architecturale et visuelle des Duos documentaires pour résoudre le manque de lisibilité du diaporama (triptyque Protagoniste A / Évaluation / Protagoniste B) en s'inspirant du carrousel 3D du Studio, tout en modernisant la carte d'évaluation avec 3 critères interactifs indépendants (Résonance, Authenticité, Impact).

---

## Synthèse des Décisions & Choix Proposés

> [!IMPORTANT]
> **Choix de l'ordonnancement du triptyque en 3D** :
> Pour que l'utilisateur comprenne instantanément qu'un duo est composé de 3 volets interconnectés, l'affichage adopte la disposition spatiale 3D :
> 1. **Carte Gauche (Volet 1)** : Vidéo / Histoire du Protagoniste A
> 2. **Carte Centrale (Volet 2)** : Carte d'évaluation & résonance partagée
> 3. **Carte Droite (Volet 3)** : Vidéo / Histoire du Protagoniste B
>
> *(Option complémentaire retenue)* : Sur chaque carte vidéo, l'icône de permutation générique est remplacée par la **pastille photo du protagoniste miroir**, avec un bouton discret d'évaluation (icône Médaille / Award) en bas en face du prénom pour un accès direct.

---

## 1. Vue d'Ensemble & Expérience Utilisateur

### Problème résolu
- **Compréhension du diaporama** : Une carte unique isolée ne permettait pas de deviner qu'un duo est un ensemble de 3 volets liés (A, B et leur résonance).
- **Encombrement de la carte d'évaluation** : Le bouton « ← Vidéo » surchargeait le haut, les vignettes étaient trop basses au centre, et un curseur unique avec prénoms répétés limitait la finesse du vote.

### Nouvelle expérience
1. **Carrousel 3D immersif (Style Studio Coverflow)** :
   - Les 3 cartes du duo s'organisent dans l'espace avec profondeur et perspective (carte active au premier plan, cartes adjacentes légèrement inclinées et visibles sur les bords).
   - L'utilisateur peut glisser horizontalement pour passer d'une carte à l'autre, ou swiper verticalement pour changer de publication dans le feed.
2. **Accès direct & micro-navigation** :
   - Sur la carte A : une pastille circulaire arborant le visage de B permet de basculer directement sur sa vidéo.
   - En bas, à côté ou en face du prénom : un bouton icône « Évaluation » (Award) donne un accès instantané au volet de résonance.
3. **Carte d'Évaluation 3 Critères épurée** :
   - **Retrait du bouton « ← Vidéo »** : le retour se fait naturellement par swipe ou clic sur la carte adjacente.
   - **Vignettes remontées en haut** : les portraits de A et B trônent en haut de la carte avec leur prénom et une aura de couleur (Terracotta `#A2482B` pour A, Ambre `#C89B3C` pour B).
   - **3 Curseurs de Balance interactifs** :
     - **1. Résonance** : Harmonie et écho émotionnel entre les deux vérités.
     - **2. Authenticité** : Sincérité du parcours, ancrage culturel et vérité du témoignage.
     - **3. Impact** : Puissance de transmission, inspiration et force motrice pour la communauté.
   - Chaque curseur affiche le pourcentage dynamique (ex. 60% A / 40% B) sans répéter les noms sur la barre, avec un point central à 50% et une jauge bicolore très fluide.

---

## 2. Architecture & Composants

```
┌────────────────────────────────────────────────────────┐
│                   DuoFeedScreen                        │
│                                                        │
│   ┌────────────────────────────────────────────────┐   │
│   │   Carrousel 3D Triptyque (Perspective / CSS)   │   │
│   │                                                │   │
│   │   ┌──────────────┐ ┌──────────────┐ ┌────────┐ │   │
│   │   │ Carte A      │ │ Évaluation   │ │Carte B │ │   │
│   │   │ Protagoniste │ │ 3 Critères   │ │Protagon│ │   │
│   │   │              │ │              │ │        │ │   │
│   │   │ [Vignette B] │ │ [A]      [B] │ │[Vign.A]│ │   │
│   │   │ [Award]      │ │ 1.Résonance  │ │[Award] │ │   │
│   │   │              │ │ 2.Authentic. │ │        │ │   │
│   │   │              │ │ 3.Impact     │ │        │ │   │
│   │   └──────────────┘ └──────────────┘ └────────┘ │   │
│   └────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

### Détail des Composants Impactés

1. **`src/components/ResonanceFaceToFaceCard.tsx`** :
   - Suppression du bouton `← Vidéo`.
   - Réduction et repositionnement des vignettes de portraits dans le tiers supérieur.
   - Intégration d'un état à 3 critères :
     ```typescript
     interface EvaluationCriteria {
       resonance: number;     // 0-100 (défaut 50)
       authenticity: number;  // 0-100 (défaut 50)
       impact: number;        // 0-100 (défaut 50)
     }
     ```
   - Rendu de 3 sliders épurés sans répétition de nom, avec micro-labels discrets et pourcentages colorés.

2. **`src/components/DuoFeedScreen.tsx`** :
   - Configuration du mode d'affichage carrousel 3D avec 3 positions :
     - Index 0 : Protagoniste A (Gauche)
     - Index 1 : Volet Évaluation (Centre)
     - Index 2 : Protagoniste B (Droite)
   - Remplacement de l'icône de permutation par l'avatar de l'autre protagoniste.
   - Ajout du bouton d'évaluation avec icône Award élégante près du prénom.
   - Prise en charge des clics sur les cartes adjacentes visibles pour les amener au premier plan.

3. **`src/utils/textFormatters.ts`** *(déjà corrigé)* :
   - Conservation du typage et de la casse des titres de séries de duo avec séparateurs (`Vodun Rays ‹ › Autre Foi`).

---

## 3. Critères d'Évaluation Proposés

| Critère | Description & Rôle | Teinte d'Accent |
| :--- | :--- | :--- |
| **1. Résonance** | Mesure l'écho philosophique et l'alchimie entre les deux visions du monde. | Terracotta & Ambre solaire |
| **2. Authenticité** | Évalue la sincérité, la vérité vécue et l'enracinement dans le réel. | Ocre terre & Sable doré |
| **3. Impact** | Mesure la portée inspirante, la force d'action et la transmission collective. | Bronze profond & Or éclatant |

---

## 4. Plan d'Exécution par Étapes

- **Étape 1 : Refonte de `ResonanceFaceToFaceCard.tsx`**
  - Retrait du bouton `← Vidéo`.
  - Élévation des deux portraits en partie haute.
  - Implémentation des 3 curseurs (Résonance, Authenticité, Impact) avec pourcentages en direct et design sans texte superflu.
- **Étape 2 : Implémentation du Carrousel 3D dans `DuoFeedScreen.tsx`**
  - Intégration du layout 3D (perspective, scale, translation) pour laisser entrevoir les 3 volets du triptyque (A, Évaluation, B).
  - Remplacement de l'icône de changement par la vignette photo du second protagoniste.
  - Ajout du bouton d'évaluation Award en bas de la carte vidéo.
- **Étape 3 : Validation & Compilation**
  - Vérification de la fluidité des interactions tactiles et desktop.
  - Exécution de `compile_applet` et `lint_applet`.
