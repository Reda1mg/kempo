import { Migration } from '@mikro-orm/migrations';

export class Migration20250422172348 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`tournament_competitor\` (\`tournament_id\` varchar(36) not null, \`competitor_id\` varchar(36) not null, primary key (\`tournament_id\`, \`competitor_id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`tournament_competitor\` add index \`tournament_competitor_tournament_id_index\`(\`tournament_id\`);`);
    this.addSql(`alter table \`tournament_competitor\` add index \`tournament_competitor_competitor_id_index\`(\`competitor_id\`);`);

    this.addSql(`alter table \`tournament_competitor\` add constraint \`tournament_competitor_tournament_id_foreign\` foreign key (\`tournament_id\`) references \`tournament\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`tournament_competitor\` add constraint \`tournament_competitor_competitor_id_foreign\` foreign key (\`competitor_id\`) references \`competitor\` (\`id\`) on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`tournament_competitor\`;`);
  }

}
