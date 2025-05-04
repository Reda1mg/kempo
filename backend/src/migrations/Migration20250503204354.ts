import { Migration } from '@mikro-orm/migrations';

export class Migration20250503204354 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`match\` (\`id\` varchar(36) not null, \`competitor1_id\` varchar(36) not null, \`competitor2_id\` varchar(36) not null, \`score1\` int not null default 0, \`score2\` int not null default 0, \`category_id\` varchar(36) not null, \`keikuka1\` int not null default 0, \`keikuka2\` int not null default 0, \`winner_id\` varchar(36) null default null, \`is_finished\` tinyint(1) not null default false, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`match\` add unique \`match_competitor1_id_unique\`(\`competitor1_id\`);`);
    this.addSql(`alter table \`match\` add unique \`match_competitor2_id_unique\`(\`competitor2_id\`);`);
    this.addSql(`alter table \`match\` add unique \`match_category_id_unique\`(\`category_id\`);`);
    this.addSql(`alter table \`match\` add unique \`match_winner_id_unique\`(\`winner_id\`);`);

    this.addSql(`alter table \`match\` add constraint \`match_competitor1_id_foreign\` foreign key (\`competitor1_id\`) references \`competitor\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`match\` add constraint \`match_competitor2_id_foreign\` foreign key (\`competitor2_id\`) references \`competitor\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`match\` add constraint \`match_category_id_foreign\` foreign key (\`category_id\`) references \`category\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`match\` add constraint \`match_winner_id_foreign\` foreign key (\`winner_id\`) references \`competitor\` (\`id\`) on update cascade on delete set null;`);

    this.addSql(`alter table \`category\` modify \`gender\` enum('H', 'F') null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`match\`;`);

    this.addSql(`alter table \`category\` modify \`gender\` enum('H', 'F') not null;`);
  }

}
