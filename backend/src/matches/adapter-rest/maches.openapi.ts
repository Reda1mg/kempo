import { createRoute, z } from "@hono/zod-openapi";
import { CompetitorSchema } from "../../competitors/adapter-rest/competitors.schema.ts";

export const MatchesRoutes = {
    getMatchesByCategory: createRoute({
        method: 'get',
        path: '/category/{categoryId}',
        summary: 'Get matches by category',
        description: 'Get all matches for a specific category',
        request: {
            params: z.object({
                categoryId: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'Matches retrieved',
                content: {
                    'application/json': {
                        schema: z.array(z.object({
                            id: z.string().uuid(),
                            competitor1: CompetitorSchema.nullable(),
                            competitor2: CompetitorSchema.nullable(),
                            score1: z.number(),
                            score2: z.number(),
                            keikuka1: z.number(),
                            keikuka2: z.number(),
                            winner: CompetitorSchema.nullable(),
                            isFinished: z.boolean(),
                            pool_number: z.string(),
                            time: z.number().optional(),
                            isRunning: z.boolean().optional()
                        }))
                    }
                }
            },
            404: {
                description: 'Category not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
        }
    }),
    getMatch: createRoute({
        method: 'get',
        path: '/{id}',
        summary: 'Get a specific match',
        description: 'Get details of a specific match',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'Match retrieved',
                content: {
                    'application/json': {
                        schema: z.object({
                            id: z.string().uuid(),
                            competitor1: CompetitorSchema.nullable(),
                            competitor2: CompetitorSchema.nullable(),
                            score1: z.number(),
                            score2: z.number(),
                            keikuka1: z.number(),
                            keikuka2: z.number(),
                            winner: CompetitorSchema.nullable(),
                            isFinished: z.boolean(),
                            pool_number: z.string(),
                            time: z.number().optional(),
                            isRunning: z.boolean().optional(),
                            category: z.object({
                                id: z.string().uuid(),
                                name: z.string()
                            })
                        })
                    }
                }
            },
            404: {
                description: 'Match not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
        }
    }),
    setResult: createRoute({
        method: 'post',
        path: '/{id}',
        summary: 'Set the result of a match',
        description: 'Set the result of a match',
        request: {
            params: z.object({
                id: z.string().uuid()
            }),
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            score1: z.number().optional(),
                            score2: z.number().optional(),
                            keikuka1: z.number().optional(),
                            keikuka2: z.number().optional(),
                            winner: z.string().uuid().optional(),
                            isFinished: z.boolean().optional(),
                            time: z.number().optional(),
                            isRunning: z.boolean().optional()
                        })
                    }
                }
            },
        },
        responses: {
            200: {
                description: 'Match result updated',
                content: {
                    'application/json': {
                        schema: z.string().nullable()
                    }
                }
            },
            404: {
                description: 'Match not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
        }
    }),
}
