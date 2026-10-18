# Plan d'Implémentation : Page d'Accueil Native & Alignement Fidèle aux Écrans Réels

Ce plan détaille les ajustements précis demandés pour la page d'accueil YonyWood, strictement cantonnés à celle-ci, afin de refléter fidèlement l'expérience des pages réelles de la plateforme.

---

## 1. Principes & Périmètre
- **Périmètre strict** : Les modifications s'appliquent exclusivement à la page d'accueil (`LandingScreen.tsx` et ses sous-composants dédiés). Le reste de l'application demeure inchangé.
- **Barre fixe en bas** : Le menu de navigation principal reste fixé en bas de l'écran, avec l'onglet **« Entreprises »** (au pluriel).
- **Navigation native** : Le contenu sélectionné s'affiche en plein écran au-dessus de la barre de navigation.

---

## 2. Détail des Ajustements par Section

### A. Héritages (La véritable page Héritage intégrée sur la page d'accueil)
- **Intégration directe de la vraie page Héritage (`MatrixExplorer`)** sur la page d'accueil :
  - La roue centrale complète avec le logo/icône au centre et les **8 portes d'entrée** sur le premier cercle.
  - Le cercle extérieur avec les **16 profils réels** qui réagissent selon la porte et la sous-catégorie sélectionnées.
  - Le support du **mode Swipe** et du mode Astrolabe circulaire avec zoom et rotation.
  - La modale de découverte / teaser au double-clic sur un profil avec son texte d'une à deux lignes.
  - Suppression de toute reproduction simplifiée artificielle : affichage de l'expérience authentique d'Héritages directement dans la section.

---

### B. Duocumentaires (Prénoms uniquement, Vraies icônes & Évaluation intégrée)
- **Navigation par swipe et flèches** entre les 8 duos officiels de YonyWood.
- **En-tête officiel** : Titre *Duocumentaires*, pilule centrale de la série active (*Ancestral <> Revealed*, etc.), et boutons **Deck** et **Duo**.
- **Cartes vidéo 9:16 en miroir** :
  - **Prénom uniquement en bas** (ex. `Mahougnon`, `Dieudonné`, `Pascal`, `Mawuna`), en typographie éditoriale avec ombre portée, sans rôle ni texte encombrant, exactement comme sur le reste du site.
  - **Les 4 vraies icônes officielles** :
    1. **Question (`BookOpen`)** : Affiche la question centrale de l'épisode dans la carte.
    2. **Évaluation Résonance (`Award`)** : Ouvre la modale d'évaluation interactive avec les 3 curseurs de notation (Authenticité, Pertinence, Impact) pour faire bouger les jauges de 0 à 100%. Cette modale est **calibrée et bornée strictement à l'intérieur de la carte vidéo**, sans déborder sur toute la page.
    3. **Profil (`ProfileSoloIcon`)** : Permet de comprendre l'accès au profil du protagoniste.
    4. **Partager (`ShareIcon`)** : Icône officielle avec feedback visuel de copie.
    - *Aucune icône inventée (aucune épingle).*

---

### C. Entreprises (Profil Afrika Fun Production & Cartes d'équipe 9:16)
- **Libellé dans la barre** : **« Entreprises »** (au pluriel).
- **En-tête de profil d'entreprise** (encadré sobre similaire au profil de Pascal) :
  - Nom : **Afrika Fun Production** (avec un « k »).
  - Statut : Société de production audiovisuelle, cinéma du réel & contenus culturels.
  - Présentation concise de la maison de production.
- **Cartes 9:16 de présentation de l'équipe** :
  - Suppression des menus et des textes promotionnels (« bien plus puissant qu'un spot », etc.).
  - Cartes d'équipe au format 9:16 avec visuel, **prénom uniquement en bas**, fonction (ex. Monteur, Cadreur, Directrice de post-production, Producteur délégué) et un court mot authentique de l'équipier (ex. *« Afrika Fun Production m’a permis de maîtriser les récits immersifs et de porter haut nos histoires. »*).
  - Flèches de navigation gauche/droite pour faire défiler les collaborateurs.

---

### D. Studio, Productions & Profil Pascal
- **Studio** : Conserve le parcours en 3 étapes (Porte avec *Avantages* et *Choisir* → Série avec *Choisir* → Face-à-face *J'ai ma vidéo* vs *Recruter un vidéaste* avec boutons démo et modale *Détails*). Pas de mini-menu d'étapes artificiel ni de bouton *Mes publications*.
- **Productions** : Les 8 séries avec jauge de parts (50 € / part) et onglet Marché pour la revente de parts entre pairs.
- **Profil** : Profil de Pascal Cossi avec ses 4 boutons (Mes séries / Voir Autrement, Production / 10 parts, Produits & Services / Fâ, Projets / Atelier) sous forme de carte 9:16 moitié image / moitié texte sans bouton vidéo.

---

## 3. Plan de Réalisation des Fichiers

| Composant | Action |
| :--- | :--- |
| `src/components/LandingScreen.tsx` | Remplacement du label « Entreprise » par « Entreprises » dans la barre fixe en bas, liaison des composants mis à jour. |
| `src/components/landing/DemoHeritagesSection.tsx` | Remplacement par l'intégration fidèle de la véritable expérience Héritage (`MatrixExplorer`) avec 8 portes au centre, 16 profils sur l'anneau et mode swipe complet. |
| `src/components/landing/DemoDuocumentairesSection.tsx` | Retrait des rôles sous les noms pour ne laisser que le **prénom en gros**, intégration de la modale d'évaluation avec **les 3 curseurs interactifs** bornée strictement à la carte vidéo, icônes officielles. |
| `src/components/landing/DemoEntrepriseSection.tsx` | Refonte vers **Afrika Fun Production** : encadré profil d'entreprise + cartes d'équipe 9:16 avec prénoms, rôles et citations épurées. |

---

## 4. Vérification & Validation
- Validation des comportements interactifs : curseurs de résonance, rotation de la roue Héritages à 16 voix, swipe des 8 duos.
- Exécution de `lint_applet` et `compile_applet`.
