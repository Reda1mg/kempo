-- Script pour rendre les champs optionnels nullable
USE kempo_db;

-- Pour la table Tournament
ALTER TABLE `tournament` MODIFY `city` VARCHAR(255) NULL;
ALTER TABLE `tournament` MODIFY `end_date` DATETIME NULL;

-- Pour la table Competitor  
ALTER TABLE `competitor` MODIFY `club` VARCHAR(255) NULL;
ALTER TABLE `competitor` MODIFY `weight` INT NULL;

-- Pour la table Category
ALTER TABLE `category` MODIFY `weight_min` INT NULL;
ALTER TABLE `category` MODIFY `weight_max` INT NULL;

-- Vérifier les changements
DESCRIBE tournament;
DESCRIBE competitor;
DESCRIBE category;
