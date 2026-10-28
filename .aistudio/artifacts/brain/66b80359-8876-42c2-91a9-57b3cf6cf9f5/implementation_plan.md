# Plan d'Implémentation : Refonte Ciblée des Comptes, des Parts & de la Navigation YonyWood

Ce plan détaille la transformation ciblée de la plateforme selon vos arbitrages : séparation stricte entre comptes **Individu** et **Organisation**, intégration de la **gestion des parts** dans le Back-Office personnel, allègement de la fiche d'identité, **retrait immédiat du bouton Lignée**, enrichissement du **Header** (« Présentation », « Connexion », « Inscription ») et articulation entre la **vitrine publique** et le **mode membre connecté**.

---

## 1. Principes & Règles Métier

1. **Séparation Stricte Individu vs Organisation** :
   - Un compte est **soit** Individu, **soit** Organisation (aucune ambiguïté possible à l'inscription).
   - **Compte Individu** : Possède sa page Portrait épurée (nom, prénom, identifiant `@handle`, ville/territoire, phrase d'accroche courte, photo). Dans l'onglet *Lumière*, il ne peut publier que pour documenter ou témoigner d'une organisation dont il fait partie ou qui l'a invité.
   - **Compte Organisation** (Entreprise, Association, Coopérative, Institution) : N'a pas de page Portrait individuelle. Elle a sa page vitrine au niveau 1 de **Lumière**. Elle rassemble les vidéos d'impact racontées sur elle par ses collaborateurs, clients, documentaristes ou partenaires.
2. **Allègement de l'Identité dans les Paramètres** :
   - Suppression des champs superflus (longues biographies, formulaires administratifs complexes).
   - Concentration sur l'essentiel : Nom/Prénom, `@handle`, Ville/Territoire, Phrase d'accroche (1-2 lignes), Photo de profil.
3. **Module dédié de Gestion des Parts (Coproduction & Actionnariat)** :
   - Ajout d'une section dédiée dans les Paramètres :
     - Nombre de parts acquises et date d'entrée dans la communauté.
     - Montant total investi et estimations de redevances / dividendes.
     - Bouton d'action directe : **« Acquérir de nouvelles parts »** (redirigeant vers la campagne de coproduction ou ouvrant le formulaire de souscription).
4. **Retrait immédiat de l'icône & du bouton Lignée** :
   - Suppression de l'icône Arbre (🌳) et du bouton Lignée sur l'interface (profils et paramètres) pour simplifier le parcours et éliminer toute friction.
5. **Header Reconfiguré** :
   - Le bouton *« Co-construire »* devient **« Présentation »** (page manifeste expliquant le projet, ses portes et sa vision).
   - Affichage côte à côte des boutons **« Inscription »** et **« Connexion »** pour les visiteurs non connectés, ou du statut utilisateur épuré une fois connecté.
6. **Double Expérience Visiteur vs Connecté** :
   - **Visiteur** : Vitrine modèle riche et complète (16 duos, épisodes piliers, entreprises de référence dans Lumière) avec invitation à rejoindre la plateforme.
   - **Connecté** : Même vitrine prestigieuse enrichie de ses propres vidéos soumises, de son statut de validation éditoriale, de ses parts et de ses raccourcis Studio.

---

## 2. Plan des Modifications par Fichiers

### Phase 1 : Types & Structure de Données (`src/types.ts`)
- Consolider `AccountType = 'INDIVIDUAL' | 'ORGANIZATION'` sans mélange possible.
- Simplifier `UserAccount` pour rendre l'identité légère (`name`, `handle`, `city`, `catchphrase`, `avatarUrl`, `sharesCount`, `sharesInvestedAmount`, `sharesAcquiredDate`).
- Définir `OrganizationProfile` pour les entités Lumière (nom officiel, catégorie d'organisation, secteur, logo, territoire, liste des collaborateurs accrédités).

### Phase 2 : Inscription & Authentification (`src/components/AuthModal.tsx` & `src/services/authContext.tsx`)
- À l'inscription : sélecteur exclusif entre :
  - **👤 Compte Individu** (Créateur, témoin, collaborateur, spectateur, actionnaire).
  - **🏛️ Compte Organisation** (Entreprise, association ou coopérative pour Lumière).
- Formulaire épuré pour l'Individu : Nom complet, e-mail, ville, mot de passe.
- Formulaire Organisation : Nom de la structure, catégorie (Entreprise / Association / Coopérative), ville, représentant légal, e-mail, mot de passe.
- Rendre les comptes hermétiques sans bascule hybride.

### Phase 3 : Paramètres & Gestion des Parts (`src/components/SettingsScreen.tsx`)
- Alléger l'onglet **Identité** : suppression des formulaires lourds, affichage épuré (Nom, `@handle`, Territoire/Ville, Phrase courte, Photo).
- Créer l'onglet **Mes Parts & Coproduction** :
  - Compteur de parts détenues (ex: 125 parts).
  - Date d'entrée dans le capital / coproduction de la plateforme.
  - Estimation des retombées et transparence.
  - Bouton direct **« Souscrire / Acheter des parts »** lié à l'écran de coproduction.
- Retirer l'onglet ou les boutons liés à la Lignée.
- Conserver l'onglet **Mes Vidéos** avec la suppression de vidéo et les statuts éditoriaux clairs (🟡 *En examen éditorial*, 🟢 *En ligne*, 🔴 *Retouche demandée*).

### Phase 4 : Écran Portrait & Nettoyage de l'Interface (`src/components/ProfileSettingsScreen.tsx`)
- Retirer l'icône de l'arbre généalogique (🌳).
- Garder uniquement l'icône Paramètres (⚙️) visible lorsque le propriétaire consulte son propre profil.
- Afficher sur le profil Portrait la phrase d'accroche courte, la ville et un bloc synthétique sur les parts détenues si public.

### Phase 5 : Header & Navigation (`src/components/Navbar.tsx` ou composant Header équivalent)
- Renommer le bouton « Co-construire » en **« Présentation »**.
- Intégrer les boutons **« Connexion »** et **« Inscription »** bien identifiables pour les visiteurs non connectés.
- Si connecté : afficher l'avatar/identifiant de l'utilisateur avec accès rapide à son profil ou ses paramètres.

### Phase 6 : Onglet Lumière (`src/components/LumiereScreen.tsx` ou équivalent)
- Afficher les organisations inscrites au niveau 1.
- Restreindre la proposition de vidéos dans une organisation aux seuls membres individuels accrédités ou via invitation de l'organisation.

---

## 3. Étapes de Vérification
1. **Compilation TypeScript & Lint** : validation sans avertissement via `tsc --noEmit` et `compile_applet`.
2. **Parcours Inscription** : tester l'inscription d'un Individu et celle d'une Organisation, vérifier que les deux types sont étanches.
3. **Parcours Paramètres** :
   - Vérifier la légèreté de l'onglet Identité (nom, ville, phrase d'accroche, photo).
   - Tester l'onglet Parts (affichage du nombre de parts, date d'entrée, bouton d'acquisition).
   - Confirmer l'absence totale de l'arbre ou de boutons Lignée.
4. **Header** : vérifier la présence de « Présentation », « Connexion » et « Inscription ».
5. **Vérification Visiteur vs Connecté** : contrôler que la vitrine reste riche et inspirante hors connexion, et que le profil connecté est bien alimenté.
