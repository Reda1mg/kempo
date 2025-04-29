import { Migration } from '@mikro-orm/migrations';

export class Migration20250428184600 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`category\` add \`elimination_type\` enum('Directe', 'Poule') not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`category\` drop column \`elimination_type\`;`);
  }

}
