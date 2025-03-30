import { createRoute, z } from "@hono/zod-openapi";
import { TournamentSchema } from "./tournaments.schema.ts";

export const TournamentsRoutes = {
    get: createRoute({
        method: 'get',
        path: '/{id}',
        summary: 'Get one tournament',
        description: 'Get one tournament by ID',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'Details of the tournament',
                content: {
                    'application/json': {
                        schema: TournamentSchema
                    }
                }
            }
        }
    })
}