# Devoiro — règles de clean code

Ce document définit les règles à appliquer lors du prochain refactoring. Le but
est de garder une application simple à déployer sur GitHub Pages, sans sacrifier
la lisibilité, la testabilité et la capacité à ajouter de nouvelles activités.

## 1. Architecture générale

- Utiliser un véritable routeur côté client. Un écran fonctionnel correspond à
  une route explicite, et non à une succession de `if` dans `App.tsx`.
- `App.tsx` ne doit contenir que les providers globaux et la déclaration du
  routeur.
- Organiser le code par fonctionnalité (`profiles`, `reading`, `writing`,
  `kindergarten`, `rewards`) plutôt que par type technique uniquement.
- Conserver les composants partagés dans un dossier `shared` clairement séparé.
- Une fonctionnalité ne doit pas importer les détails internes d’une autre
  fonctionnalité. Elle passe par ses composants publics, ses types ou ses
  services exportés.
- Prévoir une route de secours et une stratégie compatible avec GitHub Pages.

Structure cible indicative :

```text
src/
  app/
    App.tsx
    router.tsx
    routes.ts
  features/
    profiles/
    reading/
    writing/
    kindergarten/
    rewards/
  shared/
    components/
    hooks/
    lib/
    styles/
    types/
```

## 2. Routes et navigation

- Centraliser les chemins dans `routes.ts` afin d’éviter les chaînes écrites à
  plusieurs endroits.
- Utiliser les paramètres d’URL pour les ressources identifiables, par exemple
  `/profils/:profileId`.
- Utiliser l’état de navigation uniquement pour les données temporaires qui ne
  doivent pas apparaître dans l’URL.
- Une actualisation de page doit restaurer l’écran courant lorsque cela a du
  sens.
- Les boutons précédent et suivant du navigateur doivent fonctionner.
- Les gardes de route doivent gérer l’absence de profil ou de session sans faire
  planter l’application.

## 3. Composants React

- Un composant doit avoir une responsabilité principale et un nom qui la décrit.
- Extraire un composant lorsque son JSX devient difficile à lire, qu’il est
  réutilisé ou qu’il possède sa propre logique d’interaction.
- Éviter les fichiers contenant plusieurs écrans indépendants.
- Éviter le JSX minifié sur une seule ligne. Utiliser une indentation lisible.
- Préférer la composition aux composants pilotés par de nombreux booléens.
- Ne pas conserver dans le state une valeur qui peut être calculée à partir des
  props ou d’un autre state.
- Isoler les effets de bord dans des hooks ou services nommés.
- Toute liste rendue doit utiliser une clé stable issue des données.

## 4. Logique métier

- Séparer la logique pédagogique et métier de l’affichage React.
- Les règles de validation vocale, de progression, de récompense et de
  génération d’exercices doivent être des fonctions pures autant que possible.
- Éviter les nombres magiques. Nommer les durées, scores, seuils et limites.
- Les niveaux scolaires et types d’activités doivent être décrits par des
  données typées, pas dispersés dans des conditions.
- Une fonction doit produire un résultat prévisible et éviter de modifier ses
  arguments.

## 5. TypeScript

- Interdire `any`, sauf intégration externe documentée et temporaire.
- Préférer les unions discriminées pour représenter les modes, activités et
  états de session.
- Distinguer les données persistées des modèles utilisés dans l’interface.
- Valider les données venant du `localStorage` avant de les utiliser.
- Ne pas utiliser d’assertion de type pour masquer une incohérence de modèle.
- Les props complexes doivent avoir un type nommé.

## 6. Commentaires et documentation

- Commenter les décisions, contraintes ou raisons non évidentes, pas la syntaxe.
- Ajouter un commentaire aux algorithmes pédagogiques, aux approximations de
  reconnaissance vocale et aux calculs SVG complexes.
- Documenter les contournements liés aux navigateurs, à GitHub Pages et aux API
  expérimentales.
- Ne pas ajouter de commentaires qui répètent simplement le nom de la fonction.
- Toute dette technique volontaire doit avoir un commentaire `TODO` précis avec
  la condition permettant de la supprimer.
- Les fonctions publiques ou délicates peuvent utiliser un court bloc JSDoc
  décrivant les entrées, la sortie et les cas particuliers.

## 7. État et persistance

- Centraliser l’accès au stockage local dans un service unique.
- Versionner le schéma de données et fournir une migration pour chaque changement
  incompatible.
- Ne jamais supprimer silencieusement la progression d’un enfant.
- Séparer l’état durable du profil de l’état temporaire d’une session.
- Prévoir des valeurs par défaut explicites lorsque d’anciennes sauvegardes ne
  contiennent pas un nouveau champ.

## 8. Styles et identité visuelle

- Centraliser la palette, les espacements, rayons et ombres dans des variables
  CSS.
- Éviter les anciennes règles surchargées plus loin dans le même fichier.
- Supprimer les sélecteurs devenus inutilisés après chaque refactoring.
- Découper les styles par fonctionnalité ou composant lorsque le fichier global
  devient difficile à parcourir.
- Les SVG d’identité doivent utiliser la palette officielle de Devoiro.
- Vérifier chaque écran au minimum en mobile, tablette et ordinateur.
- Les styles d’impression doivent rester isolés et ne pas dépendre de l’interface
  écran.

## 9. Accessibilité et ergonomie

- Tous les contrôles doivent être accessibles au clavier.
- Un bouton doit rester un élément `button`, et un lien un élément `a`.
- Fournir un nom accessible aux boutons uniquement graphiques.
- Ne pas utiliser la couleur comme seul indicateur d’état.
- Respecter une zone de clic adaptée aux enfants et aux écrans tactiles.
- Éviter qu’un élément fixe ou une barre de navigation bloque un contrôle.
- Respecter `prefers-reduced-motion` pour les animations importantes.

## 10. Tests et vérifications

- Tester en priorité les fonctions métier : reconnaissance d’un mot, progression
  d’une phrase, tirage pondéré des récompenses et génération des exercices.
- Ajouter des tests de navigation pour les parcours principaux.
- Ajouter un test de restauration des profils depuis le stockage local.
- Vérifier visuellement les fiches A4 et leur impression à l’échelle 100 %.
- Avant livraison, exécuter au minimum : lint, vérification TypeScript, tests et
  build de production.

## 11. Règles de nommage

- Les composants React utilisent `PascalCase`.
- Les fonctions, hooks et variables utilisent `camelCase`.
- Les hooks commencent par `use`.
- Les constantes globales utilisent `UPPER_SNAKE_CASE`.
- Les noms doivent décrire le métier : préférer `completeReadingStep` à
  `handleThing`.
- Les fichiers d’écran se terminent par `Page` et les composants de formulaire
  par un nom fonctionnel explicite.

## 12. Definition of Done

Une modification est terminée lorsque :

- le comportement demandé est complet ;
- le code respecte les règles de ce document ou la dérogation est expliquée ;
- aucun code, style, import ou asset mort n’a été ajouté ;
- les cas d’erreur et données historiques sont pris en compte ;
- l’interface est vérifiée aux tailles pertinentes ;
- le lint, TypeScript, les tests et le build passent ;
- la documentation produit ou technique est mise à jour si nécessaire.

## Priorités du futur refactoring

1. Découper progressivement `AppRouter.tsx` par fonctionnalité.
2. Déplacer les fonctionnalités dans leurs dossiers dédiés.
3. Extraire la logique métier et les hooks de session.
4. Nettoyer et découper la feuille de styles globale.
5. Ajouter les tests sur la lecture, la progression et la persistance.
6. Documenter les algorithmes et contraintes réellement non évidents.
