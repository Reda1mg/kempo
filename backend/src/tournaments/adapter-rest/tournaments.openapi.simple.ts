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
            },
            404: {
                description: 'Tournament not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            }
        }
    }),

    post: createRoute({
        method: 'post',
        path: '',
        summary: 'Create a tournament',
        description: 'Create a new tournament',
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: TournamentSchema.omit({ id: true })
                    }
                }
            }
        },
        responses: {
            201: {
                description: 'Tournament created',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            }
        }
    }),

    list: createRoute({
        method: 'get',
        path: '',
        summary: 'List all tournaments',
        description: 'List all tournaments',
        request: {
            query: z.object({
                id: z.string().uuid().optional()
            })
        },
        responses: {
            200: {
                description: 'List of tournaments',
                content: {
                    'application/json': {
                        schema: z.array(TournamentSchema)
                    }
                }
            }
        }
    })
}
