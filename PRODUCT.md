# Devoiro — cadrage produit

## Objectif

Devoiro accompagne les enfants dans l'apprentissage de la lecture, puis de
l'écriture. L'application doit rester simple, encourageante, utilisable en
famille et entièrement statique afin de pouvoir être hébergée gratuitement sur
GitHub Pages.

## Parcours principal

1. Créer ou sélectionner un profil enfant.
2. Choisir une activité adaptée à la classe.
3. En CP/CE1, choisir **Lecture** ou **Écriture**, puis en lecture un travail ponctuel ou quotidien.
4. En Maternelle, choisir parmi les couleurs, l’alphabet à lire, l’alphabet à tracer et le graphisme.

### Profil enfant

Chaque profil contient :

- un prénom ;
- un avatar Devoiros parmi les cinq personnages disponibles ;
- une classe : Maternelle, CP ou CE1 ;
- une période : début, milieu ou fin d'année pour le CP et le CE1 ;
- sa progression quotidienne et ses récompenses.

Les profils et leur progression sont stockés localement dans le navigateur.
Le Devoiros représente l’enfant dans toute l’interface et se déplace dans le
parcours quotidien.
La Maternelle reste un seul niveau dans le profil : les repères PS, MS et GS
sont affichés sur les activités, car un même enfant peut utiliser des exercices
de plusieurs sections selon son rythme.

### Activités Maternelle

- **Découverte des couleurs — dès la PS** : une couleur est affichée et l’enfant la nomme à voix haute ;
- **Nom des lettres — MS/GS** : une lettre est affichée et l’enfant dit son nom ;
- **Son des lettres — GS** : une lettre est affichée et l’enfant produit son son scolaire principal (`N` → « neu ») ;
- **Alphabet · Écriture — GS** : une fiche A4 permet de repasser sur les lettres ;
- **Graphisme — PS/MS/GS** : le parent compose une fiche A4 de tracés pointillés (traits, ronds, vagues, ponts, boucles, formes et spirales).

Les activités orales utilisent la reconnaissance vocale et conservent une
validation manuelle lorsque le navigateur comprend mal l’enfant.

### Travail ponctuel

Le parent choisit :

- une partie chronométrée d'une minute ou une partie sans chronomètre ;
- le niveau de lecture, avec un exemple du contenu proposé ;
- la séparation syllabique et/ou la coloration des sons complexes.

### Travail quotidien

Une séance contient de 3 à 5 exercices selon la classe et la période :

1. échauffement ;
2. mots simples ;
3. mots plus complexes ;
4. mini-défi de mots pour les profils avancés ;
5. phrases, toujours placées en dernière étape.

Le personnage avance après chaque exercice. Après un exercice non réussi, le
parent peut recommencer en activant directement une aide à la lecture. Une fois
toute la séance terminée, l'enfant ouvre un cadeau et obtient une récompense
aléatoire parmi celles activées dans son profil.

### Récompenses

Les récompenses peuvent être activées, désactivées et personnalisées. Elles ont
une rareté qui détermine leur probabilité :

- commune : poids 6 ;
- peu commune : poids 3 ;
- rare : poids 1.

Une récompense affective comme un bisou est donc plus fréquente qu'un temps de
console. Le cadeau n'est ouvert qu'à la fin du travail quotidien.

## Aides à la lecture

- La séparation syllabique affiche le mot découpé, puis le mot original juste
  en dessous : `lu·mi·neux` puis `lumineux`.
- Le découpage est basé en priorité sur des données pédagogiques explicites ;
  l'algorithme n'est qu'une solution de secours.
- L'aide syllabique se désactive automatiquement pour les phrases.
- Seules les associations de lettres (`ou`, `an`, `en`, `ai`, `au`, `oi`, etc.) peuvent être colorées ; les consonnes comme `ch`, `ph`, `gn` ou `qu` restent neutres.
- Les aides restent activables et désactivables pendant une séance.
- La police de lecture est configurable : Nunito, Outfit, Quicksand, Marelle Bâton ou Marelle cursive. Les deux variantes Marelle sont les webfonts officielles du ministère, intégrées localement sous licence OFL.
- Dans une phrase, les mots déjà reconnus sont surlignés de manière cumulative et ne redeviennent jamais non lus pendant la reconnaissance.

## Encouragements

- Toute réussite déclenche une animation positive.
- Un mot ou une phrase lu rapidement déclenche **Super bravo !**.
- Le seuil dépend de la classe, de la période et de la longueur du contenu.
- Une validation manuelle ne déclenche jamais le bonus de vitesse.

## Consigne parentale

Avant chaque exercice, une courte consigne est présentée au parent pour qu'il
puisse la lire à l'enfant. Le micro et le chronomètre ne démarrent qu'après le
bouton **On commence**.

## Écriture

Le mode Écriture génère des fiches A4 imprimables avec :

- capitales avec Marelle Bâton ou cursive avec Marelle, les polices scolaires officielles du ministère ;
- un mot ou une phrase saisi par le parent ou généré localement ;
- un seul modèle, placé à gauche ;
- deux zones Seyès encadrées : le modèle gris à repasser puis une ligne vierge, avec interlignes de 2 mm, ligne principale renforcée tous les 8 mm et texte calé sur cette ligne de base ;
- jusqu’à quatre jours d’exercices sur une même feuille ;
- une fiche maternelle avec les 26 lettres grisées dans un grand quadrillage ;
- impression A4 depuis le navigateur.

## Architecture technique

- React + Vite, sans serveur applicatif ;
- navigation interne compatible avec GitHub Pages ;
- composants séparés pour les profils, activités, réglages, lecture, progression
  quotidienne, récompenses et résultats ;
- données pédagogiques séparées de l'interface ;
- `localStorage` versionné pour les profils et la progression ;
- aucune notification push dans cette version ;
- build statique dans `dist/` et workflow GitHub Pages prêt à l'emploi.

## Identité visuelle

- fond principal blanc ;
- couleur principale turquoise foncé `#29847F`, issue de la palette des illustrations ;
- encre vert profond `#053330` ;
- accents jaune `#F9C400`, orange `#FFA300`, turquoise clair `#58C5C4` et rose `#F16A7A` ;
- illustrations SVG couleur utilisées sur les écrans d’accueil et les cartes d’activités ;
- variantes noir et blanc conservées pour de futures fiches imprimables.

Un laboratoire interne, non lié depuis l’interface, est disponible à l’adresse
`/character-lab.html`. Il génère des personnages à partir de formes ou de
lettres, ajoute des visages configurables et exporte des SVG autonomes avec la
police Asap embarquée.
