import { Migration } from '@mikro-orm/migrations';

export class Migration20250406123425 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`weight_category\` (\`id\` int unsigned not null auto_increment primary key, \`name\` varchar(255) not null, \`weight_min\` int not null, \`weight_max\` int not null, \`age_group_id\` int unsigned not null, \`sexe\` enum('H', 'F') not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`weight_category\` add index \`weight_category_age_group_id_index\`(\`age_group_id\`);`);

    this.addSql(`alter table \`weight_category\` add constraint \`weight_category_age_group_id_foreign\` foreign key (\`age_group_id\`) references \`age_group\` (\`id\`) on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`weight_category\`;`);
  }

}
