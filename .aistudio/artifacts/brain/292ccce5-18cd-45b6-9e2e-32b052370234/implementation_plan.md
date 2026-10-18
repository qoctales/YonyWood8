# Harmonisation universelle du déclencheur « Petite Télé » et de l'icône Profil sur les cartes vidéo

Ce plan définit le déploiement cohérent et universel du déclencheur de lecture vidéo « Petite Télé » en haut à droite et la standardisation de l'icône Profil officielle sur l'ensemble des cartes vidéo de l'application YonyWood.

---

## Synthèse des décisions validées

> [!IMPORTANT]
> **Décisions confirmées avec l'utilisateur :**
> 1. **Icône Profil immuable** : L'icône profil officielle est celle qui figure déjà dans la barre de navigation principale (`ProfileSoloIcon`). Elle reste strictement celle-ci et doit apparaître sur toutes les cartes vidéo pour ouvrir le profil de la personne (aucune création d'icône profil alternative).
> 2. **Déploiement universel du déclencheur Télé de lecture** : La « petite télé » en haut à droite devient le déclencheur de lecture standardisé sur **toutes les pages** (Héritages, Studio, Productions, Entreprises, Duos, et démos de l'accueil).
> 3. **Composant natif `TvPlayerIcon`** : Création d'un composant vectoriel dédié dans `YonywoodBrandIcons.tsx` dessinant nativement la petite télé vintage avec ses antennes orientées vers le haut et son écran caractéristique, évitant les inversions CSS et assurant un rendu géométrique net sur tous les formats d'écrans.

---

## 1. Vue d'ensemble & Ergonomie des cartes vidéo

Chaque carte vidéo au ratio 9:16 (verticale) respecte désormais une anatomie stricte et uniforme à travers toute la plateforme :

```
┌────────────────────────────────────────────────────────┐
│  [Badge Catégorie / Série]             [Petite Télé 📺] │ <- Déclencheur lecture (Haut droit)
│                                                        │
│                                                        │
│                                            [Médaille]  │ <- Évaluation Résonance
│                                            [Livre]     │ <- Question existentielle
│                                            [Profil 👤] │ <- Profil officiel (ProfileSoloIcon)
│                                            [Partager]  │ <- Partage lien direct
│                                                        │
│  [Prénom du Protagoniste / Entreprise]                 │ <- Typographie signature
└────────────────────────────────────────────────────────┘
```

- **Déclencheur de lecture (Haut à droite)** :
  - **État au repos** : Icône vectorielle « Petite Télé » (`TvPlayerIcon`), boîtier vintage avec ses antennes orientées vers le haut et ses points de mire.
  - **État en cours de lecture** : Icône `<Pause />` épurée pour suspendre la vidéo d'un clic.
  - **Style du conteneur** : Bouton rond ou squircle sombre en verre dépoli (`bg-black/45 border border-white/20 hover:bg-[#A2482B] text-white backdrop-blur-md`).
- **Flanc droit (Actions contextuelles)** :
  - Dès lors qu'une carte vidéo correspond à une voix ou un protagoniste, le 3ᵉ bouton d'action affiche **systématiquement l'icône Profil officielle** (`ProfileSoloIcon`), identique à celle de la barre de navigation du bas, menant à sa page profil complète.

---

## 2. Déploiement page par page

### A. Page Héritages (`SwipeModeHeritage.tsx` & modales)
- **Étape 3 (Protagonistes — ex: Mahougnon)** :
  - Déclencheur en haut à droite : Utilisation de `TvPlayerIcon` native (remplaçant la rotation inversée).
  - Flanc droit : Confirmation de `ProfileSoloIcon` pour le profil de la personne, avec ses compagnons (Résonance, Question, Partager).
- **Étapes 1 et 2 (Portes et Directions)** :
  - Remplacement de tout bouton play disparate par le même bouton en haut à droite avec `TvPlayerIcon`.

### B. Page Duos / Duocumentaires (`DuoFeedScreen.tsx`)
- Cartes Duo A et B (vue côte à côte) : Déclencheur en haut à droite avec `TvPlayerIcon` et `<Pause />` dynamique.
- Cartes plein écran A et B : Déclencheur en haut à droite avec `TvPlayerIcon`.
- Flanc droit des deux cartes : Maintien strict de l'icône Profil officielle `ProfileSoloIcon` pour ouvrir l'univers de chaque protagoniste.

### C. Page Entreprises (`CompanyHeritageScreen.tsx`)
- **Carte principale de l'entreprise** : Remplacement du déclencheur par le bouton en haut à droite avec `TvPlayerIcon`.
- **Espace Entreprise Dédié (Carrousel des voix : fondateur, collaborateurs, clients)** :
  - Chaque carte individuelle de membre bénéficie en haut à droite de `TvPlayerIcon` pour lancer sa capsule vidéo.
  - Ajout sur le flanc droit de l'icône Profil `ProfileSoloIcon` permettant de consulter le profil individuel du protagoniste / fondateur.

### D. Page Productions (`DocumentariesListScreen.tsx` & `DocumentaryDetailScreen.tsx`)
- Remplacement des icônes play triangulaires génériques sur les fiches et teasers vidéo par le bouton signature `TvPlayerIcon` en haut à droite.
- Présence de `ProfileSoloIcon` sur les fiches protagonistes liées à la série.

### E. Page Studio (`SubmitStoryScreen.tsx`, `RequestVideographerScreen.tsx`, `CreatorVideoHistory.tsx`)
- Harmonisation des cartes vidéo de démonstration de cadreurs, des formats d'histoires et des aperçus vidéos avec le déclencheur `TvPlayerIcon` en haut à droite.

### F. Sections Landing / Démo d'accueil (`DemoDuocumentairesSection`, `DemoEntrepriseSection`, `DemoProductionsSection`, `DemoStudioSection`)
- Harmonisation identique pour garantir une fidélité absolue entre les sections de démonstration et les pages interactives de l'application.

---

## 3. Architecture technique & Composants

```
┌─────────────────────────────────────────────────────────────────┐
│                    YonywoodBrandIcons.tsx                       │
│  ├─ ProfileSoloIcon (Icône Profil officielle - Menu & Flanc)    │
│  ├─ TvPlayerIcon (Icône Déclencheur Lecture « Petite Télé »)    │
│  └─ DuocumentairesTvIcon (Icône Double TV - Menu Navigation)    │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Cartes Vidéo 9:16                            │
│  ├─ SwipeModeHeritage.tsx (Étape 3 Protagonistes)               │
│  ├─ DuoFeedScreen.tsx (Cartes A & B)                            │
│  ├─ CompanyHeritageScreen.tsx (Entreprise & Voix membres)       │
│  ├─ DocumentaryDetailScreen.tsx (Capsules Productions)          │
│  └─ SubmitStoryScreen.tsx (Aperçus Vidéo Studio)                │
└─────────────────────────────────────────────────────────────────┘
```

- **Définition de `TvPlayerIcon`** :
  ```tsx
  export const TvPlayerIcon: React.FC<IconProps> = ({ 
    className = 'w-5 h-5',
    strokeWidth = 1.55 
  }) => {
    return (
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
        aria-hidden="true"
      >
        {/* Boîtier télévision vintage avec angles adoucis */}
        <rect x="5.5" y="7.5" width="13" height="11" rx="2.5" />
        {/* Deux antennes rétro pointant vers le haut et l'extérieur */}
        <path d="M 9 7.5 L 6.8 4" />
        <path d="M 15 7.5 L 17.2 4" />
        {/* Double point de mire / écran expressif */}
        <circle cx="9.5" cy="13" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="14.5" cy="13" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    );
  };
  ```

---

## 4. Plan de vérification

1. **Vérification visuelle sur Héritages** :
   - Constater que la carte de Mahougnon (et des autres protagonistes) affiche la petite télé en haut à droite et l'icône profil officielle sur le flanc droit.
2. **Vérification croisée multi-écrans** :
   - Parcourir Duocumentaires, Entreprises, Productions et Studio pour vérifier la présence constante de la petite télé en haut à droite avec bascule en Pause lors de la lecture.
   - S'assurer que le clic sur l'icône Profil ouvre fidèlement la vue profil / univers du protagoniste.
3. **Compilation et non-régression** :
   - Exécution de `compile_applet` et `lint_applet` pour certifier l'absence de toute erreur TypeScript.
