import { createRoute, z } from "@hono/zod-openapi";
import { TournamentSchema } from "./tournaments.schema.ts";
import { EnumRank } from "../../entities/tournament.entity.ts";
import { CompetitorSchema } from "../../competitors/adapter-rest/competitors.schema.ts";

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
        request :{
            body :{
                content :{
                    "application/json" : {
                        schema : z.object({ 
                            name: z.string(),
                            rank: z.nativeEnum(EnumRank).optional(),
                            city: z.string().optional(),
                            start_date: z.coerce.date(),
                            end_date: z.coerce.date().optional(),
                            age_group_id: z.coerce.number().optional()
                
                         })
                    }
                }
            }
        },
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
        
          headers: new Headers({ 'Content-Type': 'application/json' }),
          request: {
            params: z.object({
                id: z.string().uuid(),
                
            }),
            body:{
                content: {
                    "application/json": {
                        schema : TournamentSchema
                    }
                }
            }
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
        request : {
            query : TournamentSchema
        },
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
    addCompetitor: createRoute({
        method: 'post',
        path: '/add-competitor/{id}',
        summary: 'Add one competitor ',
        description: 'Add one competitor on the tournament by competitor ID',
        request: {
            params: z.object({
                id: z.string().uuid()
            }),
            body :{
                content :{
                    "application/json" : {
                        schema : z.object({ 
                            competitor_id: z.string().uuid()
                         })
                    }
                }
            }
        },
        responses: {
            201: {
                description: 'Competitor add',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            404: {
                description: 'Tournament or Competitor not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            409: {
                description: 'Competitor already in tournament',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            }

        }
    }),
    deleteCompetitor: createRoute({
        method: 'delete',
        path: '/delete-competitor/{id}',
        summary: 'Delete one competitor ',
        description: 'Delete one competitor on the tournament by competitor ID',
        request: {
            params: z.object({
                id: z.string().uuid()
            }),
            body :{
                content :{
                    "application/json" : {
                        schema : z.object({ 
                            competitor_id: z.string().uuid()
                         })
                    }
                }
            }
        },
        responses: {
            202: {
                description: 'Competitor deleted',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            404: {
                description: 'Tournament or Competitor not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            409: {
                description: 'Competitor not in tournament',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            }

        }
    }),
    getCompetitors: createRoute({
        method: 'get',
        path : '/competitors/{id}',
        summary: 'Get all competitors of a tournament',
        description: 'Get all competitors of a tournament',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'Details of the competitors',
                content: {
                    'application/json': {
                        schema: z.array(CompetitorSchema)
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
            },
        }
    })
}