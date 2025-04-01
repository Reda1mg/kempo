import { Migration } from '@mikro-orm/migrations';

export class Migration20250401165146 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`tournament\` drop primary key;`);

    this.addSql(`alter table \`tournament\` change \`_id\` \`id\` varchar(36) not null;`);
    this.addSql(`alter table \`tournament\` add primary key \`tournament_pkey\`(\`id\`);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`tournament\` drop primary key;`);

    this.addSql(`alter table \`tournament\` change \`id\` \`_id\` varchar(36) not null;`);
    this.addSql(`alter table \`tournament\` add primary key \`tournament_pkey\`(\`_id\`);`);
  }

}
