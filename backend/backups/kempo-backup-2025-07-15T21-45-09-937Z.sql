-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: kempo_collab
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `age_group`
--

DROP TABLE IF EXISTS `age_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `age_group` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `age_min` int NOT NULL,
  `age_max` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `age_group`
--

LOCK TABLES `age_group` WRITE;
/*!40000 ALTER TABLE `age_group` DISABLE KEYS */;
INSERT INTO `age_group` VALUES (1,'Mini-Poussin',0,5),(2,'Poussin',6,7),(3,'Pupille',8,9),(4,'Benjamin',10,11),(5,'Minime',12,13),(6,'Cadet',14,15),(7,'Junior',16,17),(8,'Senior',18,40),(9,'Vétéran',41,100);
/*!40000 ALTER TABLE `age_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` varchar(36) NOT NULL,
  `rank` text NOT NULL,
  `gender` enum('H','F') NOT NULL,
  `weight_category_id` int unsigned DEFAULT NULL,
  `tournament_id` varchar(36) NOT NULL,
  `elimination_type` enum('Directe','Poule') NOT NULL,
  `age_group_id` int unsigned DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_weight_category_id_index` (`weight_category_id`),
  KEY `category_tournament_id_index` (`tournament_id`),
  KEY `category_age_group_id_index` (`age_group_id`),
  CONSTRAINT `category_age_group_id_foreign` FOREIGN KEY (`age_group_id`) REFERENCES `age_group` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `category_tournament_id_foreign` FOREIGN KEY (`tournament_id`) REFERENCES `tournament` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `category_weight_category_id_foreign` FOREIGN KEY (`weight_category_id`) REFERENCES `weight_category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES ('c0937f42-8a10-4636-8166-606a9147fd47','Ceinture Jaune','H',4,'c0e4ce36-37a6-4d67-910c-8cd936706083','Directe',4,'AutoCat'),('d5f642a9-9794-4487-a31b-0dfbffdcf312','Ceinture Blanche','H',NULL,'c0e4ce36-37a6-4d67-910c-8cd936706083','Directe',NULL,'Test Category');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competitor`
--

DROP TABLE IF EXISTS `competitor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competitor` (
  `id` varchar(36) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `birthday` datetime NOT NULL,
  `club` varchar(255) DEFAULT NULL,
  `country` varchar(255) NOT NULL,
  `weight` int DEFAULT NULL,
  `rank` enum('Ceinture Blanche','Ceinture Blanche-Jaune','Ceinture Jaune','Ceinture Jaune-Orange','Ceinture Orange','Ceinture Orange-Verte','Ceinture Verte','Ceinture Verte-Bleue','Ceinture Bleue','Ceinture Bleue-Marron','Ceinture Marron','Ceinture Noire 1ère dan','Ceinture Noire 2ème dan','Ceinture Noire 3ème dan','Ceinture Noire 4ème dan','Ceinture Noire 5ème dan','Ceinture Noire 6ème dan') NOT NULL,
  `gender` enum('H','F') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competitor`
--

LOCK TABLES `competitor` WRITE;
/*!40000 ALTER TABLE `competitor` DISABLE KEYS */;
INSERT INTO `competitor` VALUES ('0302980a-7a42-4bf9-82f9-912471694703','Nicolas','Dufour','2002-09-30 02:00:00','Dojo Colmar','France',68,'Ceinture Bleue','H'),('080d9fb8-e4f2-44ce-b813-dc65a4ae6c64','Céline','Girard','2002-11-13 01:00:00','Dojo Belfort','France',57,'Ceinture Bleue','F'),('0851d5f8-8e30-4f45-9690-8a2abc29281c','Nathalie','Lopez','1999-05-14 02:00:00','Dojo Coulommiers','France',63,'Ceinture Noire 2ème dan','F'),('0d49e1c5-d44a-4945-b353-1e0e0e0b1da4','Jérôme','Michel','2001-02-24 01:00:00','Dojo Sens','France',71,'Ceinture Marron','H'),('1585007e-215a-4c19-9109-c13c0127822c','Aurélie','Fournier','2000-09-12 02:00:00','Dojo Meaux','France',61,'Ceinture Noire 1ère dan','F'),('1e7e2583-63e5-44a1-bf5c-781359c2305f','Amélie','Morin','2009-04-17 02:00:00','Dojo Le Havre','France',36,'Ceinture Blanche','F'),('1eff7cde-f896-4de3-91ea-8cb43ddd7244','Quentin','Dupont','2006-06-05 02:00:00','Dojo Caen','France',52,'Ceinture Jaune','H'),('2122cae4-a5f1-43f6-90a6-26c6b8ddd79e','Test','Avec Club','1990-01-01 01:00:00','Dojo Test','France',70,'Ceinture Blanche','H'),('2543edf1-8dd9-4b13-94b2-56449e38a554','Inès','Lefevre','2007-11-03 01:00:00','Dojo Limoges','France',46,'Ceinture Jaune','F'),('2edfb737-7f55-490b-8a44-997c6fb790ac','Philippe','Blanc','1999-03-21 01:00:00','Dojo Montereau','France',78,'Ceinture Noire 2ème dan','H'),('30b23c28-dd50-4b19-b2dd-884e6ce6cc9f','Jade','Joly','2006-12-25 01:00:00','Dojo Nancy','France',48,'Ceinture Jaune','F'),('3848de07-35e3-471e-b054-25eda70abf55','Manon','Berger','2004-05-31 02:00:00','Dojo Calais','France',52,'Ceinture Orange','F'),('3ab9cb58-4882-4105-a0f4-6627a5601bbd','Théo','Girard','2009-02-11 01:00:00','Dojo Brest','France',41,'Ceinture Blanche','H'),('3aec22e5-637b-4caf-9825-e86d9c8c0adc','Antoine','Roux','2008-02-14 01:00:00','Dojo Nantes','France',42,'Ceinture Blanche','H'),('3c382ce5-c8e5-4734-a45a-aafadb0877cb','Anaïs','Gaillard','2003-06-09 02:00:00','Dojo Le Mans','France',54,'Ceinture Verte','F'),('4250b939-3c75-4afb-a954-dd6d613ebb55','Sandrine','Roussel','2002-03-19 01:00:00','Dojo Vesoul','France',56,'Ceinture Bleue','F'),('45aec57e-05cb-469a-bb6f-e169c1629226','Clara','Blanc','2008-08-22 02:00:00','Dojo Reims','France',40,'Ceinture Blanche','F'),('4b570b4b-226f-4226-ace1-256cf82cb27b','Damien','Roux','2000-07-20 02:00:00','Dojo Fontainebleau','France',74,'Ceinture Noire 1ère dan','H'),('4b8910b2-5964-477d-8358-0e6cf53c4b98','Chloé','Simon','2010-01-25 01:00:00','Dojo Bordeaux','France',33,'Ceinture Blanche','F'),('52a05a60-69b0-455e-b97e-2ae5576a2b64','Pauline','Garnier','2005-01-05 01:00:00','Dojo Ajaccio','France',50,'Ceinture Jaune','F'),('55799e55-e54f-49ac-87af-26555dd16641','Margot','Hubert','2003-02-11 01:00:00','Dojo Valence','France',55,'Ceinture Verte','F'),('59251a53-a097-4a4c-91ef-e9f24dfeacc2','Léna','Blanc','2004-01-13 01:00:00','Dojo Chartres','France',51,'Ceinture Orange','F'),('60bb5508-0d08-427f-a243-3d96f81249b4','Sébastien','Durand','2001-06-02 02:00:00','Dojo Mâcon','France',70,'Ceinture Marron','H'),('60bf1bb8-14ba-4479-b0ba-d27f97901b58','Maeva','Mercier','2007-03-28 02:00:00','Dojo Perpignan','France',44,'Ceinture Jaune','F'),('60c03c6b-1092-4aaf-874c-da1571b7ac44','Florian','Renard','2005-11-22 01:00:00','Dojo Chambéry','France',56,'Ceinture Jaune','H'),('63317b53-719e-4803-b668-be3f4a7bcbc2','Valentin','Gautier','2006-02-08 01:00:00','Dojo Poitiers','France',51,'Ceinture Jaune','H'),('65f8cf26-8452-464a-a395-259cc3e6176e','Morgane','Chevalier','2005-09-30 02:00:00','Dojo Besançon','France',49,'Ceinture Jaune','F'),('75e8d8cc-bbb4-43a5-a568-8328428d69db','Mehdi','Renault','2003-04-26 02:00:00','Dojo Rouen','France',62,'Ceinture Verte','H'),('7636319a-b9be-40cf-b238-e05906649291','Camille','Vincent','2007-07-25 02:00:00','Dojo Troyes','France',45,'Ceinture Jaune','F'),('81032c0e-3c8d-4a3f-bebf-d2269e7fd3fa','Thomas','Bernard','2010-07-10 02:00:00','Dojo Marseille','France',38,'Ceinture Blanche','H'),('8680dccf-2fdc-41b2-88b7-4f48c6d0a2dd','Romain','Bonnet','2006-10-12 02:00:00','Dojo Metz','France',53,'Ceinture Jaune','H'),('93aeb2d1-205d-4e34-8acb-dd10712dcb2a','Loic','Giraud','2004-07-24 02:00:00','Dojo Dunkerque','France',60,'Ceinture Orange','H'),('9bcb31c6-e218-474f-80e6-0796b4f8aa91','Emma','Petit','2010-09-03 02:00:00','Dojo Toulouse','France',30,'Ceinture Blanche','F'),('a0ca08eb-3eb5-4d18-b630-de4a3ca50ed1','Hugo','Lopez','2008-10-05 02:00:00','Dojo Dijon','France',45,'Ceinture Blanche','H'),('a44d6a7e-78cb-4638-9773-9aaff27310ff','Léa','Dubois','2010-05-22 02:00:00','Dojo Lyon','France',32,'Ceinture Blanche','F'),('a82f6d43-504f-4a1f-bcc0-ba0501caaea2','Nathan','Michel','2010-04-08 02:00:00','Dojo Lille','France',37,'Ceinture Blanche','H'),('aa1e154a-646f-41da-ab52-f21489042ed0','Lucas','Moreau','2010-11-18 01:00:00','Dojo Nice','France',36,'Ceinture Blanche','H'),('aa2e3210-2775-4d4e-9a7f-dc5b161bc51a','Enzo','Andre','2007-01-14 01:00:00','Dojo Amiens','France',49,'Ceinture Jaune','H'),('ad089fe6-8ba3-4423-9b50-1ce29c9d2220','Thibaut','Leclerc','2002-01-26 01:00:00','Dojo Montbéliard','France',67,'Ceinture Bleue','H'),('adeb81a2-b263-4a0c-98ad-7e674d88849a','Kévin','Poulain','2003-12-28 01:00:00','Dojo Grenoble','France',63,'Ceinture Verte','H'),('b13d2f4d-c84b-4f1c-b84f-90af275adb0c','Julien','Morel','2004-11-20 01:00:00','Dojo Beauvais','France',59,'Ceinture Orange','H'),('b5338410-61e1-4caf-b37b-e70fc5384205','Manon','Fournier','2008-12-30 01:00:00','Dojo Angers','France',38,'Ceinture Blanche','F'),('be8dfe60-cb57-42be-93a7-c4a1bdee1b4a','Virginie','Petit','2001-04-07 02:00:00','Dojo Melun','France',58,'Ceinture Marron','F'),('c032ab13-0631-4a0c-a0e0-8d7cf96aa76d','Chloé','Fabre','2004-09-07 02:00:00','Dojo Arras','France',53,'Ceinture Orange','F'),('c42dad08-40a8-402d-b865-33ceb0ed663b','Stephanie','Morin','2000-01-08 01:00:00','Dojo Nemours','France',62,'Ceinture Noire 1ère dan','F'),('c5a5e4c0-0953-496c-a424-8fc002bcc707','Kevin','Rousseau','2007-05-12 02:00:00','Dojo Orléans','France',48,'Ceinture Jaune','H'),('c8b0e1fd-2aa8-4784-8c1f-72a7f4480411','Maxime','Faure','2008-06-18 02:00:00','Dojo Montpellier','France',43,'Ceinture Blanche','H'),('d0c9754e-069d-4862-bbb5-d0d48836954a','Axel','Barbier','2004-03-18 01:00:00','Dojo Bastia','France',58,'Ceinture Orange','H'),('d4c1f55e-e5b8-4b2a-8f63-9ae34cec6e1a','Bastien','Fernandez','2005-07-15 02:00:00','Dojo Avignon','France',55,'Ceinture Jaune','H'),('d9151fe2-230c-42ad-ab63-0ec9d29185e9','Océane','Lemoine','2006-08-19 02:00:00','Dojo Bourges','France',47,'Ceinture Jaune','F'),('d99b9eff-2b41-47c6-99f3-59a74fc82716','Matthieu','Leroy','2001-10-28 02:00:00','Dojo Nevers','France',72,'Ceinture Marron','H'),('dcb734ed-9109-490e-b182-e541857ed758','Julie','Garnier','2008-04-20 02:00:00','Dojo Rennes','France',39,'Ceinture Blanche','F'),('dd1e6bb6-c7df-499d-bb50-14603d81c00f','Coralie','Simon','2001-12-11 01:00:00','Dojo Auxerre','France',60,'Ceinture Marron','F'),('e0e18287-8fbb-4d9b-ba02-06092c95e250','Sarah','Leroy','2010-06-12 02:00:00','Dojo Strasbourg','France',31,'Ceinture Blanche','F'),('e431f060-c66c-4e52-98e8-3d30b7b3a7e2','Elise','Lemaire','2003-10-15 02:00:00','Dojo Annecy','France',56,'Ceinture Verte','F'),('e7968c8b-356f-4575-95d7-c57464bd078f','Justine','Noel','2002-07-17 02:00:00','Dojo Mulhouse','France',58,'Ceinture Bleue','F'),('ece69037-9a24-4ebc-9d49-2be181231a6c','Alexandre','Martin','2010-03-15 01:00:00','Dojo Paris','France',35,'Ceinture Blanche','H'),('ed3c52cf-cdbe-4384-9c58-4e63d2b3239f','Adrien','Marchand','2002-05-24 02:00:00','Dojo Saint-Étienne','France',66,'Ceinture Bleue','H'),('f20fa68b-59d1-4a13-97b7-d827eb396468','Christophe','Girard','2000-11-25 01:00:00','Dojo Provins','France',76,'Ceinture Noire 1ère dan','H'),('f8fc3ec6-1833-4eae-bafa-e2f962e8d678','Aurore','Moreau','2001-08-15 02:00:00','Dojo Chalon','France',59,'Ceinture Marron','F'),('fc10002f-d647-411d-b8f7-ee3f479cfa2f','Yann','Brun','2003-08-22 02:00:00','Dojo Tours','France',64,'Ceinture Verte','H'),('fc875902-7d5e-47b4-852e-d0d241527819','Dylan','Muller','2007-09-18 02:00:00','Dojo Clermont','France',50,'Ceinture Jaune','H'),('ff0fe872-1bbf-419b-b77f-4e667a7db8f5','Lola','Picard','2006-04-21 02:00:00','Dojo La Rochelle','France',46,'Ceinture Jaune','F');
/*!40000 ALTER TABLE `competitor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `match`
--

DROP TABLE IF EXISTS `match`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `match` (
  `id` varchar(36) NOT NULL,
  `competitor1_id` varchar(36) DEFAULT NULL,
  `competitor2_id` varchar(36) DEFAULT NULL,
  `score1` int NOT NULL DEFAULT '0',
  `score2` int NOT NULL DEFAULT '0',
  `category_id` varchar(36) NOT NULL,
  `keikuka1` int NOT NULL DEFAULT '0',
  `keikuka2` int NOT NULL DEFAULT '0',
  `winner_id` varchar(36) DEFAULT NULL,
  `is_finished` tinyint(1) NOT NULL DEFAULT '0',
  `pool_number` varchar(255) NOT NULL DEFAULT '0',
  `next_match_id` varchar(36) DEFAULT NULL,
  `time` int NOT NULL DEFAULT '180',
  `is_running` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `match_competitor1_id_index` (`competitor1_id`),
  KEY `match_competitor2_id_index` (`competitor2_id`),
  KEY `match_category_id_index` (`category_id`),
  KEY `match_winner_id_index` (`winner_id`),
  KEY `match_next_match_id_index` (`next_match_id`),
  CONSTRAINT `match_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `match_competitor1_id_foreign` FOREIGN KEY (`competitor1_id`) REFERENCES `competitor` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `match_competitor2_id_foreign` FOREIGN KEY (`competitor2_id`) REFERENCES `competitor` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `match_next_match_id_foreign` FOREIGN KEY (`next_match_id`) REFERENCES `match` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `match_winner_id_foreign` FOREIGN KEY (`winner_id`) REFERENCES `competitor` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `match`
--

LOCK TABLES `match` WRITE;
/*!40000 ALTER TABLE `match` DISABLE KEYS */;
INSERT INTO `match` VALUES ('420c5ae1-fc8f-42bb-a5c8-6c48c5232d7c','d4c1f55e-e5b8-4b2a-8f63-9ae34cec6e1a','fc875902-7d5e-47b4-852e-d0d241527819',0,0,'c0937f42-8a10-4636-8166-606a9147fd47',0,0,NULL,0,'0',NULL,180,0),('7f290e37-0a7c-4ded-ab21-71a880b44a4a','1eff7cde-f896-4de3-91ea-8cb43ddd7244','60c03c6b-1092-4aaf-874c-da1571b7ac44',0,0,'c0937f42-8a10-4636-8166-606a9147fd47',0,0,NULL,0,'0',NULL,180,0),('c6bba11c-a708-4152-a73f-7bd2eb85e515','63317b53-719e-4803-b668-be3f4a7bcbc2','8680dccf-2fdc-41b2-88b7-4f48c6d0a2dd',0,0,'c0937f42-8a10-4636-8166-606a9147fd47',0,0,NULL,0,'0',NULL,180,0),('e4ecc122-6b55-4bd4-8378-a1699f0ea30c','aa2e3210-2775-4d4e-9a7f-dc5b161bc51a','c5a5e4c0-0953-496c-a424-8fc002bcc707',0,0,'c0937f42-8a10-4636-8166-606a9147fd47',0,0,NULL,0,'0',NULL,180,0);
/*!40000 ALTER TABLE `match` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mikro_orm_migrations`
--

DROP TABLE IF EXISTS `mikro_orm_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mikro_orm_migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `executed_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mikro_orm_migrations`
--

LOCK TABLES `mikro_orm_migrations` WRITE;
/*!40000 ALTER TABLE `mikro_orm_migrations` DISABLE KEYS */;
INSERT INTO `mikro_orm_migrations` VALUES (1,'Migration20250428180034','2025-07-15 09:14:55'),(2,'Migration20250428180304','2025-07-15 09:14:56'),(3,'Migration20250428184600','2025-07-15 09:14:56'),(4,'Migration20250428185304','2025-07-15 09:14:56'),(5,'Migration20250428191637','2025-07-15 09:14:56'),(6,'Migration20250428192912','2025-07-15 09:14:56'),(7,'Migration20250503093227','2025-07-15 09:14:56'),(8,'Migration20250513213848','2025-07-15 09:16:34'),(9,'Migration20250514073110','2025-07-15 09:16:34');
/*!40000 ALTER TABLE `mikro_orm_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tournament`
--

DROP TABLE IF EXISTS `tournament`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tournament` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `city` varchar(255) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tournament`
--

LOCK TABLES `tournament` WRITE;
/*!40000 ALTER TABLE `tournament` DISABLE KEYS */;
INSERT INTO `tournament` VALUES ('c0e4ce36-37a6-4d67-910c-8cd936706083','Homme - Ceinture Jaune ','Nancy','2025-08-01 02:00:00','2025-08-01 02:00:00');
/*!40000 ALTER TABLE `tournament` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tournament_competitor_category`
--

DROP TABLE IF EXISTS `tournament_competitor_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tournament_competitor_category` (
  `tournament_id` varchar(36) NOT NULL,
  `competitor_id` varchar(36) NOT NULL,
  `category_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`tournament_id`,`competitor_id`),
  KEY `tournament_competitor_category_tournament_id_index` (`tournament_id`),
  KEY `tournament_competitor_category_competitor_id_index` (`competitor_id`),
  KEY `tournament_competitor_category_category_id_index` (`category_id`),
  CONSTRAINT `tournament_competitor_category_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `tournament_competitor_category_competitor_id_foreign` FOREIGN KEY (`competitor_id`) REFERENCES `competitor` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `tournament_competitor_category_tournament_id_foreign` FOREIGN KEY (`tournament_id`) REFERENCES `tournament` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tournament_competitor_category`
--

LOCK TABLES `tournament_competitor_category` WRITE;
/*!40000 ALTER TABLE `tournament_competitor_category` DISABLE KEYS */;
INSERT INTO `tournament_competitor_category` VALUES ('c0e4ce36-37a6-4d67-910c-8cd936706083','1eff7cde-f896-4de3-91ea-8cb43ddd7244','c0937f42-8a10-4636-8166-606a9147fd47'),('c0e4ce36-37a6-4d67-910c-8cd936706083','60c03c6b-1092-4aaf-874c-da1571b7ac44','c0937f42-8a10-4636-8166-606a9147fd47'),('c0e4ce36-37a6-4d67-910c-8cd936706083','63317b53-719e-4803-b668-be3f4a7bcbc2','c0937f42-8a10-4636-8166-606a9147fd47'),('c0e4ce36-37a6-4d67-910c-8cd936706083','8680dccf-2fdc-41b2-88b7-4f48c6d0a2dd','c0937f42-8a10-4636-8166-606a9147fd47'),('c0e4ce36-37a6-4d67-910c-8cd936706083','aa2e3210-2775-4d4e-9a7f-dc5b161bc51a','c0937f42-8a10-4636-8166-606a9147fd47'),('c0e4ce36-37a6-4d67-910c-8cd936706083','c5a5e4c0-0953-496c-a424-8fc002bcc707','c0937f42-8a10-4636-8166-606a9147fd47'),('c0e4ce36-37a6-4d67-910c-8cd936706083','d4c1f55e-e5b8-4b2a-8f63-9ae34cec6e1a','c0937f42-8a10-4636-8166-606a9147fd47'),('c0e4ce36-37a6-4d67-910c-8cd936706083','fc875902-7d5e-47b4-852e-d0d241527819','c0937f42-8a10-4636-8166-606a9147fd47');
/*!40000 ALTER TABLE `tournament_competitor_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weight_category`
--

DROP TABLE IF EXISTS `weight_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weight_category` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `weight_min` int NOT NULL,
  `weight_max` int NOT NULL,
  `age_group_id` int unsigned NOT NULL,
  `gender` enum('H','F') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `weight_category_age_group_id_index` (`age_group_id`),
  CONSTRAINT `weight_category_age_group_id_foreign` FOREIGN KEY (`age_group_id`) REFERENCES `age_group` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weight_category`
--

LOCK TABLES `weight_category` WRITE;
/*!40000 ALTER TABLE `weight_category` DISABLE KEYS */;
INSERT INTO `weight_category` VALUES (1,'Catégorie Poids 1',10,15,1,'H'),(2,'Catégorie Poids 2',20,25,2,'F'),(3,'Catégorie Poids 3',30,35,3,'H'),(4,'Catégorie Poids 4',40,45,4,'F'),(5,'Catégorie Poids 5',50,55,5,'H');
/*!40000 ALTER TABLE `weight_category` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-15 23:45:10
