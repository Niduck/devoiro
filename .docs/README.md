# Documentation de référence de Devoiro

Ce dossier rassemble les règles pédagogiques qui guident la conception des activités. Il est volontairement organisé par sujet : il ne faut pas tout lire à chaque modification, mais il faut toujours consulter les documents indiqués pour le périmètre touché.

## Parcours de lecture

| Travail envisagé | Documents à lire avant de modifier l’activité |
| --- | --- |
| Toute activité, difficulté, période scolaire, preset ou corpus lié à un niveau | [`referentiels/programmes-par-niveau.md`](./referentiels/programmes-par-niveau.md) |
| Lecture, phonologie, alphabet, décodage, encodage, syllabes, graphèmes, unités de lecture, lettres muettes, fluence ou validation vocale | [`referentiels/lecture-encodage.md`](./referentiels/lecture-encodage.md) |
| Aide de lecture, accessibilité cognitive ou adaptation pour un enfant dyslexique, avec TDAH ou autiste | [`referentiels/inclusion-lecture.md`](./referentiels/inclusion-lecture.md), puis le référentiel de l’activité |
| Modification d’un mot, de son découpage ou de sa coloration | [`audits/mots-lecture.md`](./audits/mots-lecture.md) et [`referentiels/lecture-encodage.md`](./referentiels/lecture-encodage.md) |
| Évolution produit sans contenu pédagogique | [`../PRODUCT.md`](../PRODUCT.md) et, si nécessaire, [`../EVOLUTIONS.md`](../EVOLUTIONS.md) |
| Refactorisation ou nouvelle architecture | [`../CLEAN_CODE.md`](../CLEAN_CODE.md) |

Une modification purement visuelle n’impose donc pas la lecture de tous les référentiels. Dès qu’elle change ce que l’enfant doit comprendre, lire, entendre, prononcer, écrire ou réussir, la documentation pédagogique concernée redevient obligatoire.

## Hiérarchie des sources

En cas de contradiction, utiliser cet ordre de priorité :

1. programmes et Bulletin officiel en vigueur ;
2. ressources et guides Éduscol applicables ;
3. recommandations institutionnelles du CSEN et de la HAS ;
4. revues systématiques et travaux de recherche publiés ;
5. retours d’enseignants, d’orthophonistes, de parents et d’enfants ;
6. méthodes commerciales ou choix heuristiques propres à Devoiro.

Une méthode connue ou une préférence d’interface ne doit jamais être présentée comme une norme officielle. Toute déduction propre à Devoiro doit être signalée comme telle.

## Entretien des référentiels

- Vérifier les sources officielles lorsqu’une activité est ajoutée ou lorsqu’un programme a pu changer.
- Conserver dans chaque référentiel une date de dernière vérification et des liens directs vers les sources.
- Distinguer clairement le texte officiel, l’état des connaissances et la décision produit.
- Mettre à jour les audits de corpus après toute évolution de l’algorithme ou des données linguistiques.
- Faire relire les choix sensibles par un enseignant ou un professionnel compétent avant de les présenter comme validés pédagogiquement.

## Contenu actuel

```text
.docs/
├── README.md
├── audits/
│   └── mots-lecture.md
└── referentiels/
    ├── programmes-par-niveau.md
    ├── lecture-encodage.md
    └── inclusion-lecture.md
```
