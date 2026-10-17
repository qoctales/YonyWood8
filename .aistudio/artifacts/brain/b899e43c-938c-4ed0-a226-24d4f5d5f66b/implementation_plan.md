# Espace Créateur : Historique des Vidéos, Statistiques & Modération par Signalement

Système complet de gestion personnelle pour les créateurs dans le Studio YonyWood (accès rapide en haut à droite vers « Mes publications », métriques d'audience, renommage et suppression sécurisée), combiné à un menu d'action à trois points sous l'icône de partage sur les cartes vidéo pour signaler tout contenu avec motifs prédéfinis et justification.

### Décisions Validées & Synthèse Phase 1

> [!IMPORTANT]
> Les trois choix d'expérience utilisateur ont été validés directement :
> - **Accès Studio** : Bouton d'accès rapide élégant **« Mes publications »** logé en haut à droite de l'en-tête du Studio, permettant d'alterner instantanément entre le parcours de dépôt et la gestion des récits postés.
> - **Gestion des Vidéos Créateur** : Fiches vidéos enrichies affichant le statut de validation éditoriale (`En attente`, `Certifié`, `Rejeté`), les statistiques d'engagement (vues réelles/simulées, taux de complétion, date de dépôt), avec **édition du titre du récit** et **suppression définitive** (avec dialogue de confirmation anti-fausse manipulation).
> - **Signalement Vidéo** : Icône discrète à trois points verticaux (`···`) située directement sous l'icône de partage sur les lecteurs et cartes vidéo, ouvrant une modale avec **motifs prédéfinis** (droits d'auteur, propos inappropriés, qualité dégradée, fausse attribution) et champ de justification courte.

---

## 1. Vue d'Ensemble & Concept Clé

- **Ce que fait la fonctionnalité** : 
  1. Permet à tout créateur connecté (ou utilisant la session créateur) d'accéder d'un clic à son catalogue personnel de vidéos téléversées dans le Studio.
  2. Fournit un tableau de bord clair avec les métriques clés de chaque vidéo (vues, complétion, date, sujet de rattachement, statut de validation).
  3. Donne au créateur le contrôle total sur sa mémoire partagée : modification du titre/pitch et suppression synchronisée (Firestore `submitted_videos` + stockage local de repli).
  4. Intègre un point de modération communautaire universel sur toutes les vidéos (portes d'héritage, duos, lecteur immersif) via un menu `···` permettant un signalement qualifié stocké dans Firestore (`reports`).

- **Public Cible** : 
  - Réalisateurs indépendants, créateurs de récits vivants et spectateurs actifs contribuant au corpus documentaire.

- **Bénéfice Clé** : 
  - Clôture la boucle de contribution : l'utilisateur ne poste plus « à l'aveugle », il suit ses vidéos, mesure son impact et peut corriger ou retirer ses créations, tout en offrant aux spectateurs un moyen standard de protéger la dignité du corpus.

---

## 2. Expérience Utilisateur & Design Visuel

### A. Parcours Créateur dans le Studio (`SubmitStoryScreen`)
1. **Bouton d'en-tête** : Dans la barre supérieure du Studio, à côté du bouton retour, un bouton distinctif avec badge de décompte : `Mes publications (N)`.
2. **Vue « Mes Publications »** :
   - Grille responsive au ratio 9:16 / cartes horizontales compactes adaptées au mobile et au desktop.
   - En-tête de synthèse : Total des vidéos soumises, Vues cumulées, Statut de publication (En examen / Publié au catalogue).
   - Carte de vidéo individuelle :
     - Miniature 9:16 avec aperçu vidéo au survol / lecture test.
     - Badge statut typographique clair (sans pillule superflue) : `En cours d'examen` · `Publié` · `Brouillon`.
     - Chiffres clés : `1 240 vues` · `84% complétion` · `Déposé le 14 oct. 2026`.
     - Action d'édition rapide : modification du titre du récit en ligne avec sauvegarde immédiate.
     - Action de suppression : bouton corbeille sobre ouvrant une confirmation explicite pour éviter toute perte accidentelle.
   - État vide bienveillant : invitation à déposer un premier récit si aucune vidéo n'est enregistrée.

### B. Menu 3 Points & Modale de Signalement (`VideoCardActionMenu`)
1. **Emplacement** : Placée verticalement directement sous l'icône de partage (par exemple dans `SwipeModeHeritage`, `DuoFeedScreen` et `MatrixExplorer`).
2. **Interaction** :
   - Clic sur `···` (`MoreVertical`) : ouvre une modale cinématographique sombre (`#171614`, bordure fine ambre/pierre).
   - Choix du motif parmi 5 options claires :
     - Atteinte aux droits d'auteur ou usurpation d'identité
     - Propos haineux, dégradants ou injurieux
     - Non-respect de la direction éditoriale YonyWood
     - Qualité vidéo ou audio impropre à la diffusion
     - Autre motif
   - Zone de texte optionnelle : « Précisez en quelques mots (facultatif) ».
   - Bouton de soumission `Envoyer le signalement` avec accusé de réception toast discret (« Signalement transmis à l'équipe éditoriale »).

---

## 3. Décisions Produits & Arbitrages

1. **Persistance Hybride Firestore + Cache Local** :
   - *Choix* : Synchronisation prioritaire avec la collection Firestore `submitted_videos` et `reports`, adossée à un cache `localStorage` instantané.
   - *Pourquoi* : Permet une fluidité immédiate sans latence réseau, garantit la persistance multi-appareils pour les utilisateurs authentifiés, et fonctionne sans friction même en mode déconnexion temporaire.

2. **Édition du Titre ciblée (sans altérer le fichier vidéo source)** :
   - *Choix* : Autoriser la mise à jour du titre, du pitch et des crédits du récit, mais pas le remplacement à chaud du binaire vidéo (nécessite un nouveau dépôt).
   - *Pourquoi* : Maintient l'intégrité de la direction éditoriale et de la chaîne de vérification vidéo.

3. **Signalement sans blocage agressif immédiat** :
   - *Choix* : Enregistrer le signalement côté base de données pour la régie éditoriale sans masquer unilatéralement la vidéo pour l'ensemble des spectateurs dès le 1er clic (conformément aux souhaits du créateur).
   - *Pourquoi* : Évite les abus de censure croisée tout en fournissant une traçabilité rigoureuse.

---

## 4. Architecture Technique & Stratégie des Données

```
┌────────────────────────────────────────────────────────────────────────┐
│                          STUDIO INTERFACE                              │
│                                                                        │
│  [ ← Retour ]      STUDIO DE CRÉATION       [ Mes publications (2) ]   │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ Toggle Vue
               ┌─────────────────────┴─────────────────────┐
               ▼                                           ▼
      [ Dépôt de Récit ]                         [ Mes Vidéos & Stats ]
      - Choix de la Porte                        - Cartes vidéos 9:16
      - Upload vidéo / Réalisateur               - Édition titre en direct
      - Métadonnées & Crédits                    - Métriques d'audience
                                                 - Suppression confirmée
                                                           │
                                                           ▼
                                         ┌───────────────────────────────────┐
                                         │  firestoreService:                │
                                         │  - fetchUserVideos(userId)        │
                                         │  - updateVideoTitle(id, title)    │
                                         │  - deleteSubmittedVideo(id)       │
                                         └───────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                     CARTES & LECTEURS VIDÉO                            │
│                                                                        │
│   [ Partager ]  ────────►  Copie du lien certifié                      │
│        │                                                               │
│   [   ···    ]  ────────►  Modale Signalement                          │
│   (3 points)               - Motifs : Droits, Abus, Qualité...         │
│                            - Justification courte                      │
│                            - Soumission -> Collection 'reports'        │
└────────────────────────────────────────────────────────────────────────┘
```

### Entités et Collections Firestore
1. `submitted_videos` :
   - `id`: string
   - `userId`: string
   - `userName`: string
   - `userEmail`: string
   - `seriesId`: string
   - `seriesTitle`: string
   - `question`: string
   - `videoUrl`: string
   - `protagonistName`: string
   - `pitch`: string
   - `viewsCount`: number (par défaut initialisé avec métriques réelles/démo)
   - `completionRate`: number
   - `status`: `'pending' | 'approved' | 'rejected'`
   - `createdAt`: serverTimestamp
2. `reports` :
   - `id`: string
   - `targetVideoId`: string
   - `targetTitle`: string
   - `reason`: string
   - `details`: string
   - `reporterEmail`: string
   - `createdAt`: serverTimestamp
   - `status`: `'PENDING'`

---

## 5. Étapes d'Exécution Planifiées

1. **Services Firestore & État Local (`firestoreService.ts`)** :
   - Ajout des fonctions `fetchUserSubmittedVideos(userId, email)`
   - Ajout de `updateSubmittedVideoTitle(videoId, newTitle)`
   - Ajout de `deleteSubmittedVideo(videoId)`
   - Ajout de `submitVideoReport(reportData)`
2. **Interface Historique dans le Studio (`SubmitStoryScreen.tsx`)** :
   - Ajout du bouton d'accès rapide `Mes publications` dans la barre haute du Studio.
   - Composant dédié pour l'affichage des vidéos déposées, avec affichage des statistiques enrichies.
   - Formulaire inline pour renommer le titre du récit.
   - Modale de confirmation de suppression avant retrait effectif.
3. **Bouton 3 points & Modale de Signalement (`SwipeModeHeritage.tsx`, `DuoFeedScreen.tsx`, `MatrixExplorer.tsx`)** :
   - Intégration du bouton `···` sous l'icône de partage sur chaque carte vidéo.
   - Modale de signalement réutilisable avec motifs présélectionnés et justification.
4. **Vérification & Validation** :
   - Test de compilation TypeScript (`compile_applet`).
   - Validation du cycle complet (dépôt -> historique -> renommage -> suppression) et de l'envoi de signalement.
