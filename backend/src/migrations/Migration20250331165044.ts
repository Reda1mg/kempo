import { Migration } from '@mikro-orm/migrations';

export class Migration20250331165044 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`tournament\` (\`_id\` int unsigned not null auto_increment primary key, \`name\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);
  }

}
