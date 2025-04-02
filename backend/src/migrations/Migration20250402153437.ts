import { Migration } from '@mikro-orm/migrations';

export class Migration20250402153437 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`tournament\` (\`id\` varchar(36) not null, \`name\` varchar(255) not null, \`rank\` enum('Ceinture Blanche', 'Ceinture Jaune', 'Ceinture Orange', 'Ceinture Violette', 'Ceinture Bleue', 'Ceinture Verte', 'Ceinture Marron', 'Ceinture Noire') not null, \`city\` varchar(255) not null, \`start_date\` datetime not null, \`end_date\` datetime not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
  }

}
