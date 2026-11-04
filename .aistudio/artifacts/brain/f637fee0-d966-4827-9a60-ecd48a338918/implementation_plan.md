# Harmonisation de la barre de navigation — Touches Terracotta & Pieds Rétro Dialogue

Ce plan détaille la proposition de design pour les rappels de couleur Terracotta (`#A2482B`) au repos sur chacune des 5 icônes de la navigation, ainsi que le recalibrage des pieds courts du téléviseur rétro Dialogue conformément à la capture officielle.

## Avis & Analyse de Design

> [!TIP]
> **Votre idée est remarquable et hautement recommandée.**
> L'ajout d'une touche ponctuelle de Terracotta (`#A2482B`) sur chaque icône inactive transforme la barre de navigation :
> - **Signature visuelle unifiée** : Chaque icône partage l'ADN couleur de la marque YonyWood sans alourdir le dessin.
> - **Hiérarchie parfaite** : Le gris (`#6E6254`) assure la structure du trait, tandis que le terracotta agit comme une ponctuation subtile (le regard, la cible, le repère).
> - **Contraste parfait en actif** : Dès qu'une icône est sélectionnée, la capsule entière devient terracotta et tous les éléments de l'icône passent en blanc pur pour une lisibilité maximale.

---

## 1. Proposition détaillée des 5 rappels Terracotta (Mode Inactif)

| Icône | Élément teinté en Terracotta (`#A2482B`) | Rôle visuel |
| :--- | :--- | :--- |
| **Dialogue** | Les **deux pupilles centrales** dans chaque carré | Regard jumelé / miroir (déjà validé et conforme à la capture) |
| **Focus** | Le **point central de visée** (`cx="12" cy="12"`) | Cible de mise au point / focalisation documentaire |
| **Portrait** | Les **deux yeux du visage-écran** | Regard du protagoniste solo, en écho direct aux yeux de Dialogue |
| **Action** | Les **deux bandes obliques** de la claquette supérieure | Hachures caractéristiques de la claquette de tournage |
| **Studio** | Le **dossier supérieur** du fauteuil de réalisateur | Toile du fauteuil où s'assoit le créateur / cinéaste |

*En mode actif (sélectionné), l'ensemble de l'icône devient blanc monochrome (`#FFFFFF`) sur la capsule Terracotta pour un contraste franc et net.*

---

## 2. Correction de l'icône Dialogue (Pieds courts & console rétro)

### Le constat
Dans la version précédente, les pieds s'étiraient vers le bas pour atteindre la ligne de base, ce qui leur donnait une allure de « jambes » de personnage plutôt que de « petits pieds biseautés de téléviseur console ». 

### La solution géométrique
1. **Pieds courts et robustes** : La hauteur des pieds passe de 5,4 px à **2,8 - 3,2 px** (soit environ 22 % de la hauteur totale, ratio exact mesuré sur votre capture d'écran).
2. **Double carré agrandi et majestueux** : Le boîtier double carré est légèrement agrandi pour occuper le volume noble au centre, avec une séparation centrale nette formant deux carrés parfaits.
3. **Harmonie globale** : La boîte prend davantage de présence visuelle, les pieds font office de cales biseautées vintage, et l'assise générale reste parfaitement équilibrée avec les 4 autres icônes.

```
      ┌───────────┬───────────┐
      │     ●     │     ●     │   <- Boîtier double carré noble (78% de la hauteur)
      └───────────┴───────────┘
         /                     \      <- Petits pieds courts & stables (22% de la hauteur)
```

---

## 3. Architecture & Implémentation technique

### Composants mis à jour dans `src/components/`

```
┌────────────────────────────────────────────────────────┐
│               YonywoodBrandIcons.tsx                   │
│                                                        │
│  ├─ DuocumentairesTvIcon : pieds courts + double carré │
│  ├─ ProfileSoloIcon      : yeux terracotta inactifs    │
│  ├─ CameraLensFocusIcon  : point central terracotta    │
│  ├─ DirectorChairIcon    : dossier toile terracotta    │
│  └─ ActionClapperIcon    : hachures obliques terracotta│
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                    BottomMenu.tsx                      │
│                                                        │
│  └─ Branchement des 5 icônes harmonisées avec gestion  │
│     du prop `isActive` pour basculer le terracotta     │
└────────────────────────────────────────────────────────┘
```

---

## 4. Plan de validation

1. **Vérification visuelle de la ligne de flottaison** : Contrôler que la barre reste homogène, avec une présence optique équivalente des 5 pastilles.
2. **Test du mode actif / inactif** : Vérifier que le passage au blanc sur fond terracotta est immédiat et sans artefact.
3. **Compilation & Lint** : Exécution de `tsc --noEmit` et validation de la compilation Vite sans erreurs.
