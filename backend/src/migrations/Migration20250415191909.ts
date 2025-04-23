import { Migration } from '@mikro-orm/migrations';

export class Migration20250415191909 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`competitor\` (\`id\` varchar(36) not null, \`firstname\` varchar(255) not null, \`lastname\` varchar(255) not null, \`birthday\` datetime not null, \`club\` varchar(255) not null, \`country\` varchar(255) not null, \`weight\` int not null, \`rank\` enum('Ceinture Blanche', 'Ceinture Blanche-Jaune', 'Ceinture Jaune', 'Ceinture Jaune-Orange', 'Ceinture Orange', 'Ceinture Orange-Verte', 'Ceinture Verte', 'Ceinture Verte-Bleue', 'Ceinture Bleue', 'Ceinture Bleue-Marron', 'Ceinture Marron', 'Ceinture Noire 1ère dan', 'Ceinture Noire 2ème dan', 'Ceinture Noire 3ème dan', 'Ceinture Noire 4ème dan', 'Ceinture Noire 5ème dan', 'Ceinture Noire 6ème dan') not null, \`sexe\` enum('H', 'F') not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`competitor\`;`);
  }

}
