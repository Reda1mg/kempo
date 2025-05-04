import { Migration } from '@mikro-orm/migrations';

export class Migration20250504121548 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`match\` modify \`pool_number\` varchar(255) not null default '0';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`match\` modify \`pool_number\` int not null default 0;`);
  }

}
