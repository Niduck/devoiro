# Devoiro

Petit jeu de lecture local pour les enfants, construit en React, TypeScript et Vite.

## Lancer en local

```bash
npm install
npm run dev
```

L’application fonctionne entièrement dans le navigateur. Les profils, la progression et les récompenses sont enregistrés dans `localStorage`.

## Vérifier le build

```bash
npm run build
npm run preview
```

Le dossier `docs/` produit est un site statique. La configuration Vite utilise des chemins relatifs afin de fonctionner dans un sous-dossier GitHub Pages.

La navigation utilise `HashRouter`. Les routes restent ainsi rechargeables sur GitHub Pages sans serveur ni règle de réécriture.

## Déploiement GitHub Pages

Le workflow `.github/workflows/deploy-pages.yml` compile et publie automatiquement le projet lors d’un push sur `main`. Dans les réglages du dépôt GitHub, sélectionner **GitHub Actions** comme source de Pages.

La reconnaissance vocale dépend de la Web Speech API du navigateur. Chrome ou Edge sont recommandés. Aucun serveur, Worker ou service payant n’est nécessaire.

## Police scolaire Marelle

Les variantes **Marelle** et **Marelle Bâton**, conçues avec le soutien de la Direction du Numérique pour l’Éducation, sont intégrées localement au projet. Elles sont distribuées sous licence SIL Open Font License 1.1 ; la licence complète se trouve dans `THIRD_PARTY_LICENSES/Marelle-LICENSE.txt`.

Le cadrage produit détaillé est dans [PRODUCT.md](./PRODUCT.md).

# devoiro
