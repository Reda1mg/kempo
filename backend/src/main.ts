import { serve } from '@hono/node-server'
import { registerAppRoutes } from './api/register-app-routes.ts'
import { getApp } from './api/get-app.ts'
import { EntityManager } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config.ts';
import { Tournament } from './entities/Tournament.entity.ts';



const orm = await MikroORM.init(config);
const em = orm.em;

const newTournament = new Tournament();
newTournament._id = 1 ;
newTournament.name = "test" ;

await em.persistAndFlush(newTournament);

await orm.close();

 const app = registerAppRoutes(getApp(),em)

 serve({
   fetch: app.fetch,
   port: 3000
 }, (info) => {
   console.log(`Server is running on http://localhost:${info.port}`)
   console.log(`API documentation is available on http://localhost:${info.port}/docs`)
 })