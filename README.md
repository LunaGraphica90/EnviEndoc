## EnviEndoc

## Introduction

Bienvenue dans la documentation d'EnviEndoc, un projet basé sur OpenLayers, une bibliothèque JavaScript pour la cartographie interactive. Cette documentation vous guidera dans la mise en place et le déploiement du projet, ainsi que dans la compréhension de sa structure et de ses fonctionnalités.

## Fonctionnalités clés

EnviEndoc offre les fonctionnalités suivantes :

- Affichage d'une cartorgaphie interactive de la métrologie des différentes substances perturbateurs endocriniennes basée sur OpenLayers.
- Utilisation de données GéoJSON pour la cartographie.

## Public cible 

- Praticiens des centres régionaux de pathologies professionnelles et environnementales
- Chercheurs dans la thématique de la perturbation endocrinienne
- Médecins du travail/hôpitaux/médecins généralistes…

Et plus largement :

- Collectivités territoriales
- Citoyens

#### Besoins

- Pour les praticiens des centres régionaux de pathologies professionnelles et environnementaux (CRPPE), il s’agit de rendre visible la présence de PE dans l’environnement pour appuyer l’estimation de l’imputabilité de l’environnement pour les maladies rencontrées lors des consultations médicales.
- Pour les médecins du travail/hôpitaux/médecins généralistes, il s’agit de construire une aide aux diagnostics et à la protection des patients et salariés.
- Pour les chercheurs (dont épidémiologistes), il s’agit d’avoir un accès aux données dans le cadre des recherches sur l’impact sanitaire des PE.

## Prérequis

Avant d'installer le projet, s'assurer d'avoir les éléments suivants installés sur sa machine :

- Node.js et npm (Node Package Manager)
- Un éditeur de code

## Mise en place et lancement du projet

1. Télécharger le code source d'EnviEndoc à partir de [lien GitHub](https://chat.openai.com/lien_github).

2. Ouvrir votre terminal et accédez au répertoire du projet :

   ```
   cd chemin/vers/enviendoc
   ```

3. Installer les dépendances du projet :

   ```
   npm install
   ```

4. Lancer le projet :

   ```
   npm start
   ```

   Cela démarrera le serveur de développement et ouvrira automatiquement le projet dans votre navigateur.

## Structure du projet

Pour avoir plusieurs pages html dans le projet, faisant appel à diverses ressources, il a été nécessaire de structurer le projet de la sorte :

- À la racine du projet :
  - Les fichiers HTML représentant les différentes pages du site.
  - Le dossier *css* contenant les styles CSS du site.
  - Un dossier pour la typographie personnalisée utilisée.
  - Un dossier *public*.
- Dans le dossier *public* :
  - Un dossier *datas* contenant les données GéoJSON utiles à la cartographie.
  - Un dossier *documents* contenant notamment les fichiers CSV de la liste des perturbateurs endocriniens.
  - Un dossier *images* contenant toutes les images utilisées sur le site.
  - Un dossier *js* contenant tous les scripts utilisés sur le site, y compris le fichier *main.js* d'OpenLayers.
  - Un dossier *lang* contenant les traductions français/anglais du site.

## Déploiement de l'application

Pour déployer l'application en production :

1. Générer les fichiers optimisés pour la production :

   ```
   npm run build
   ```

   Cela créé un répertoire *dist* contenant tous les fichiers HTML et les actifs de l'application.

2. Pour visualiser le résultat du build avant la mise en production

   ```
   npm run serve
   ```

