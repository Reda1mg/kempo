import { Migration } from '@mikro-orm/migrations';

export class Migration20250428180304 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_category_id_foreign\`;`);

    this.addSql(`alter table \`tournament_competitor_category\` modify \`category_id\` varchar(36) null;`);
    this.addSql(`alter table \`tournament_competitor_category\` add constraint \`tournament_competitor_category_category_id_foreign\` foreign key (\`category_id\`) references \`category\` (\`id\`) on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_category_id_foreign\`;`);

    this.addSql(`alter table \`tournament_competitor_category\` modify \`category_id\` varchar(36) not null;`);
    this.addSql(`alter table \`tournament_competitor_category\` add constraint \`tournament_competitor_category_category_id_foreign\` foreign key (\`category_id\`) references \`category\` (\`id\`) on update cascade;`);
  }

}
