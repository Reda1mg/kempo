import { Migration } from '@mikro-orm/migrations';

export class Migration20250715160000 extends Migration {

  async up(): Promise<void> {
    // Rendre les champs optionnels nullable dans la base de données
    
    // Pour la table Tournament
    this.addSql('ALTER TABLE `tournament` MODIFY `city` VARCHAR(255) NULL;');
    this.addSql('ALTER TABLE `tournament` MODIFY `end_date` DATETIME NULL;');
    
    // Pour la table Competitor  
    this.addSql('ALTER TABLE `competitor` MODIFY `club` VARCHAR(255) NULL;');
    this.addSql('ALTER TABLE `competitor` MODIFY `weight` INT NULL;');
    
    // Pour la table Category
    this.addSql('ALTER TABLE `category` MODIFY `weight_min` INT NULL;');
    this.addSql('ALTER TABLE `category` MODIFY `weight_max` INT NULL;');
  }

  async down(): Promise<void> {
    // Annuler les changements (rendre les champs NOT NULL)
    this.addSql('ALTER TABLE `tournament` MODIFY `city` VARCHAR(255) NOT NULL;');
    this.addSql('ALTER TABLE `tournament` MODIFY `end_date` DATETIME NOT NULL;');
    
    this.addSql('ALTER TABLE `competitor` MODIFY `club` VARCHAR(255) NOT NULL;');
    this.addSql('ALTER TABLE `competitor` MODIFY `weight` INT NOT NULL;');
    
    this.addSql('ALTER TABLE `category` MODIFY `weight_min` INT NOT NULL;');
    this.addSql('ALTER TABLE `category` MODIFY `weight_max` INT NOT NULL;');
  }

}
