# Mode Cercle — Rubrique Portraits (YonyWood)

Intégration d'un mode de visualisation circulaire immersif à deux niveaux dans la rubrique Portraits, permettant d'explorer les organisations et associations partenaires sous forme d'un soleil central entouré de 16 intervenants clés (fondateurs, collaborateurs, partenaires, clients, bienfaiteurs), avec actualisation par paliers de 16 regards et bascule fluide avec le mode Swipe.

## Décisions Clés & Réponses Validées

> [!IMPORTANT]
> Les trois choix d'architecture et d'interaction ont été validés lors de la phase de clarification :

- **Navigation à deux niveaux (Validée)** : Le mode Cercle propose un premier niveau d'exploration circulaire des organisations/associations (16 entités réparties sur un astrolabe), puis au clic sur l'une d'elles, l'organisation sélectionnée devient le Soleil central (« Reviens Devient le Soleil ») et révèle ses 16 intervenants en orbite. Un bouton de retour permet de remonter au cercle global.
- **Bascule des 16 regards supplémentaires (Validée)** : Présence d'un bouton circulaire d'actualisation interactif avec compteur de volets (ex. `Regards 1–16 / 32` ou `Volet 1/2`) permettant de faire pivoter et charger 16 nouveaux témoignages d'intervenants sans quitter l'organisation.
- **Interaction avec le soleil central (Validée)** : Le clic sur le logo central de l'entreprise ou association lance son manifeste vidéo immersif avec carte d'identité, valeurs fondamentales et histoire fondatrice.

---

## 1. Vue d'Ensemble & Concept

### Qu'est-ce que le Mode Cercle des Portraits ?
Une constellation vivante qui donne à voir l'écosystème humain gravitant autour d'une marque, d'une entreprise ou d'une association. Contrairement au défilement linéaire du mode Swipe, le mode Cercle matérialise l'organisation comme un astre solaire au centre, rayonnant vers ses parties prenantes (salariés, clients, partenaires, administrateurs, mécènes).

### Organisations & Associations Exemplaires Intégrées
1. **AFRIKAFUN** (Entreprise audiovisuelle & numérique — Créer, raconter, inspirer)
2. **Association « Voir Autrement »** (Inclusion, handicap visuel & dignité — Présidée par Pascal Cossi, avec son bureau, membres et bienfaiteurs)
3. **Association « Doli Doli »** (Culture, éveil de l'enfance & traditions orales)
4. **MTN Bénin** (Télécommunications, inclusion financière & fondation d'entreprise)
5. **Canal+ Bénin** (Création cinématographique, diffusion & talents locaux)
6. **Coopérative Ganvié Indigo** (Artisanat d'art, tisseuses et teinturières lagunaires)
7. **Éco-Ferme de Ouidah** (Agro-écologie, semences paysannes & formateurs)
8. **Théâtre Vivant de Cotonou** (Compagnie théâtrale chorale et scénographes)

---

## 2. Expérience Utilisateur & Design Visuel

### Parcours Utilisateur
```
Portraits (Navigation)
 │
 ├── [Commutateur Haut] ──> Mode Swipe (Cartes 9:16 verticales existantes)
 └── [Commutateur Haut] ──> Mode Cercle (Constellation orbitale)
      │
      ├── NIVEAU 1 : Cercle des Organisations
      │    • 16 logos/entités disposés sur l'anneau orbital
      │    • Centre : boussole / identité « Portraits & Héritages de Marques »
      │    • Clic sur une organisation -> Transition fluide vers le Niveau 2
      │
      └── NIVEAU 2 : Organisation au Centre (« Le Soleil »)
           • Centre : Logo de l'organisation + badge de statut + bouton lecture manifeste
           • Orbite : 16 intervenants (photos en pastilles rondes avec rôle & prénom)
           • Clic Intervenant : Ouverture du lecteur vidéo avec la question en bas
           • Bouton Actualisation : Rotation/rafraîchissement des 16 regards suivants
           • Bouton Retour : Remontée vers le Cercle des Organisations
```

### Identité Visuelle & Harmonie YonyWood
- **Palette** : Fond blanc / blanc cassé (`#FAF8F5`), anneau orbital discret (`#E7E5E4`), accents signature Terre Cuite (`#A2482B`), textes en `stone-900` et `stone-600`.
- **Typographie** : Titres en police éditoriale serif `font-editorial`, libellés et rôles en sans-serif géométrique `Plus Jakarta Sans`.
- **Dimensions & Responsive** : Gabarit adaptatif identique aux écrans Duos et Héritages (`max-w-[min(100%,calc(2*310px+32px))]`, hauteur calculée pour respecter l'équidistance parfaite entre le header et le BottomMenu).
- **Lecteur Vidéo** : Respect strict des règles établies : la question n'apparaît jamais sur la vidéo par défaut ; elle ne s'affiche en bas qu'au clic sur l'icône du livre ouvert (`BookOpen`), et le bouton Muet n'apparaît que lorsque la vidéo est en cours de lecture.

---

## 3. Architecture Technique & Composants

```
┌─────────────────────────────────────────────────────────────┐
│                 CompanyHeritageScreen                       │
│  ├── Header Portraits (Titre, Slogan & Switcher Swipe/Cercle)│
│  │                                                          │
│  ├── [Condition : mode === 'swipe']                         │
│  │    └── SwipeDeckView (Cartes vidéo 9:16)                 │
│  │                                                          │
│  └── [Condition : mode === 'circle']                        │
│       └── PortraitsCircleView                               │
│            ├── Barre supérieure de contrôle (Retour, Volet) │
│            ├── Canvas Orbital SVG + DOM                     │
│            │    ├── Pôle Central (Soleil de l'Organisation)  │
│            │    └── 16 Satellites (Intervenants / 16 Regards)│
│            ├── Bouton Actualisation (Pivoter les 16 regards)│
│            └── Modale Vidéo & Fiche Intervenant             │
└─────────────────────────────────────────────────────────────┘
```

### Modèle de Données Enrichi
- **`CompanyEntity`** :
  - `id`: identifiant unique
  - `companyName`: nom de la société ou association
  - `category`: domaine d'activité (Audiovisuel, Solidarité, Télécom, etc.)
  - `logoUrl` / `photoUrl`: emblème central
  - `tagline`: phrase d'accroche ou devise
  - `manifestoVideoUrl`: vidéo institutionnelle du soleil central
  - `manifestoQuestion`: question fondatrice de l'organisation
  - `stakeholders`: liste complète de 16 à 32 intervenants (avec pagination par tranches de 16)
- **`CompanyStakeholder`** :
  - `id`: identifiant
  - `name`: nom et prénom de l'intervenant
  - `roleCategory`: `'Fondateur'` | `'Collaborateur'` | `'Partenaire'` | `'Client'` | `'Bénévole'` | `'Bienfaiteur'`
  - `roleDetail`: intitulé précis (ex. « Présidente », « Trésorière », « Développeur Réseau »)
  - `photoUrl`: photo de profil
  - `videoUrl`: capsule vidéo du témoignage
  - `question`: question spécifique abordée lors de son intervention

---

## 4. Plan de Réalisation par Étapes

1. **Enrichissement des Données Organisations & Intervenants** :
   - Mise à jour de `COMPANIES_DATA` avec les entités requises (Afrikasun/Africafem, Voir Autrement, Doli Doli, MTN Bénin, Canal+ Bénin, etc.) et des jeux de 16 à 32 intervenants diversifiés.
2. **Création du Composant `PortraitsCircleView`** :
   - Trigonométrie des 16 positions circulaires équidistantes (`angle = (2 * Math.PI / 16) * i`).
   - Rendu du pôle central (logo interactif) avec effet de rayonnement discret.
   - Système de pagination des 16 regards avec bouton circulaire d'actualisation (`RotateCw`).
3. **Double Niveau de Navigation** :
   - Niveau 1 : constellation des 16 organisations partenaires.
   - Niveau 2 : zoom sur l'organisation sélectionnée devenant le soleil avec ses 16 intervenants.
4. **Intégration du Commutateur Swipe / Cercle** :
   - Ajout d'un contrôle segmenté élégant dans l'en-tête de `CompanyHeritageScreen`.
   - Conservation de la synchronisation entre l'organisation visionnée en Swipe et en Cercle.
5. **Modale Vidéo & Respect des Règles Graphiques** :
   - Affichage de la question en bas sur demande (icône livre ouvert).
   - Contrôle du volume / muet actif uniquement en lecture.
6. **Vérification & Compilation** :
   - Validation TypeScript et compilation sans erreur (`compile_applet`).
