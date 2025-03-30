import { defineConfig } from '@mikro-orm/core';
import { Tournament } from './entities/Tournament.ts';

const config = defineConfig({
    entities: [ Tournament],
    entitiesTs: ['./dist/entities'],
    dbName: 'kempo_db',
    user: 'root',
    password: '',
    host: 'localhost',
    port: 3306,
    debug: true,
  });

export default config;