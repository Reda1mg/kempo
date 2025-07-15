import { Migration } from '@mikro-orm/migrations';

export class Migration20250715132000 extends Migration {

  async up(): Promise<void> {
    this.addSql('ALTER TABLE `match` ADD `time` int NOT NULL DEFAULT 180;');
    this.addSql('ALTER TABLE `match` ADD `is_running` tinyint(1) NOT NULL DEFAULT 0;');
  }

  async down(): Promise<void> {
    this.addSql('ALTER TABLE `match` DROP `time`;');
    this.addSql('ALTER TABLE `match` DROP `is_running`;');
  }

}
