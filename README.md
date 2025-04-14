# NK Tournament Stats

Application mobile Flutter pour l'analyse de statistiques de tournois de Kempo.

## Description

NK Tournament Stats est une application permettant d'extraire et d'analyser des statistiques à partir de fichiers PDF générés par le logiciel NK Master Tournament.

## Fonctionnalités

- Importation de fichiers PDF générés par NK Master Tournament
- Extraction automatique des données (participants, matchs, résultats)
- Visualisation des statistiques par club et par compétiteur
- Historique des tournois analysés précédemment

## Installation

```bash
# Cloner le projet
git clone https://github.com/your-username/nkt_stats.git

# Installer les dépendances
cd nkt_stats
flutter pub get

# Générer les fichiers Hive
flutter pub run build_runner build --delete-conflicting-outputs
```

## Utilisation

1. Connectez votre téléphone Android à l'ordinateur exécutant NK Master Tournament
2. Transférez le fichier PDF généré automatiquement par le logiciel
3. Dans l'application, cliquez sur "Importer de nouvelles données"
4. Sélectionnez le fichier PDF transféré
5. Les statistiques seront automatiquement extraites et affichées

## Prérequis

- Flutter 3.10+
- Android SDK

## Développement

Pour générer les fichiers nécessaires à Hive après modification des modèles :

```bash
flutter pub run build_runner build --delete-conflicting-outputs
```
