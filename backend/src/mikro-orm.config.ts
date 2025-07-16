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
import { DatabaseSecurityService } from './security/database-security.ts';

const secureConfig = DatabaseSecurityService.getSecureDbConfig();

export default defineConfig({
  dbName: process.env.DB_NAME || 'kempo_collab',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  
  // Configuration de sécurité
  ...secureConfig,
  
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
  
  // Logs et debug (désactivé en production)
  debug: process.env.NODE_ENV !== 'production',
}); 