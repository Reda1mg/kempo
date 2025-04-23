import type { OpenAPIHono } from "@hono/zod-openapi";
import { buildTournamentsRouter } from "../tournaments/adapter-rest/tournaments.router.ts";
import type { AppEnv } from "./get-app.ts";
import { apiReference } from "@scalar/hono-api-reference";
import { buildRanksRouter } from "../rank/adapter-rest/ranks.router.ts";
import { buildCompetitorsRouter } from "../competitors/adapter-rest/competitors.router.ts";

export const registerAppRoutes = (baseApp: OpenAPIHono<AppEnv>) => {
    let app = baseApp.route('/tournaments', buildTournamentsRouter())
    app = baseApp.route('/ranks',buildRanksRouter())
    app = baseApp.route('/competitors',buildCompetitorsRouter())


    app.doc('/doc', {
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'Kenpo API Documentation',
        },
    })
    
    app.get(
        '/docs',
        apiReference({
          url: '/doc',
        }),
      )



    return app
}