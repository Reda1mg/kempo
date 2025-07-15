import { Migration } from '@mikro-orm/migrations';

export class Migration20250715142000 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `tournament` modify column `city` varchar(255) null;');
    this.addSql('alter table `tournament` modify column `end_date` datetime null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `tournament` modify column `city` varchar(255) not null;');
    this.addSql('alter table `tournament` modify column `end_date` datetime not null;');
  }
}
