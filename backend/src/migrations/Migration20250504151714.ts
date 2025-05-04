import { Migration } from '@mikro-orm/migrations';

export class Migration20250504151714 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`match\` drop index \`match_competitor1_id_index\`;`);
    this.addSql(`alter table \`match\` drop index \`match_competitor2_id_index\`;`);

    this.addSql(`alter table \`match\` add \`next_match_id\` varchar(36) null default null;`);
    this.addSql(`alter table \`match\` modify \`competitor1_id\` varchar(36) null, modify \`competitor2_id\` varchar(36) null;`);
    this.addSql(`alter table \`match\` add constraint \`match_next_match_id_foreign\` foreign key (\`next_match_id\`) references \`match\` (\`id\`) on update cascade on delete set null;`);
    this.addSql(`alter table \`match\` add constraint \`match_competitor1_id_foreign\` foreign key (\`competitor1_id\`) references \`competitor\` (\`id\`) on update cascade on delete set null;`);
    this.addSql(`alter table \`match\` add constraint \`match_competitor2_id_foreign\` foreign key (\`competitor2_id\`) references \`competitor\` (\`id\`) on update cascade on delete set null;`);
    this.addSql(`alter table \`match\` add index \`match_next_match_id_index\`(\`next_match_id\`);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`match\` drop foreign key \`match_next_match_id_foreign\`;`);
    this.addSql(`alter table \`match\` drop foreign key \`match_competitor1_id_foreign\`;`);
    this.addSql(`alter table \`match\` drop foreign key \`match_competitor2_id_foreign\`;`);

    this.addSql(`alter table \`match\` drop index \`match_next_match_id_index\`;`);
    this.addSql(`alter table \`match\` drop column \`next_match_id\`;`);

    this.addSql(`alter table \`match\` modify \`competitor1_id\` varchar(36) not null, modify \`competitor2_id\` varchar(36) not null;`);
    this.addSql(`alter table \`match\` add constraint \`match_competitor1_id_foreign\` foreign key (\`competitor1_id\`) references \`competitor\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`match\` add constraint \`match_competitor2_id_foreign\` foreign key (\`competitor2_id\`) references \`competitor\` (\`id\`) on update cascade;`);
  }

}
