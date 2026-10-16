# Évolution Cartes Duos, Connexion Fond Blanc & Visuels Illustrés d'Accueil

Plan détaillé pour répondre précisément aux trois demandes de l'utilisateur : refonte de l'affichage textuel des cartes vidéo dans les duos, simplification du formulaire de connexion sur fond blanc avec bouton démo immédiat, et intégration d'illustrations artistiques de personnages noirs sur la page d'accueil.

## Décisions Validées & Synthèse des Choix

> [!IMPORTANT]
> Les trois choix directeurs ont été confirmés suite à votre retour :
> 1. **Cartes Vidéo des Duos** : Suppression des badges de pays et villes sur les deux cartes. En haut de chaque carte, remplacement du badge d'univers par le nom correspondant de la série (Pôle A = 1er nom, Pôle B = 2nd nom, ex : *Finagnon* à gauche et *Qosqorico* à droite).
> 2. **Formulaire de Connexion sur Fond Blanc** : Remplacement du design sombre par un fond blanc lumineux et ultra-épuré. Suppression des mentions superflues ("Espace membres", "YonyWood", description longue). Ajout d'un bouton direct et proéminent **« Connexion Démo Immédiate (1 clic) »** permettant d'accéder sans blocage à la plateforme.
> 3. **Visuels de la Page d'Accueil** : Conservation du format 9:16 vertical d'origine, en remplaçant les photos actuelles par des illustrations artistiques soignées représentant des personnages noirs charismatiques et inspirants.

---

## 1. Vue d'Ensemble & Objectifs

- **Clarté narrative sur les duos** : Le titre de chaque série (constitué de deux composantes distinctes, ex. *Finagnon < > Qosqorico*, *Blacks One < > Beyond Eve*, *Esu < > Jesus*, etc.) est désormais directement incarné par chaque carte vidéo.
- **Accès fluide et instantané** : Débloquer l'exploration de l'application grâce à un accès direct en un clic avec un profil démo (administrateur & coproducteur), dans une interface de connexion sur fond blanc minimaliste et élégante.
- **Identité visuelle de la page d'accueil** : Donner immédiatement le ton artistique et cinématographique avec des portraits dessinés de haute qualité reflétant la profondeur culturelle du projet.

---

## 2. Expérience Utilisateur & Design Visuel

### A. Cartes Vidéo des Duos (`DuoFeedScreen.tsx`)
- **Suppression des pays et villes** :
  - Disparition complète des étiquettes inférieures contenant les drapeaux, pays et villes (ex. `🇧🇯 Bénin • Cotonou`, `🇵🇪 Pérou`).
  - Le bas de la carte met en valeur le prénom du protagoniste de manière aérée, épurée et lisible.
- **Répartition des deux noms de la série** :
  - Le titre de la série active (ex: `Finagnon < > Qosqorico`) est scindé autour du séparateur `< >` ou `<>`.
  - **Carte Gauche (Pôle A)** : Le badge supérieur affiche le **1er nom** de la série (ex: *Finagnon*).
  - **Carte Droite (Pôle B)** : Le badge supérieur affiche le **2nd nom** de la série (ex: *Qosqorico*).
  - Application cohérente aussi bien en **Vue Duo** (côte à côte) qu'en **Vue Deck** (carte pleine largeur avec bascule).

### B. Formulaire de Connexion sur Fond Blanc (`AuthModal.tsx`)
- **Design Fond Blanc Épuré** :
  - Boîte modale sur fond blanc pur (`bg-white`), bordures délicates en pierre (`border-stone-200`), typographie sombre et contrastée (`text-stone-900`).
  - En-tête simplifié : seul le mot **« Connexion »** (ou « Créer un compte » selon l'onglet actif) est affiché, avec suppression de *« Espace Membre YonyWood »* et des textes explicatifs encombrants.
- **Accès Démo en 1 Clic** :
  - Ajout d'un bouton bien visible : **« Connexion Démo Immédiate »** avec icône éclair/étoile et badge profil démo.
  - Au clic : initialisation automatique de la session avec le profil démo (`Romeo Nonvide` / administrateur ou coproducteur), fermeture de la modale et redirection immédiate vers la découverte des duos.
  - Conserve la possibilité classique de saisir un e-mail ou créer un nouveau compte.

### C. Page d'Accueil & Nouvelles Illustrations (`LandingScreen.tsx`)
- **Maintien du format 9:16 vertical** :
  - Conserve le conteneur cinématographique vertical avec les flèches de navigation et la gestuelle tactile de swipe.
- **Remplacement des visuels** :
  - Remplacement des images génériques actuelles par une sélection d'illustrations de personnages noirs dessinés avec raffinement et élégance (tirées des créations graphiques dédiées du projet).
  - Épuration des commandes et icônes pour mettre en valeur les illustrations et susciter la curiosité pour l'univers documentaire.

---

## 3. Architecture Technique & Flux de Données

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PAGE D'ACCUEIL (LANDING)                      │
│   - Header épuré : Logo YonyWood + boutons Inscription / Connexion     │
│   - Carrousel 9:16 : 3 illustrations soignées de personnages noirs     │
│   - Navigation fluide par swipe & flèches latérales                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                         Clic sur "Connexion"
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       MODALE DE CONNEXION (FOND BLANC)                 │
│   - Titre minimaliste : "Connexion"                                    │
│   - [★ Connexion Démo Immédiate (1 clic)] ──► Redirection directe      │
│   - Formulaire classique épuré (Email / Mot de passe)                  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                          Connexion réussie
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FLUX DES DUOS (DUO FEED)                        │
│   - Carte A (Gauche)  : Badge haut = 1er Nom Série (ex: Finagnon)      │
│                         Prénom protagoniste (pays/villes supprimés)    │
│   - Carte B (Droite)  : Badge haut = 2nd Nom Série (ex: Qosqorico)     │
│                         Prénom protagoniste (pays/villes supprimés)    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Plan d'Exécution par Étapes

1. **Refonte de `AuthModal.tsx`** :
   - Basculer le conteneur principal et les champs en thème clair (fond blanc, bordures pierre, texte sombre).
   - Supprimer le surtitre "Espace Membre YonyWood" et le paragraphe descriptif.
   - Intégrer le bouton d'accès rapide « Connexion Démo Immédiate » connecté à `login('qoctales@gmail.com')`.
2. **Actualisation de `DuoFeedScreen.tsx` (et `DuoScreen.tsx`)** :
   - Extraire les deux segments du titre de série (`parts[0]` et `parts[1]`).
   - Remplacer `themeA` et `themeB` par les deux noms respectifs de la série.
   - Retirer les blocs d'affichage du pays, du drapeau et de la ville sous les prénoms des protagonistes (en mode duo et en mode deck).
3. **Mise à jour de `LandingScreen.tsx`** :
   - Remplacer les 3 images d'onboarding par les magnifiques portraits illustrés de personnages noirs.
   - Nettoyer et affiner l'affichage des cartes pour un rendu graphique percutant.
4. **Validation et Compilation** :
   - Vérifier le fonctionnement de la connexion démo en 1 clic.
   - Exécuter `compile_applet` et `lint_applet` pour garantir l'absence de régression.
