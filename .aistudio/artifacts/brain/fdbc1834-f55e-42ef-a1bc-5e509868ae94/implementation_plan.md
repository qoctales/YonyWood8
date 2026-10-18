# Refonte des Cartes Entreprises, Espace Écosystème & Harmonisation Visuelle Globale

Ce plan enrichi intègre l'ensemble des directives ergonomiques et éditoriales :
1. **Harmonisation typographique** : prénoms et raisons sociales légèrement plus grands (`15-16px`) avec espacement élargi (`tracking-wider`) sur toutes les cartes vidéo.
2. **Lecteur vidéo standardisé** : pastille circulaire dépolie placée en haut à droite sur toutes les cartes (Duos, Entreprises, Écosystème, Protagonistes).
3. **Cartes Entreprises globales épurées** : domaine d'activité en haut (ex: *Audiovisuel, Énergie, Transport, Finance, Technologie*), **uniquement le nom de l'entreprise** en bas à gauche (suppression du fondateur et de la localisation), suppression du cercle vert, et flanc droit resserré sur **2 boutons clés : Explorer & Partager**.
4. **Nouvel Espace Entreprise Dédié (au clic sur "Explorer")** : navigation swipe horizontale parmi les témoignages vidéo de l'écosystème (*Fondateur, Collaborateur, Fournisseur, Client*). Chaque carte affiche en haut à gauche le prénom du témoin avec son rôle en dessous, le nom de l'entreprise en bas, le lecteur en haut à droite, et une flèche de retour vers la vue globale des entreprises.
5. **Modale Vidéo Protagoniste** : icône muet déplacée en bas à droite, fermeture intuitive au clic extérieur et à la touche `Échap`.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Décisions architecturales et ergonomiques validées pour cette révision :

- **Épuration stricte de la carte entreprise** : En bas à gauche, seul le nom de l'entreprise s'affiche (ex: `AFRIKAFUN`). Les métadonnées secondaires (fondateur, ville) sont réservées aux cartes de l'espace écosystème où chaque personne prend la parole.
- **Flanc droit allégé (2 boutons)** :
  1. `Explorer` (icône boussole / flèche d'immersion) : ouvre l'espace de la société.
  2. `Partager` (icône partage) : copie le lien profond de l'entreprise.
- **Architecture de navigation à deux niveaux pour Entreprises** :
  - *Niveau 1 (Global)* : Galerie des entreprises par domaine (*Audiovisuel, Énergie, Transport, Finance, Technologie*).
  - *Niveau 2 (Espace Dédié)* : Défilement des capsules des personnes de l'écosystème avec bouton de retour clair vers le niveau 1.

---

## 1. Vue d'Ensemble & Parcours Utilisateur

### Parcours Niveau 1 : Galerie Globale des Entreprises
- **Défilement** : Swipe horizontal (ou flèches latérales) entre les entreprises référentes.
- **Domaines représentés** :
  - **AFRIKAFUN** — *Audiovisuel* (Cotonou)
  - **Suno Solaire** — *Énergie* (Grand-Popo)
  - **Trans-Lagoon** — *Transport* (Porto-Novo & Cotonou)
  - **FinSecure Africa** — *Finance* (Abidjan & Cotonou)
  - **AfriCode Tech** — *Technologie* (Ouidah & Paris)
- **Affichage carte 9:16** :
  - **Haut** : Titre du domaine en majuscules aérées (`text-xs font-bold tracking-wider text-white`). Plus aucun cercle vert.
  - **Haut à droite** : Bouton lecteur vidéo en verre dépoli sombre avec survol terracotta.
  - **Flanc droit** : Deux boutons uniquement : `Explorer` et `Partager`.
  - **Bas à gauche** : Nom de l'entreprise en gros caractères avec interlettrage `tracking-wider`.

### Parcours Niveau 2 : L'Espace de la Société (après clic sur "Explorer")
- **En-tête de retour** : Barre supérieure élégante avec flèche de retour `< Entreprises` permettant de revenir instantanément à la galerie générale.
- **Cartes Vidéo des Voix de l'Entreprise** : Défilement swipe horizontal entre les différents acteurs :
  - **Fondateur** (ex: *Pascal*, Fondateur & Réalisateur)
  - **Collaborateur** (ex: *Amina*, Responsable Post-Production)
  - **Fournisseur** (ex: *Koffi*, Loueur de matériel de tournage & optiques cinéma)
  - **Client / Partenaire** (ex: *Marc*, Directeur de marque partenaire)
- **Anatomie de la carte écosystème** :
  - **Haut à gauche** : Prénom du témoin en `text-[15px] sm:text-base font-bold text-white tracking-wider`, surmontant son titre (`Collaborateur`, `Fondateur`, `Fournisseur`, `Client`).
  - **Haut à droite** : Bouton lecteur vidéo Play/Pause dépoli.
  - **Bas à gauche** : Nom de l'entreprise en majesté (ex: `AFRIKAFUN`).
  - **Flanc droit** : Boutons d'action adaptés (Évaluer résonance, Question, Profil/Rôle, Partager).

---

## 2. Expérience Utilisateur & Design Visuel

### A. Typographie et Espacements
- **Prénoms & Noms d'entreprises** :
  ```tsx
  font-editorial text-[15px] sm:text-base font-bold text-white tracking-wider leading-snug drop-shadow-md
  ```
- **Rôles et Métadonnées** (Espace entreprise & profils) :
  ```tsx
  text-xs text-stone-200 font-medium tracking-wide drop-shadow-sm
  ```

### B. Standardisation du Bouton Lecteur Vidéo
- Placé en **haut à droite** sur toutes les cartes :
  ```tsx
  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] flex items-center justify-center text-white transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
  ```
- État dynamique : Icône `Play` au repos (ou lorsque la vidéo est en pause), `Pause` lors de la lecture.

### C. Modale Protagoniste (`ProtagonistTeaserModal.tsx`)
- Suppression définitive du bouton `X` en haut à droite.
- Le bouton Play/Pause prend sa place en haut à droite.
- Le bouton Muet (`Volume2` / `VolumeX`) descend en **bas à droite**.
- Fermeture naturelle :
  - Clic en dehors de la carte 9:16 (sur l'overlay sombre).
  - Touche clavier `Escape`.

---

## 3. Schéma de Navigation & Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                      PAGE ENTREPRISES (NIVEAU 1)                       │
│                                                                        │
│  [Domaine : AUDIOVISUEL]                       [▶ Lecteur Vidéo]       │
│                                                                        │
│                                                                        │
│                                                [ 🧭 Explorer ] ──┐     │
│                                                [ ↗ Partager ]    │     │
│                                                                  │     │
│  AFRIKAFUN (tracking-wider)                                      │     │
└──────────────────────────────────────────────────────────────────┼─────┘
                                                                   │ (Clic)
                                                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   ESPACE DE LA SOCIÉTÉ (NIVEAU 2)                      │
│                                                                        │
│  [ ← Retour aux Entreprises ]                 Société : AFRIKAFUN      │
│ ────────────────────────────────────────────────────────────────────── │
│                                                                        │
│  AMINA                                         [▶ Lecteur Vidéo]       │
│  Collaboratrice · Post-production                                      │
│                                                                        │
│                                                [ ★ Résonance ]         │
│                                                [ 📖 Question ]         │
│                                                [ ↗ Partager ]          │
│                                                                        │
│  AFRIKAFUN                                                             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Plan Technique par Composant

1. **`src/components/CompanyHeritageScreen.tsx`** :
   - Enrichir les données d'entreprises : 5 sociétés représentatives avec leurs domaines (*Audiovisuel, Énergie, Transport, Finance, Technologie*).
   - Pour chaque entreprise, ajouter le tableau `stakeholders` avec les voix de l'entreprise (*Fondateur, Collaborateur, Fournisseur, Client*), leurs photos, vidéos et rôles.
   - Ajouter un état `selectedCompanyForSpace: Company | null`.
   - Si `selectedCompanyForSpace === null` (Vue Niveau 1) :
     - Domaine en haut (sans point vert).
     - Lecteur vidéo en haut à droite.
     - 2 boutons à droite : `Explorer` (qui passe en Niveau 2) et `Partager`.
     - Nom de l'entreprise seul en bas à gauche en `text-[15px] sm:text-base tracking-wider`.
   - Si `selectedCompanyForSpace !== null` (Vue Niveau 2) :
     - Barre de retour `< Entreprises` en haut.
     - Swipe horizontal des cartes des témoins de l'écosystème.
     - Prénom en haut à gauche + rôle en dessous.
     - Nom de l'entreprise en bas.
     - Lecteur vidéo en haut à droite.
2. **`src/components/DuoFeedScreen.tsx`** :
   - Typographie des prénoms ajustée à `text-[15px] sm:text-base font-bold tracking-wider`.
   - Déclencheur vidéo consolidé en haut à droite.
3. **`src/components/SwipeModeHeritage.tsx`** :
   - Typographie des prénoms ajustée avec `tracking-wider` et taille `15-16px`.
   - Déclencheur vidéo consolidé en haut à droite.
4. **`src/components/ProtagonistTeaserModal.tsx`** :
   - Déplacement de l'icône Muet en bas à droite.
   - Suppression du bouton `X` en haut à droite et positionnement du lecteur vidéo en haut à droite.
   - Gestion de la fermeture au clic backdrop et touche `Escape`.
5. **Compilation & Validation** :
   - Exécution de `lint_applet` et `compile_applet` pour garantir zéro erreur TypeScript.
