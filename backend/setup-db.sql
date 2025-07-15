-- Script pour configurer MySQL pour le projet Kempo
-- Exécuter ce script dans MySQL : mysql -u root -p < setup-db.sql

-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS kemp_grp;

-- Utiliser la base de données
USE kemp_grp;

-- Optionnel : Créer un utilisateur dédié pour l'application
-- CREATE USER 'kempo_user'@'localhost' IDENTIFIED BY 'kempo_password';
-- GRANT ALL PRIVILEGES ON kemp_grp.* TO 'kempo_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Vérifier que la base de données est créée
SHOW DATABASES LIKE 'kemp_grp';
