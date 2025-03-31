import type { OpenAPIHono } from "@hono/zod-openapi";
import { buildTournamentsRouter } from "../tournaments/adapter-rest/tournaments.router.ts";
import { EntityManager } from '@mikro-orm/core';

export const registerAppRoutes = (baseApp: OpenAPIHono,em : EntityManager) => {
    let app = baseApp.route('/tournaments', buildTournamentsRouter())

    app.doc('/docs', {
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'Kenpo API Documentation',
        },
    })

    return app
}