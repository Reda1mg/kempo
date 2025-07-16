import { serve } from '@hono/node-server'
import { registerAppRoutes } from './api/register-app-routes.ts'
import { getApp } from './api/get-app.ts'
import { EntityManager } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config.ts';
import { Tournament } from './entities/Tournament.entity.ts';
import { contextStorage } from 'hono/context-storage';
import { cors } from 'hono/cors';
import { DataProtectionService } from './security/data-protection.ts';
import { BackupService } from './security/backup-service.ts';
import { AWSBackupService } from './security/aws-backup-service.ts';
import 'dotenv/config';

// Initialisation sécurité
DataProtectionService.initializeEncryption();

// Initialisation des services de sauvegarde
if (process.env.USE_AWS_BACKUP === 'true') {
  await AWSBackupService.initialize();
  AWSBackupService.startAutomaticBackup();
  console.log('☁️  Service AWS S3 Backup activé');
} else {
  await BackupService.initialize();
  BackupService.startAutomaticBackup();
  console.log('💾 Service de sauvegarde local activé');
}




const orm = await MikroORM.init(config);
const em = orm.em;

const httpApp = getApp();


httpApp.use(contextStorage())

httpApp.use(async (c, next) => {
  c.set('em', em)
  await next()
})




httpApp.use(cors())

const app = registerAppRoutes(httpApp)



serve({
  fetch: app.fetch,
  port: 8000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
  console.log(`API documentation is available on http://localhost:${info.port}/docs`)
})