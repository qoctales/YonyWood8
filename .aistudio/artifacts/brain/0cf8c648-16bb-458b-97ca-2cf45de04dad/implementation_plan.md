# Ajustements Clés Validés : Écran Vidéastes (« Choisir un expert »)

1. **Positionnement & dimensions identiques aux cartes du Studio** :
   - Application des marges et hauteurs standardisées (`pb-20 sm:pb-24 pt-safe pb-safe`, `h-[min(410px,calc(100dvh-230px))] sm:h-[min(480px,calc(100dvh-200px))] md:h-[min(520px,calc(100dvh-180px))]`).
   - Plus aucun chevauchement avec la barre de navigation haute (`Navbar`) ni avec le menu bas (`BottomMenu`).

2. **Retour contextuel précis** :
   - Le bouton « Retour » ramène désormais précisément sur l'écran précédent où l'utilisateur se trouvait (le Duo avec « Télécharger sa vidéo » et « Choisir un expert »), lui permettant de choisir de téléverser sa vidéo sans repartir de zéro.

3. **Disposition Nom & Tarif** :
   - Prénom du réalisateur au premier plan en typographie éditoriale (`Roméo`, `Ayaba`).
   - Tarif estimé en euros positionné directement en dessous (`À partir de 180 €`).

4. **Bouton Viseur d'objectif (`Focus`) & Modale technique** :
   - Ajouté dans le dock latéral droit (aux côtés de `ProfileSoloIcon` et `ShareIcon`).
   - Ouvre une modale calquée sur le format et la largeur de la carte vidéo, présentant :
     - Localisation (ville et pays, ex. Cotonou, Bénin)
     - Matériel & caméras de tournage
     - Conditions, disponibilité et tarif
     - Références et univers documentaires
     - Langues parlées
     - Bouton d'accès direct au portrait complet.
