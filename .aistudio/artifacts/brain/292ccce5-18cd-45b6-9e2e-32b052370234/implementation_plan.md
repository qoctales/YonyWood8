# Matrice Vivante — Page Héritage

Plan d'implémentation pour donner vie à la matrice 16×16 de la page Héritage de YonyWood grâce à un flux lumineux ambré/terracotta circulant entre les lignes et un ballet contemplatif de fondus au noir renouvelant les visages de la forêt.

---

## Retours utilisateur & Décisions confirmées

> [!IMPORTANT]
> Les trois choix directeurs ont été confirmés par l'utilisateur lors du cadrage interactif :
> - **Rythme** : Très lent et contemplatif — transition douce espacée de 8 à 10 secondes.
> - **Flux de lumière** : Rayon ambré et terracotta balayant avec fluidité les interlignes et nœuds de la grille.
> - **Renouvellement des visages** : Combinaison d'échanges de cases entre visages affichés et apparition progressive de nouveaux profils issus de la forêt YonyWood par de subtils fondus au noir.

---

## 1. Vue d'ensemble & Concept

La matrice de la page Héritage rassemble les visages des passeurs, héritiers et témoins de la forêt documentaire. Actuellement statique au repos (avec une simple pulsation ponctuelle), elle doit devenir **un organisme vivant et contemplatif** :
1. **Flux de lumière subtil** : Un éclat doux, ambré et terracotta, qui glisse lentement le long des canaux et interlignes de la grille comme une sève lumineuse reliant les êtres.
2. **Respiration et transmigration des visages** : Toutes les 8 à 10 secondes, une ou deux cases s'éteignent délicatement dans un fondu au noir progressif (1,2s), avant de faire émerger à nouveau un visage — soit un échange poétique de position entre deux protagonistes, soit l'entrée en scène d'un nouveau membre de la communauté issu du vivier complet des profils.
3. **Respect absolu de l'interaction** : Dès que l'utilisateur survole une case, commence à faire un pan ou à zoomer, les permutations se suspendent instantanément pour garantir une exploration stable et sans surprise.

---

## 2. Expérience Utilisateur & Design Visuel

### A. Le flux lumineux inter-lignes (*Light Stream*)
- **Positionnement** : Situé exactement dans les interstices (`gap-[1.5px] sm:gap-[2px]`) entre les 256 cases, sans jamais recouvrir ni altérer les photos elles-mêmes.
- **Teintes & Dégradé** : Dégradé doux partant de l'or ambré signature YonyWood (`#C89B3C`), passant par la Terre Cuite (`#A2482B`) avec une retombée transparente.
- **Mouvement** : Balayage horizontal puis vertical sur un cycle sinusoïdal long (14 à 18 secondes), créant une sensation de fluide continu et de circulation organique, sans saccade ni effet clignotant agressif.
- **Filtres & Rendu** : Masque SVG / CSS avec `mix-blend-mode: multiply` ou `screen` selon le contraste, préservant la netteté chirurgicale du fond blanc.

### B. Le fondu au noir des visages (*Chassé-croisé poétique*)
- **Déroulement d'un cycle (toutes les 8 à 10 secondes)** :
  1. *Sélection aléatoire douce* : Le système choisit 1 ou 2 cellules cibles non adjacentes pour éviter les surcharges visuelles.
  2. *Extinction en fondu au noir (1,2s)* : La photo de la case passe doucement de `opacity: 1` à `opacity: 0` sur un fond sombre (`#1C1917`), comme si le regard se retirait dans la nuit.
  3. *Transition en coulisse (0,2s)* : Durant l'obscurité totale de la case, l'identité du profil est mise à jour (soit un échange avec une autre case, soit un profil issu de la réserve `allProfiles` non présent dans la grille actuelle).
  4. *Révélation lumineuse (1,2s)* : Le nouveau visage émerge de l'ombre (`opacity: 0` vers `opacity: 1`), accompagné d'un très discret liséré ambré fugace qui s'estompe.
- **Effet ressenti** : Une mosaïque infinie et vivante où l'on a l'impression que la forêt bouge et que les récits circulent en permanence sous nos yeux, dans une lenteur apaisante.

---

## 3. Décisions Clés & Arbitrages

1. **Gestion ciblée du DOM plutôt que re-render complet** :
   - *Choix* : Animer uniquement les indices actifs de transition via des clés ou classes CSS locales (`isFadingOut`, `isFadingIn`), sans forcer le recalcul ou le rerender des 256 cases simultanément.
   - *Bénéfice* : 60 images par seconde constantes, même sur téléphones mobiles et tablettes, avec zéro surchauffe CPU/GPU.
2. **Suspension réactive aux gestes utilisateur** :
   - *Choix* : Si l'utilisateur clique, survole, zoome ou commence à naviguer, les transitions se mettent immédiatement en pause.
   - *Bénéfice* : Évite toute frustration où une carte disparaîtrait au moment où l'utilisateur s'apprête à cliquer dessus.
3. **Réserve dynamique de profils** :
   - *Choix* : Utiliser `allProfiles` déjà extrait de `getAllMatrixProfiles()` dans `MatrixExplorer.tsx` pour alimenter le vivier de visages dormants qui apparaissent au fil de l'eau.
   - *Bénéfice* : Valorise l'ensemble des protagonistes et donne une impression d'abondance communautaire.

---

## 4. Architecture Technique & Flux de Données

```
┌─────────────────────────────────────────────────────────────┐
│                    MatrixExplorer.tsx                       │
│  - allMatrixProfiles (vivier complet des profils)           │
│  - initialMatrixGrid (256 profils initiaux)                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   LivingMatrixWall.tsx                      │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 1. État local de la grille vivante (currentGrid)      │  │
│  │ 2. Hook de cycle contemplatif (8s - 10s)              │  │
│  │    - Choix d'1 ou 2 indices cibles                    │  │
│  │    - Set fadingIndices (fade out -> swap -> fade in)  │  │
│  │    - Pause automatique sur isHovered / isDragging     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 3. Calque de Flux Lumineux (Inter-lignes CSS / SVG)   │  │
│  │    - Rayon ambré / terracotta en translation lente    │  │
│  │    - Aligné rigoureusement sur les gap-[1.5px/2px]    │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 4. Cellules 16×16 avec micro-transitions              │  │
│  │    - bg-stone-900 en fond de cellule                  │  │
│  │    - Img transition-opacity duration-1200             │  │
│  │    - Infobulle et clic intacts                        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Plan d'exécution par étapes
1. **Composant de flux lumineux (`MatrixLightFlowOverlay`)** : Création d'une surcouche fine et performante calquée sur la grille 16×16 simulant le flux ambré/terracotta dans les interlignes.
2. **Moteur de rotation lente dans `LivingMatrixWall`** :
   - Ajout d'un état `currentGrid` initialisé avec la grille passée en props.
   - Système de timer récurrent (intervalle 8-10s) sélectionnant 1 à 2 indices.
   - Gestion des 3 phases : extinction progressive (`1200ms`), permutation/remplacement par un visage du vivier `allProfiles`, et réapparition douce (`1200ms`).
3. **Contrôle d'interaction & Accessibilité** :
   - Désactivation immédiate des transitions pendant le drag, le pinch-zoom ou le survol actif.
   - Prise en compte de `prefers-reduced-motion` pour figer l'animation si l'utilisateur l'exige.
4. **Validation finale** : Test de fluidité et compilation via `compile_applet`.
