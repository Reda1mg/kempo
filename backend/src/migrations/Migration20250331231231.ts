import { Migration } from '@mikro-orm/migrations';

export class Migration20250331231231 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`tournament\` (\`_id\` varchar(36) not null, \`name\` varchar(255) not null, \`rank\` enum('Ceinture Blanche', 'Ceinture Jaune', 'Ceinture Orange', 'Ceinture Violette', 'Ceinture Bleue', 'Ceinture Verte', 'Ceinture Marron', 'Ceinture Noire') not null, \`city\` varchar(255) not null, primary key (\`_id\`)) default character set utf8mb4 engine = InnoDB;`);
  }

}
