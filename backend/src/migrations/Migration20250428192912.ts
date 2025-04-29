import { Migration } from '@mikro-orm/migrations';

export class Migration20250428192912 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`category\` modify \`rank\` text not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`category\` modify \`rank\` enum('Ceinture Blanche', 'Ceinture Blanche-Jaune', 'Ceinture Jaune', 'Ceinture Jaune-Orange', 'Ceinture Orange', 'Ceinture Orange-Verte', 'Ceinture Verte', 'Ceinture Verte-Bleue', 'Ceinture Bleue', 'Ceinture Bleue-Marron', 'Ceinture Marron', 'Ceinture Noire 1ère dan', 'Ceinture Noire 2ème dan', 'Ceinture Noire 3ème dan', 'Ceinture Noire 4ème dan', 'Ceinture Noire 5ème dan', 'Ceinture Noire 6ème dan') not null;`);
  }

}
