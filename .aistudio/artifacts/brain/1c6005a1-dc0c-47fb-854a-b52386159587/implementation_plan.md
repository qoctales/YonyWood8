# Studio Yonywood — Rotation 3D & Cartes Vidéo Thématiques des 4 Piliers

Intégration épurée des 4 piliers du Studio (Duos en miroir, Sur les routes, Organisation, Récit de soi) sous la forme du carrousel rotatif 3D « jeu vidéo » existant, avec des illustrations afro-modernes colorées au trait fin et sans rôles superflus.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Ajustements confirmés suite à votre retour :**
> - **Maintien strict de la rotation 3D des cartes :** Le système de défilement immersif en rotation 3D façon sélection de jeu vidéo sur la page Studio est conservé et sublimé.
> - **Organisation = 8 thématiques pures :** Retrait complet des 4 rôles référents dans le Studio. Seules les 8 cartes thématiques (Origines, Valeurs, Quotidien, Épreuves, Rencontres, Impact, Transmission, Avenir) défilent dans la rotation 3D du pilier Organisation.
> - **Alignement identique des 4 piliers :**
>   1. *Duos en miroir* : les 8 cartes de séries (Vodun Rays <> Autre Foi, Bénin <> Le Monde, Roots <> Routes, Builders <> Seekers, Pictures <> PhD, Blacks One <> Beyond Eve, Other Sights <> Third Eye, Fiat Luxe <> Sweet Street).
>   2. *Sur les routes* : les 8 cartes de catégories (Sagesses, Territoires, Expertises, Personnalités, Épreuves, Produits et services, Projets, Liens).
>   3. *Organisation* : les 8 cartes thématiques (Origines, Valeurs, Quotidien, Épreuves, Rencontres, Impact, Transmission, Avenir).
>   4. *Récit de soi* : les 4 cartes de directions (Parcours de vie, Produits et services, Projets, Besoins et opportunités).
> - **Épure visuelle des cartes :** Seul le titre de la catégorie / thématique apparaît en haut à gauche, la petite télé en haut à droite, l'illustration centrale afro-moderne au trait fin, et la question d'accroche en bas.

---

## 1. Overview & Core Concept

Le Studio permet à chaque utilisateur d'explorer de manière ludique et fluide les portes d'entrée de création de récits :
- Au premier niveau : choix immédiat parmi les 4 piliers fondamentaux.
- Au second niveau : défilement en rotation 3D des cartes du pilier choisi, avec la possibilité d'écouter le son céleste à chaque bascule, de lancer un extrait vidéo teaser via la petite télé, ou de démarrer la proposition d'histoire.

---

## 2. User Experience & Visual Design

### Rotation 3D « Jeu Vidéo »
- **Effet Coverflow 3D fluide :** Carte active centrale mise en valeur (scale 1.0, opacité 1, ombre cinématographique), cartes adjacentes inclinées et estompées (scale 0.82, rotateY, opacité 0.5), défilement tactile au swipe ou via les flèches latérales.
- **Retour tactile & audio :** Transition instantanée accompagnée du son noble `celestialAudio.playOrbSelect()`.

### Structure d'une Carte Vidéo (Format 9:16)
- **Haut gauche :** Titre épuré de la thématique ou de la série (typographie soignée, sans boîte pill encombrante).
- **Haut droite :** Bouton « Petite Télé » pour lancer la vidéo en boucle avec fond sonore.
- **Centre :** Illustration afro-moderne colorée au trait fin, inspirée du style de l'affiche *Récit de soi* (femme souriante), lumineuse et expressive.
- **Bas :** Question directrice et bouton clair « Choisir ce thème » / « Proposer ».

---

## 3. Key Product Decisions & Trade-Offs

- **Décision 1 : Rotation 3D exclusive au Studio**
  - *Choix :* Maintenir la cinématique 3D rotative uniquement sur le Studio, pour offrir un ressenti de borne interactive / sélection de personnage de jeu vidéo.
  - *Raison :* Dynamise l'acte de création et engage l'utilisateur sans rompre avec le minimalisme des autres pages.
- **Décision 2 : Suppression totale des rôles dans le Studio**
  - *Choix :* L'espace Organisation présente directement les 8 thématiques sans filtre préalable de rôle.
  - *Raison :* Fluidité d'accès immédiate réclamée par l'utilisateur.

---

## 4. Technical Architecture & Data Strategy

### System Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        STUDIO (SubmitStoryScreen)                      │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   [ Duos en miroir (8) ] [ Sur les routes (8) ]                        │
│   [ Organisation   (8) ] [ Récit de soi   (4) ]                        │
│                                                                        │
│                    ROTATION 3D (Coverflow Effect)                      │
│                                                                        │
│          ┌──────────┐       ┌──────────────┐       ┌──────────┐        │
│          │          │       │  CARTE 9:16  │       │          │        │
│          │  Prev    │  ◀──  │    ACTIVE    │  ──▶  │   Next   │        │
│          │ (angleY) │       │ (Titre haut) │       │ (angleY) │        │
│          │          │       │ (Illustr.)   │       │          │        │
│          └──────────┘       └──────────────┘       └──────────┘        │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      src/data/studioPillarsData.ts                     │
│                                                                        │
│   - Duos en miroir   : 8 séries en diptyque                            │
│   - Sur les routes   : 8 catégories patrimoniales                      │
│   - Organisation     : 8 thématiques pures                             │
│   - Récit de soi     : 4 directions de portrait                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Plan d'Exécution Validé

1. **Restructuration complète de `studioPillarsData.ts` :**
   - Configurer les 4 piliers avec leurs intitulés officiels.
   - Injecter les 8 séries de Duos, les 8 catégories d'Héritages, les 8 thématiques d'Organisation et les 4 directions de Récit de soi.
   - Associer à chaque carte son illustration afro-moderne colorée au trait fin et sa question officielle.
2. **Optimisation de la rotation 3D dans `SubmitStoryScreen.tsx` :**
   - Garantir la fluidité de la rotation 3D des cartes pour chaque pilier.
   - Épurer l'overlay des cartes : titre en haut à gauche, petite télé en haut à droite, pas de pills de métadonnées.
3. **Vérification & Validation :**
   - Compiler et vérifier l'absence d'erreurs TypeScript.
   - Valider la réactivité sur mobile et desktop.
