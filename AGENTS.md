# Consignes de contribution à Devoiro

## Priorité pédagogique

Devoiro produit des activités destinées à de jeunes enfants. La conformité aux programmes en vigueur, la progression des apprentissages et l’accessibilité priment sur la facilité d’implémentation ou l’effet ludique.

Avant de créer ou de modifier une activité, ouvrir [`.docs/README.md`](./.docs/README.md), puis lire les référentiels indiqués pour le domaine, le niveau et les besoins concernés. Cette étape est obligatoire dès qu’un changement affecte le contenu présenté à l’enfant, les consignes, la difficulté, l’ordre des exercices, les critères de réussite ou les aides.

## Règles de mise en œuvre

- Partir des programmes officiels en vigueur et respecter la hiérarchie des sources définie dans `.docs/README.md`.
- Séparer explicitement les attendus officiels, les recommandations documentées et les choix propres à Devoiro.
- Ne pas inventer une règle linguistique ou pédagogique pour simplifier un algorithme. Les exceptions, graphèmes et unités de lecture sensibles doivent être portés par des données lisibles et auditables.
- Ne jamais présenter l’application comme un outil de diagnostic, une thérapie ou un remplacement de l’enseignant, de l’orthophoniste ou d’un autre professionnel.
- Pour les besoins éducatifs particuliers, proposer des réglages activables et personnalisables. Ne pas déduire les besoins d’un enfant d’une étiquette diagnostique.
- La reconnaissance vocale assiste l’activité : elle ne doit pas être l’unique moyen de réussir, ni servir à évaluer ou diagnostiquer un trouble.
- Vérifier l’impact sur tous les niveaux et activités concernés, puis mettre à jour le référentiel ou l’audit correspondant si la décision pédagogique évolue.
- Pour les changements de code, appliquer aussi [`CLEAN_CODE.md`](./CLEAN_CODE.md) et effectuer les vérifications proportionnées au risque.

## Contrôle avant livraison

Pour toute activité nouvelle ou modifiée, pouvoir répondre à ces quatre questions :

1. À quel attendu ou besoin documenté répond-elle ?
2. Est-elle proposée au bon niveau et au bon moment de l’année ?
3. Quels prérequis et quelles aides sont prévus ?
4. Que se passe-t-il si l’enfant ne peut pas utiliser le micro, lire la consigne ou soutenir longtemps son attention ?

Si une réponse manque, le travail n’est pas pédagogiquement terminé.
