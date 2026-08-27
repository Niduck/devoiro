# Idées d’évolution de Devoiro

Ce document rassemble les pistes à explorer après la première version de Devoiro. Il ne constitue pas encore une feuille de route : certaines idées sont prêtes à être cadrées, d’autres demandent une décision sur le fonctionnement général de l’application.

## Fiches imprimables

### Récompenses par QR code

- Ajouter un QR code de récompense sur les travaux écrits.
- Le QR code pourrait être scanné une fois le travail terminé afin d’ouvrir un cadeau ou d’obtenir une récompense.
- Cette fonction est destinée à un usage familial : le QR code est scanné par le parent, pas directement par l’enfant.
- Le contenu peut être encodé directement dans le QR code ou dans l’URL d’une page Devoiro, sans serveur ni compte en ligne.

### Réglage des lignes d’écriture

- Choisir le format des carreaux Seyès :
  - standard ;
  - grand ;
  - très grand.
- Choisir le type de ligne pour chaque exercice :
  - ligne simple ;
  - réglure Seyès.

### Exercices de découverte sur papier

- Permettre d’imprimer les exercices de découverte des couleurs.
- Permettre d’imprimer les exercices de découverte des formes.
- Adapter ces fiches à l’âge et au niveau indicatif de l’activité.

## Nouvelles activités pour la maternelle

### Décodage

Créer des exercices dans lesquels l’enfant transforme un signe écrit en information orale : lettre, son, syllabe ou mot très simple selon le niveau.

### Encodage

Créer des exercices dans lesquels l’enfant transforme ce qu’il entend ou voit en lettre, syllabe ou mot, à l’oral, à l’écran ou sur une fiche imprimée.

### Comparaison de grandeurs

- Ajouter des exercices « plus petit / plus grand ».
- Prévoir deux usages :
  - activité interactive en ligne ;
  - fiche à imprimer.

## Organisation des niveaux et des activités

### Décision retenue : supprimer les profils du parcours principal

Le parcours « profil puis niveau » est remplacé par deux accès directs : **Activités en ligne** et **Création de fiche d’activité**. Chaque activité porte elle-même son niveau indicatif et les activités en ligne sont filtrées par niveau.

Exemple pour la lecture :

1. choisir l’activité Lecture ;
2. choisir un niveau : PS, MS, GS, CP ou CE1 ;
3. choisir une période : début, milieu ou fin d’année ;
4. laisser Devoiro sélectionner et pondérer les mots, phrases ou exercices adaptés.

Cette organisation rend l’accès plus direct et permet de choisir ponctuellement un niveau différent. Le prénom devient un réglage de la fiche imprimée. Les anciennes données locales ne sont pas supprimées, mais la création d’un profil ne fait plus partie du parcours courant.

### Questions encore à trancher

- Le niveau doit-il être mémorisé entre deux activités sans imposer la création d’un profil ?
- Les périodes « début / milieu / fin d’année » doivent-elles être identiques pour toutes les activités ou définies séparément dans chaque activité ?
- Comment pondérer la sélection des contenus : fréquence des mots, longueur, sons étudiés, nombre de syllabes, complexité grammaticale et résultats précédents ?

## Principe de progression envisagé pour la lecture

Le niveau scolaire et la période ne serviraient pas uniquement de filtres. Ils détermineraient un poids pour chaque contenu afin de composer une séance progressive :

- contenus déjà accessibles, proposés souvent pour donner confiance ;
- contenus en cours d’acquisition, majoritaires dans la séance ;
- contenus légèrement plus difficiles, proposés occasionnellement ;
- phrases placées après les mots lorsque la difficulté augmente.

À terme, les réussites et les difficultés pourraient ajuster cette pondération localement, sans serveur et sans collecte de données.

## Orientation parents et enseignants

Devoiro peut rester un outil simple pour accompagner les devoirs à la maison tout en devenant utile aux enseignants pour préparer des exercices et des fiches imprimables.

### Deux usages complémentaires

- **À la maison** : activités interactives, travail quotidien, lecture au micro, profils locaux, progression et récompenses.
- **En classe** : composition rapide de fiches, choix précis du niveau, prévisualisation A4 et impression, sans profil obligatoire.

Il n’est pas nécessaire de créer deux applications ni deux interfaces entièrement séparées. Le catalogue d’activités et le configurateur peuvent être partagés, avec des fonctionnalités complémentaires selon l’usage.

### Le configurateur comme cœur de la génération

Le configurateur de fiches doit pouvoir accueillir progressivement plusieurs familles de blocs :

- écriture ;
- graphisme ;
- couleurs et formes ;
- décodage et encodage ;
- lecture et compréhension ;
- exercices de comparaison ;
- puis, à terme, d’autres matières.

Chaque bloc décrit son niveau, ses réglages, son encombrement sur la page et son rendu imprimable. La pagination A4 reste gérée automatiquement par le configurateur.

### Extension scolaire envisagée

- Étendre les niveaux au CE2, CM1 et CM2.
- Enrichir d’abord les activités et contenus déjà présents.
- Ouvrir ensuite le catalogue à d’autres matières lorsque le système de blocs est suffisamment stable.
- Permettre de filtrer le catalogue par niveau, matière et type d’usage : interactif ou imprimable.

### Point de vigilance

L’objectif n’est pas d’afficher immédiatement toutes les classes et toutes les matières. Le socle technique doit pouvoir les accueillir, mais l’interface doit uniquement montrer les activités réellement disponibles afin de rester claire pour les parents comme pour les enseignants.
