import { Migration } from '@mikro-orm/migrations';

export class Migration20250405141617 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`tournament\` add \`age_group_id\` int unsigned null;`);
    this.addSql(`alter table \`tournament\` modify \`rank\` enum('Ceinture Blanche', 'Ceinture Blanche-Jaune', 'Ceinture Jaune', 'Ceinture Jaune-Orange', 'Ceinture Orange', 'Ceinture Orange-Verte', 'Ceinture Verte', 'Ceinture Verte-Bleue', 'Ceinture Bleue', 'Ceinture Bleue-Marron', 'Ceinture Marron', 'Ceinture Noire 1ère dan', 'Ceinture Noire 2ème dan', 'Ceinture Noire 3ème dan', 'Ceinture Noire 4ème dan', 'Ceinture Noire 5ème dan', 'Ceinture Noire 6ème dan') not null;`);
    this.addSql(`alter table \`tournament\` add constraint \`tournament_age_group_id_foreign\` foreign key (\`age_group_id\`) references \`age_group\` (\`id\`) on update cascade on delete set null;`);
    this.addSql(`alter table \`tournament\` add index \`tournament_age_group_id_index\`(\`age_group_id\`);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`tournament\` drop foreign key \`tournament_age_group_id_foreign\`;`);

    this.addSql(`alter table \`tournament\` drop index \`tournament_age_group_id_index\`;`);
    this.addSql(`alter table \`tournament\` drop column \`age_group_id\`;`);

    this.addSql(`alter table \`tournament\` modify \`rank\` enum('Ceinture Blanche', 'Ceinture Jaune', 'Ceinture Orange', 'Ceinture Violette', 'Ceinture Bleue', 'Ceinture Verte', 'Ceinture Marron', 'Ceinture Noire') not null;`);
  }

}
