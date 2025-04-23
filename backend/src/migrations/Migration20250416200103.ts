import { Migration } from '@mikro-orm/migrations';

export class Migration20250416200103 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`competitor\` change \`sexe\` \`gender\` enum('H','F') not null;`);

    this.addSql(`alter table \`weight_category\` change \`sexe\` \`gender\` enum('H','F') not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`competitor\` change \`gender\` \`sexe\` enum('H','F') not null;`);

    this.addSql(`alter table \`weight_category\` change \`gender\` \`sexe\` enum('H','F') not null;`);
  }

}
