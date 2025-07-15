// mikro-orm.config.ts
import { defineConfig, MySqlDriver } from '@mikro-orm/mysql';
import { TournamentSchema } from './entities/Tournament.entity.ts';
import { CompetitorSchema } from './entities/Competitor.entity.ts';
import { CategorySchema } from './entities/Category.entity.ts';
import { AgeGroupSchema } from './entities/age-group.entity.ts';
import { WeightCategorySchema } from './entities/weight-category.ts';
import { MatchSchema } from './entities/match.entity.ts';
import { TournamentCompetitorCategorySchema } from './entities/tournament-competitor-category.entity.ts';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';

export default defineConfig({
  dbName: 'kempo_collab',
  user: 'root',
  password: 'root',
  host: 'localhost',
  port: 3306,
  entities: [
    TournamentSchema,
    CompetitorSchema,
    CategorySchema,
    AgeGroupSchema,
    WeightCategorySchema,
    MatchSchema,
    TournamentCompetitorCategorySchema
  ],
  driver: MySqlDriver,
  allowGlobalContext: true,
  extensions: [Migrator, SeedManager],
}) 