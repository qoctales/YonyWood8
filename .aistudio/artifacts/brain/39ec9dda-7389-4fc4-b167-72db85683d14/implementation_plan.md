# Plan d'implémentation : Harmonisation Visuelle, En-têtes Unifiés & Header Dynamique

## Résumé du Projet

Harmoniser l'ensemble des écrans de la plateforme YonyWood pour que chaque page adopte une cohérence visuelle stricte :
1. **En-têtes de pages sobres et identiques** avec le nom de la section et un trait fin décoratif en bas (ex: « Entreprises » avec son tiret, sans points de navigation superflus ni puces encombrantes ; idem pour « Profil » sans flèche retour).
2. **Header universel dynamique** au centre avec le titre et la tagline éditoriale qui changent automatiquement selon la page active.
3. **Suppression de l'onglet transaction** sur le profil.
4. **Verrouillage spatial et hauteur des cartes vidéo** pour qu'elles soient strictement au même positionnement sur tous les écrans et dégagent impérativement la barre de navigation inférieure fixe (`BottomMenu`).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Décisions architecturales validées :**
> - **Header universel dynamique** : Au centre de la barre supérieure (`Navbar`), le titre et la tagline s'adaptent instantanément à l'écran actif (`currentScreen.type`) tout en conservant le logo à gauche et les boutons Connexion/Inscription à droite.
> - **Titrage de page standardisé** : Structure unifiée `<h2 className="font-editorial text-2xl font-bold">Titre</h2><div className="w-12 h-0.5 bg-[#A2482B] mt-1.5 rounded-full" />` sur chaque vue (Entreprises, Profil, Duocumentaires, Productions, etc.).
> - **Allègement du Profil** : Suppression définitive de l'onglet Transaction et de la flèche de retour arrière sur le profil par défaut de Pascal Cossi.
> - **Gabarit des Cartes Vidéo 9:16** : Hauteur fixe et calculée (`h-[min(510px,calc(100vh-220px))]`) avec un `padding-bottom` garanti (`pb-20` ou `pb-24`) pour qu'aucune carte ne chevauche le menu du bas.

---

## 1. Vue d'ensemble & Concept

L'application offre une expérience fluide, cinématographique et directe. L'utilisateur navigue via le menu inférieur fixe (`BottomMenu`) entre 6 grands univers : **Studio**, **Héritages**, **Duocumentaires**, **Productions**, **Entreprises**, et **Profil**. 

Pour renforcer la lisibilité et l'élégance éditoriale, chaque page partage désormais le même gabarit :
- Le haut de page indique la mission de la vue via une phrase d'accroche soignée dans le header.
- Le titre de section est sobrement mis en valeur avec un trait de terre cuite fin.
- La carte vidéo (ou le contenu principal) occupe le centre exact du viewport sans débordement ni friction tactile avec le menu inférieur.

---

## 2. Expérience Utilisateur & Design Visuel

### A. Phrases éditoriales dynamiques du Header (`Navbar.tsx`)

Le centre de la `Navbar` affiche en typographie soignée le couple Titre + Tagline propre à chaque destination :

| Page (`currentScreen.type`) | Titre Centré | Petite Tagline |
| :--- | :--- | :--- |
| **Duocumentaires** (`duo_feed`, `duo_detail`) | *Des histoires qui nous relient* | *Deux univers, une même question existentielle* |
| **Productions** (`marketplace`) | *Des coproductions qui nous rassemblent* | *Une façon de soutenir la valorisation des histoires* |
| **Entreprises** (`enterprise`) | *Un espace de visibilité et de promotion* | *Montrer l'entreprise de l'intérieur grâce à un storytelling collaboratif* |
| **Studio** (`submit_story`, `request_videographer`) | *L'atelier de création partagée* | *Racontez votre récit ou faites appel à nos cinéastes* |
| **Héritages** (`home`, `matrix_view`, `documentaries`) | *La mémoire vivante de nos terroirs* | *Explorez les lignées, les savoir-faire et les transmissions* |
| **Profil** (`profile`, `settings`, `portfolio`) | *Votre espace personnel et engagé* | *Vos récits, vos parts et votre empreinte culturelle* |

### B. Standardisation des Titres de Page avec le Petit Tiret

- **Page Entreprise (`CompanyHeritageScreen.tsx`)** :
  - Remplacement de l'ancien en-tête chargé (qui contenait le compteur `1/6`, les boutons de dossier et les puces) par un titre épuré :
    ```tsx
    <div className="w-full flex flex-col items-center sm:items-start mb-4">
      <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 tracking-wide">
        Entreprises
      </h2>
      <div className="w-12 h-0.5 bg-[#A2482B] mt-1.5 rounded-full" />
    </div>
    ```
  - Suppression des points de pagination et de la barre de puces en bas.
  - La navigation d'entreprise à entreprise se fait naturellement par swipe tactile direct sur la carte ou via les flèches latérales discrètes.
- **Page Profil (`ProfileSettingsScreen.tsx`)** :
  - Suppression de la flèche de retour en haut du profil par défaut.
  - En-tête identique : Titre « Profil » avec son trait terre cuite signature.
  - Suppression de l'onglet « Transactions » dans la navigation des catégories du profil (conservation des onglets essentiels : Récit, Production, Offre, Appel).

### C. Alignement Spatial & Respect du Menu du Bas

- **Hauteur des cartes vidéo** : Contrainte stricte `h-[min(510px,calc(100vh-220px))]` ou équivalent viewport responsive.
- **Dégagement vertical** : Le conteneur `<main>` dans `App.tsx` applique `pb-24 sm:pb-28` et chaque écran veille à ce que la zone interactive ne chevauche jamais la barre fixe `BottomMenu` (`bottom-0 z-40`).
- Les cartes restent parfaitement centrées verticalement entre la `Navbar` supérieure (hauteur 60px) et le `BottomMenu` inférieur (hauteur 70px).

---

## 3. Décisions Clés & Arbitrages

1. **Suppression des badges superflus sur Entreprise** :
   - *Choix* : Élimination du bouton "Dossier de l'agence 1/6" et des puces horizontales encombrantes.
   - *Pourquoi* : Répond directement à la consigne d'épuration visuelle du client (« Pas de points de navigation, pas d'onglets en bas, pas de dossier de l'agence 1/6. Non, tu mets juste Entreprise avec le petit trait joli en bas »).
2. **Accès au dossier de l'entreprise via la carte** :
   - Le dossier complet reste accessible directement depuis la première icône d'action latérale (`Building2`) de la carte vidéo, préservant 100% de la richesse des textes fournis (ADN, mission, Fidjrossè, Stéphane) sans alourdir la page.
3. **Nettoyage du Profil** :
   - Retrait de l'onglet Transactions et de la flèche de retour pour offrir une expérience calme, centrée sur Pascal Cossi et ses récits.

---

## 4. Architecture Technique & Schéma des Composants

```
┌────────────────────────────────────────────────────────────────────────┐
│  Navbar (Sticky Top - 60px)                                            │
│  [Logo YonyWood]    [Titre & Tagline Dynamiques]    [Connexion/Inscr.] │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Conteneur Principal (Screen Router)                                   │
│  - pt-3 pb-24 (Dégagement garanti pour ne jamais toucher le BottomMenu)│
│                                                                        │
│  Exemple : Écran Entreprise                                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Entreprises                                                      │  │
│  │ ───── (Tiret signature #A2482B)                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ [◀]   Carte Vidéo 9:16 (Hauteur verrouillée : max 510px)     [▶] │  │
│  │       - Titre catégorie en haut                                  │  │
│  │       - 4 icônes d'actions sur flanc droit                       │  │
│  │       - Nom entreprise à gauche / Icône vidéo à droite           │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  BottomMenu (Fixed Bottom - 70px - z-40)                               │
│  [Studio]  [Héritages]  [Duocumentaires]  [Productions] [Entr.] [Prof] │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Étapes de Réalisation Prévues

1. **`Navbar.tsx`** : Créer le dictionnaire des punchlines contextuelles (titre + tagline) et le lier dynamiquement à `currentScreen.type`.
2. **`CompanyHeritageScreen.tsx`** :
   - Remplacer l'en-tête par le titre sobre « Entreprises » + tiret bas signature.
   - Retirer le compteur `1/6`, le bouton de dossier d'en-tête, les points de pagination et les puces inférieures.
   - Ajuster la hauteur de la carte pour qu'elle s'aligne exactement sur le gabarit des cartes des duos.
3. **`ProfileSettingsScreen.tsx`** :
   - Retirer la flèche de retour sur le profil principal.
   - Standardiser l'en-tête « Profil » + tiret bas.
   - Retirer l'onglet « Transactions » de la liste des catégories du profil.
4. **`App.tsx` / Layouts** :
   - Vérifier et homogénéiser le padding bas et les contraintes de hauteur de toutes les cartes vidéo pour garantir zéro chevauchement avec la barre fixe.
5. **Vérification & Compilation** :
   - Exécuter `compile_applet` et `lint_applet` pour garantir zéro régression.
