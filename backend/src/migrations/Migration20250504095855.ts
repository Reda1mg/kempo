import { Migration } from '@mikro-orm/migrations';

export class Migration20250504095855 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`match\` add \`pool_number\` int not null default 0;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`match\` drop column \`pool_number\`;`);
  }

}
