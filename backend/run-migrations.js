import { MikroORM } from '@mikro-orm/core';
import config from './src/mikro-orm.config.ts';

const main = async () => {
  console.log('🚀 Démarrage des migrations...');
  
  const orm = await MikroORM.init(config);
  
  try {
    const migrator = orm.getMigrator();
    await migrator.up();
    console.log('✅ Migrations exécutées avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors des migrations:', error);
  } finally {
    await orm.close();
  }
};

main().catch(console.error);
