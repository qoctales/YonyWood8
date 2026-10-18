# Plan Définitif d'Arrangement Visuel : Titres Raffinés, Sécurité du Header et Symétrie Parfaite des Cartes Vidéo

Ce plan résout de manière globale et définitive les conflits de disposition, d'échelle et de symétrie identifiés sur les pages **Studio**, **Héritages**, **Duocumentaires**, **Productions** et **Entreprises**.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Décisions confirmées suite aux clarifications de l'utilisateur :
> - **Échelle des titres de page** : Réduction à une taille sobre, prestigieuse et discrète (`18px` / `text-base sm:text-[18px] font-bold`) accompagnée d'un tiret terre cuite raffiné (`w-8 h-0.5 bg-[#A2482B] rounded-full mt-1.5`). Le logo YonyWood redevient ainsi le premier élément visuel dominant, sans concurrence de taille avec le titre de la page.
> - **Sécurisation de la Tagline dans le Header** : Affichage exclusif sur grands écrans (`hidden lg:flex`) avec largeur bornée (`max-w-xs xl:max-w-md`) et texte tronqué en cas d'écran étroit, éliminant définitivement tout risque de chevauchement avec les boutons "Connexion" et "Inscription". Sur mobile et tablette (`< 1024px`), le header reste pur et épuré (Logo à gauche, Auth/Profil à droite).
> - **Gabarit universel unique des cartes vidéo** : Verrouillage strict de toutes les cartes vidéo verticales sur une hauteur maximale unique de **490px** (`h-[min(490px,calc(100dvh-220px))]`) avec ratio 9:16.
> - **Symétrie verticale absolue** : Suppression de tous les paddings parasites asymétriques (`py-5`, `pb-28`, etc.) et application d'un centrage vertical pur `my-auto` dans un conteneur standardisé. La distance entre le bas du tiret rouge et le haut de la carte est rigoureusement identique à la distance entre le bas de la carte et le haut du BottomMenu flottant.

---

### 1. Overview & Core Concept

- **Expérience visuelle globale** : Lors de la navigation entre les onglets (**Studio**, **Héritages**, **Duocumentaires**, **Productions**, **Entreprises**), l'interface ne "saute" plus :
  1. Le header reste stable, épuré et sans collision.
  2. Les titres de chaque page partagent la même taille typographique discrète (18px) et le même tiret terracotta décalé.
  3. La carte vidéo (ou le diptyque de cartes en mode duo) conserve une hauteur rigoureusement identique (490px max) et flotte au centre exact de la fenêtre utile sans jamais glisser sous la barre de navigation.

---

### 2. User Experience & Visual Design

#### A. Header Universel Sécurisé (`Navbar.tsx`)
- Transformation du conteneur central de la tagline en `hidden lg:flex` avec une contrainte de largeur maximale stricte (`max-w-[320px] xl:max-w-[420px]`).
- Les textes `tagline.title` et `tagline.subtitle` comportent `truncate` et des tailles fines (`text-xs font-bold` et `text-[10.5px] text-stone-500`).
- Sur les résolutions intermédiaires (tablettes, laptops étroits, mobiles), le header conserve un espace vide central aéré, empêchant tout contact physique avec les boutons d'authentification.

#### B. Typographie des Titres de Page (`18px` discret)
- Remplacement des tailles trop lourdes (`text-2xl`, `text-3xl`) par :
  ```tsx
  <div className="relative flex items-center h-full shrink-0">
    <h1 className="font-editorial text-base sm:text-[18px] font-bold text-[#1C1917] tracking-tight leading-none">
      {titreDePage}
    </h1>
    <div className="absolute left-0 -bottom-2 w-8 h-0.5 bg-[#A2482B] rounded-full" />
  </div>
  ```
- Harmonisé sur :
  - **Duocumentaires** (`DuoFeedScreen.tsx`)
  - **Studio** (`SubmitStoryScreen.tsx`)
  - **Héritages** (`MatrixExplorer.tsx`)
  - **Productions** (`MarketplaceScreen.tsx`)
  - **Entreprises** (`CompanyHeritageScreen.tsx`)

#### C. Gabarit Unique et Symétrie Verticale des Cartes Vidéo
- **Hauteur standardisée** : `h-[min(490px,calc(100dvh-220px))]`
- **Largeur standardisée 9:16** :
  - *Mode Solo / Deck / Entreprise / Studio / Héritages* : `w-auto aspect-[9/16] h-[min(490px,calc(100dvh-220px))] max-w-[calc(100vw-32px)]`
  - *Mode Duo (deux cartes face-à-face)* : `w-[min(calc((100vw-36px)/2),calc((100dvh-220px)*9/16*0.95))] sm:w-[min(276px,calc((100dvh-220px)*9/16))] h-[min(490px,calc(100dvh-220px))] aspect-[9/16]`
- **Symétrie verticale mathématique** :
  - La zone centrale entre l'en-tête et le bas de page est enveloppée dans `flex-1 flex flex-col items-center justify-center min-h-0 my-auto w-full`.
  - Pas d'overflow, pas de défilement vertical, et le bouton d'action bas (comme "Acquérir (50 €)" sur Productions ou "Choisir cette porte" sur Studio) reste parfaitement dégagé au-dessus du menu flottant avec 25 à 35px de marge de sécurité.

---

### 3. Key Product Decisions & Trade-Offs

- **Décision 1 : 490px max vs 540px/604px**
  - *Choix retenu* : 490px max (au lieu de 540px ou 604px).
  - *Pourquoi* : Sur les écrans portables (hauteur 700px–800px) et sur mobile, 540px était encore trop grand pour laisser respirer les boutons d'action inférieurs (comme le bouton d'achat de Productions visible dans la capture 3). À 490px, la carte reste imposante, immersive et lisible, tout en garantissant une équidistance parfaite en haut et en bas.
- **Décision 2 : Masquage de la tagline en-dessous de 1024px (`lg`)**
  - *Choix retenu* : `hidden lg:flex` plutôt que de forcer la tagline à s'écraser contre les boutons.
  - *Pourquoi* : La barre supérieure fait 56px de haut. Sur mobile et tablette, un header avec logo + punchline + 2 boutons d'auth est saturé et inélégant. Masquer la tagline sous 1024px offre un design digne des plus grands studios.
- **Décision 3 : Titres à 18px au lieu de 24px-30px**
  - *Choix retenu* : 18px (`text-[18px] font-bold`).
  - *Pourquoi* : Le logo YonyWood fait environ 26px de hauteur. Avoir un titre de page à 28px ou 32px créait un conflit visuel direct avec la marque. À 18px, le titre est net, distingué et hiérarchiquement subordonné au logo.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        HEADER NAVBAR (56px)                            │
│  [Logo YonyWood (26px)]     [Tagline (hidden < 1024px)]    [Connexion] │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                        EN-TÊTE ÉPURÉ (36px)                            │
│  [Titre 18px]                 [Série / Filtre]           [Deck / Flag] │
│  ── (Tiret 32px)                                                       │
└────────────────────────────────────────────────────────────────────────┘
          │
          │  ◄─── Espace libre A (ex: 32px)
          ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        ZONE VIDÉO CONTENUE                             │
│                                                                        │
│   ┌──────────────────────────┐        ┌──────────────────────────┐     │
│   │   CARTE VIDÉO (9:16)     │        │   CARTE VIDÉO (9:16)     │     │
│   │   Hauteur fixe : 490px   │        │   Hauteur fixe : 490px   │     │
│   │   [Boutons d'action]     │        │   [Boutons d'action]     │     │
│   │   [Prénom / Titre]       │        │   [Prénom / Titre]       │     │
│   └──────────────────────────┘        └──────────────────────────┘     │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
          ▲
          │  ◄─── Espace libre B (rigoureusement = Espace libre A, ex: 32px)
          │
┌────────────────────────────────────────────────────────────────────────┐
│                 MENU NAVIGATION FLOTTANT (70px)                        │
└────────────────────────────────────────────────────────────────────────┘
```

#### Plan d'exécution par fichier :
1. `src/components/Navbar.tsx` : Passage de la tagline en `hidden lg:flex` avec largeur bornée stricte (`max-w-[320px] xl:max-w-[420px]`) pour supprimer tout conflit avec Connexion/Inscription.
2. `src/components/DuoFeedScreen.tsx` : Titre à 18px (`text-base sm:text-[18px]`), tiret de 32px (`w-8`), cartes A & B et Deck calibrées à 490px max (`h-[min(490px,calc(100dvh-220px))]`).
3. `src/components/SubmitStoryScreen.tsx` : Titre Studio à 18px, tiret de 32px, carte vidéo d'étape calibrée à 490px max.
4. `src/components/MarketplaceScreen.tsx` : Titre Productions à 18px, tiret de 32px, carte de coproduction calibrée à 490px max (bouton "Acquérir" parfaitement dégagé du BottomMenu).
5. `src/components/CompanyHeritageScreen.tsx` : Titre Entreprises à 18px, tiret de 32px, carte d'entreprise calibrée à 490px max avec `my-auto` pour symétrie parfaite.
6. `src/components/MatrixExplorer.tsx` & `SwipeModeHeritage.tsx` : Titre Héritages à 18px, tiret de 32px, cartes swipe calibrées à 490px max.
