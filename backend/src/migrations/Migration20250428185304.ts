import { Migration } from '@mikro-orm/migrations';

export class Migration20250428185304 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`category\` add \`age_group_id\` int unsigned null;`);
    this.addSql(`alter table \`category\` add constraint \`category_age_group_id_foreign\` foreign key (\`age_group_id\`) references \`age_group\` (\`id\`) on update cascade on delete set null;`);
    this.addSql(`alter table \`category\` add index \`category_age_group_id_index\`(\`age_group_id\`);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`category\` drop foreign key \`category_age_group_id_foreign\`;`);

    this.addSql(`alter table \`category\` drop index \`category_age_group_id_index\`;`);
    this.addSql(`alter table \`category\` drop column \`age_group_id\`;`);
  }

}
