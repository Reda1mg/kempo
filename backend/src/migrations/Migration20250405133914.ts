import { Migration } from '@mikro-orm/migrations';

export class Migration20250405133914 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`age_group\` (\`id\` int unsigned not null auto_increment primary key, \`name\` varchar(255) not null, \`age_min\` int not null, \`age_max\` int not null) default character set utf8mb4 engine = InnoDB;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`age_group\`;`);
  }

}
