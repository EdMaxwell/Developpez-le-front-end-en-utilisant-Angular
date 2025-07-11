# Olympic Dashboard

## Présentation

Olympic Dashboard est une application Angular permettant de visualiser les statistiques des pays participants aux Jeux Olympiques. Elle propose des graphiques interactifs pour explorer les performances, les médailles et l’évolution des participations. Ce projet vise à offrir une interface claire pour l’analyse des données olympiques, utile pour l’éducation, la data visualisation ou la veille sportive.

## Contexte

Ce projet a été réalisé dans le cadre d'une formation chez OpenClassrooms. Il a été conçu pour illustrer la gestion de données, l’utilisation de graphiques dynamiques et la structuration d’une application Angular moderne. Il met l’accent sur la robustesse (gestion des erreurs) et la modularité.

## Versions utilisées

- Node.js: 22.16.0
- npm: 11.4.1
- Angular: 18

> Le projet a été testé sur ces versions. D’autres versions récentes peuvent fonctionner, mais il est recommandé d’utiliser celles-ci pour garantir la compatibilité.

## Prérequis

- Node.js (22.16.)
- npm (11.4)
- Angular CLI (optionnel, recommandé: `npm install -g @angular/cli`)

## Installation

1. Clonez le dépôt:

   ```bash
   git clone <url-du-repo> && cd olympic-dashboard
   ```

2. Installez les dépendances:

   ```bash
   npm install
   ```

3. Variables d’environnement:

- Aucune variable d’environnement n’est requise pour la version de base.
- Les données sont chargées localement depuis `src/assets/mock/olympic.json`.

## Lancement de l’application

Pour démarrer en mode développement:

```bash
npm start
# ou
ng serve
```

Accédez à: [http://localhost:4200](http://localhost:4200)

## Structure du projet

- `src/app/pages/home`: page d’accueil, graphique global des médailles.
- `src/app/pages/detail`: détail d’un pays, stats et évolution par année.
- `src/app/core/services`: services principaux (chargement, gestion des données olympiques).
- `src/app/core/models`: modèles TypeScript et interfaces (structure des données, pays, participations).
- `src/app/shared`: composants réutilisables (spinner, messages d’erreur, boutons).
- `src/assets/mock`: données de test au format JSON.
- `src/environments`: configuration d’environnement (dev/prod).

## Déploiement

Pour générer une version de production:

```bash
ng build --configuration production
```

Le dossier `dist/olympic-dashboard` contient les fichiers à déployer sur un serveur web statique (ex: Netlify, Vercel, GitHub Pages).

## Contribution

Ce projet pédagogique n'est pas ouvert aux contributions externes.

© 2025 Olympic Dashboard

