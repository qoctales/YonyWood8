# Arbre Généalogique de Lignée — Frise Verticale & Branches Horizontales à 3 Voix

Remplacement complet de la constellation sombre par un **arbre généalogique épuré sur fond blanc/ivoire**, combinant un tronc vertical d'ascendance et des branches horizontales de 3 alvéoles côte à côte avec interaction progressive en deux clics.

## User Review & Critical Decisions

> [!IMPORTANT]
> Décisions arrêtées directement avec vous :
> - **Abandon de la constellation sombre 2D** : Retour au design épuré, lumineux et muséal sur fond blanc / pierre naturelle (`bg-[#FCFBF7]`).
> - **3 personnes par niveau (limite stricte à 3)** : Chaque entité fait apparaître directement sous elle une branche horizontale reliant **3 alvéoles côte à côte** (individus ou organisations).
> - **Interaction en 2 étapes** :
>   - **1er clic sur un visage** : Active le coopté et déploie sa propre descendance (ses 3 alvéoles) à l'étage inférieur.
>   - **2ème clic** : Ouvre immédiatement sa carte vidéo immersive format Héritage (avec résonance, question et crédits).
> - **Structure arborescente lisible** : Tronc d'ascendance verticale au-dessus, nœud actif au centre, et branche horizontale descendante en T reliant les 3 enfants.

## 1. Overview & Core Concept

- **What It Does** : Présente la lignée comme un véritable arbre généalogique lisible. L'utilisateur voit d'où vient la personne (chaîne ascendante verticale au-dessus), qui elle a fait entrer (3 alvéoles présentées côte à côte sur une même ligne horizontale en dessous reliées par une branche), et peut explorer récursivement les branches de génération en génération.
- **Target Audience / Persona** : Visiteurs, membres et organisations souhaitant comprendre immédiatement les relations de parrainage sans complexité spatiale.
- **Key Value** : Une clarté visuelle absolue sur fond clair, où la hiérarchie des générations (verticale) et la fratrie des cooptés (horizontale à 3) se lisent en un coup d'œil naturel.

## 2. User Experience & Visual Design

### Key User Flows
1. **Ouverture de la lignée** : L'utilisateur clique sur l'icône Lignée depuis le profil ou la page entreprise.
2. **Visualisation de l'arbre** :
   - Au-dessus : Le fil d'ascendance vertical (les parrains successifs jusqu'au fondateur, reliés par la ligne dorée miel `#C89B3C`).
   - Au centre : Le membre sélectionné (Roméo, Camille ou l'organisation), mis en majesté avec halo chaud.
   - En-dessous : Une branche horizontale élégante en terre cuite (`#A2482B`) qui se déploie et soutient **3 alvéoles côte à côte**.
3. **Exploration récursive** :
   - L'utilisateur clique sur l'une des 3 alvéoles horizontales : cette personne devient la sélection active, son alvéole s'illumine, et ses 3 propres cooptés apparaissent en dessous sur une nouvelle branche horizontale.
   - Un second clic sur la même personne ouvre sa carte vidéo plein écran au format Héritage.
4. **Remontée / navigation** : L'utilisateur peut cliquer sur n'importe quel ascendant au-dessus pour remonter d'un cran dans l'arbre.

### Visual Identity & Theme
- **Fond** : Blanc ivoire / pierre chaude lumineuse (`#FCFBF7` et `#F7F5F0`), aucun fond sombre cosmique.
- **Lignes d'arborescence** :
  - Tronc ascendant : Ligne verticale or antique chaud (`#C89B3C`, 2.5px).
  - Branche descendante : Embranchement en T terre cuite noble (`#A2482B`, 2.5px), reliant les 3 nœuds enfants avec des raccords arrondis.
- **Nœuds & Alvéoles** :
  - **Individus** : Hexagone ciselé avec photo de profil découpée.
  - **Organisations** : Carré adouci avec icône `Building2` dorée et nom de l'entreprise.
  - **Fondateurs** : Double liseré terre cuite distinctif.
- **Indicateur épuré** : Badge supérieur discret `3 Voix de transmission · Filiation directe`.

## 3. Key Product Decisions & Trade-Offs

- **Retrait du composant `LineageNetworkCanvas` & du switcher Frise/Constellation** :
  - *Approche choisie* : Simplification radicale en supprimant la vue constellation sombre et le sélecteur d'onglets pour offrir une expérience unifiée et sans friction.
  - *Raison* : Correspond exactement à la demande de l'utilisateur ("on oublie la constellation 2D, on reste sur la frise verticale... sur fond blanc").
- **Limite stricte à 3 descendants par branche** :
  - *Approche choisie* : Calibrer le générateur de descendance à exactement 3 personnes ou organisations majeures par niveau.
  - *Raison* : Permet d'afficher les 3 nœuds côte à côte sans dépassement d'écran sur mobile, avec une largeur idéale et une lisibilité parfaite.
- **Comportement 1er clic (déploiement) vs 2ème clic (vidéo)** :
  - *Approche choisie* : Gestion d'un état `expandedChildId` et `selectedMemberId`. Un clic sur un enfant non sélectionné le sélectionne et déplie sa branche en dessous ; un clic sur l'enfant déjà sélectionné ouvre sa carte vidéo.

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                 ProfileLineageFrise                         │
│                 (Fond clair #FCFBF7)                        │
├─────────────────────────────────────────────────────────────┤
│ 1. Tronc Ascendant Vertical (Or #C89B3C)                    │
│    [Fondateur Racine]                                       │
│          │                                                  │
│    [Grand-Parrain]                                          │
│          │                                                  │
│    [Parrain Direct]                                         │
│          │                                                  │
│ 2. Membre Courant / Nœud Actif                              │
│    ★ [Roméo Nonvide] (Hexagone agrandi avec liseré or)     │
│          │                                                  │
│ 3. Branche Horizontale en T (Terre cuite #A2482B)           │
│    ┌─────┴─────────────────────────────────────┐            │
│    │     Ligne de jonction horizontale         │            │
│    ▼                     ▼                     ▼            │
│ [Enfant 1]           [Enfant 2]            [Enfant 3]       │
│ (1er clic: focus)    (1er clic: focus)     (1er clic: focus)│
│ (2e clic: vidéo)     (2e clic: vidéo)      (2e clic: vidéo) │
│                          │                                  │
│ 4. Sous-Branche Déployée au clic d'un Enfant               │
│    ┌─────────────────────┴─────────────┐                    │
│    ▼                     ▼             ▼                    │
│ [Petit-Enfant 1]   [P.-E. 2]       [P.-E. 3]                │
└─────────────────────────────────────────────────────────────┘
```

### Components & Handlers to Create / Update:
1. `src/components/ProfileLineageFrise.tsx` :
   - Nettoyage du switcher de vue (suppression de l'onglet Constellation 2D).
   - Intégration du composant d'embranchement horizontal : rendu des 3 enfants côte à côte sur la ligne avec ligne de connexion en T.
   - Rendu de la sous-branche si l'un des 3 enfants est activé.
   - Logique de double clic (1er clic déplie/centre, 2ème clic ouvre la carte vidéo Héritage).
   - Fond clair cohérent avec le reste des profils (`bg-[#FCFBF7]`).
2. `src/utils/lineageService.ts` :
   - Mise à jour de `getLineageTree` et de la génération des descendants pour garantir une fratrie équilibrée de 3 voix par branche, mélangeant individus et organisations.
3. Suppression du fichier inutile `src/components/LineageNetworkCanvas.tsx` pour alléger le codebase.
