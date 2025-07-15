CREATE TABLE `match` (
    `id` varchar(36) NOT NULL,
    `competitor1_id` varchar(36) NULL,
    `competitor2_id` varchar(36) NULL,
    `score1` int NOT NULL DEFAULT 0,
    `score2` int NOT NULL DEFAULT 0,
    `category_id` varchar(36) NOT NULL,
    `keikuka1` int NOT NULL DEFAULT 0,
    `keikuka2` int NOT NULL DEFAULT 0,
    `winner_id` varchar(36) NULL DEFAULT NULL,
    `is_finished` tinyint(1) NOT NULL DEFAULT false,
    `pool_number` varchar(255) NOT NULL DEFAULT '0',
    `next_match_id` varchar(36) NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8mb4 ENGINE=InnoDB;

-- Ajouter les index
ALTER TABLE `match` ADD INDEX `match_competitor1_id_index`(`competitor1_id`);
ALTER TABLE `match` ADD INDEX `match_competitor2_id_index`(`competitor2_id`);
ALTER TABLE `match` ADD INDEX `match_category_id_index`(`category_id`);
ALTER TABLE `match` ADD INDEX `match_winner_id_index`(`winner_id`);
ALTER TABLE `match` ADD INDEX `match_next_match_id_index`(`next_match_id`);

-- Ajouter les contraintes de clé étrangère
ALTER TABLE `match` ADD CONSTRAINT `match_competitor1_id_foreign` FOREIGN KEY (`competitor1_id`) REFERENCES `competitor` (`id`) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE `match` ADD CONSTRAINT `match_competitor2_id_foreign` FOREIGN KEY (`competitor2_id`) REFERENCES `competitor` (`id`) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE `match` ADD CONSTRAINT `match_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON UPDATE CASCADE;
ALTER TABLE `match` ADD CONSTRAINT `match_winner_id_foreign` FOREIGN KEY (`winner_id`) REFERENCES `competitor` (`id`) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE `match` ADD CONSTRAINT `match_next_match_id_foreign` FOREIGN KEY (`next_match_id`) REFERENCES `match` (`id`) ON UPDATE CASCADE ON DELETE SET NULL;
