import { Migration } from '@mikro-orm/migrations';

export class Migration20250503093227 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`category\` add \`name\` varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`category\` drop column \`name\`;`);
  }

}
