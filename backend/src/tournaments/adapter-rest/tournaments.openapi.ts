import { createRoute, z } from "@hono/zod-openapi";
import { TournamentSchema } from "./tournaments.schema.ts";
import { EnumRank } from "../../entities/Tournament.entity.ts";

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
        summary: 'Create one tournament',
        description: 'Create one tournament',
        body: z.object({ 
            name: z.string(),
            rank: z.nativeEnum(EnumRank),
            city: z.string(),
            start_date: z.date(),
            end_date: z.date()

         }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
        
        responses: {
        201: {
            description: 'Tournament created',
            content: {
                "text/plain": {
                    schema: z.string()
                }
            }
        },

    }
    }),

    put: createRoute({
        method: 'put',
        path: '/{id}',
        summary: 'Modify one tournament',
        description: 'Modify one tournament',
        body: z.object({ 
            name: z.string(),
            rank: z.nativeEnum(EnumRank),
            city: z.string(),
            start_date: z.date(),
            end_date: z.date()

         }),
          headers: new Headers({ 'Content-Type': 'application/json' }),
          request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
        201: {
            description: 'Tournament modified',
            content: {
                "text/plain": {
                    schema: z.string()
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

    list: createRoute({
        method: 'get',
        path: '',
        summary: 'Get all tournaments',
        description: 'Get all tournaments',
        query: TournamentSchema,
        responses: {
            200: {
                description: 'Details of the tournament',
                content: {
                    'application/json': {
                        schema: z.array(TournamentSchema)
                    }
                }
            },
        }
    }),

    delete: createRoute({
        method: 'delete',
        path: '/{id}',
        summary: 'Delete one tournament',
        description: 'Delete one tournament by ID',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            202: {
                description: 'Tournament deleted',
                content: {
                    "text/plain": {
                        schema: z.string()
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


}