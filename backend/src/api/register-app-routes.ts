import type { OpenAPIHono } from "@hono/zod-openapi";
import { buildTournamentsRouter } from "../tournaments/adapter-rest/tournaments.router.ts";
import type { AppEnv } from "./get-app.ts";
import { apiReference } from "@scalar/hono-api-reference";

export const registerAppRoutes = (baseApp: OpenAPIHono<AppEnv>) => {
    let app = baseApp.route('/tournaments', buildTournamentsRouter())

    app.doc('/docs', {
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'Kenpo API Documentation',
        },
    })
    
    app.get(
        '/doc',
        apiReference({
          url: '/docs',
        }),
      )



    return app
}