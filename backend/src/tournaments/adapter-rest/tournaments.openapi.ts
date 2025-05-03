import { createRoute, z } from "@hono/zod-openapi";
import { CategorySchema, CategorySchemaCreate, TournamentSchema } from "./tournaments.schema.ts";
import { EnumRank } from "../../entities/Tournament.entity.ts";
import { CompetitorSchema } from "../../competitors/adapter-rest/competitors.schema.ts";
import { assign } from "@mikro-orm/core";

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
        path: '{id}/add-competitor/{competitorId}',
        summary: 'Add one competitor on the tournament',
        description: 'Add one competitor on the tournament by competitor ID',
        request: {
            params: z.object({
                id: z.string().uuid(),
                competitorId: z.string().uuid()
            }),
            
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
        path : '/{id}/competitors',
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
    }),
    createCategory: createRoute({
        method: 'post',
        path: '/{id}/categories',
        summary: 'Create one category',
        description: 'Create one category',
        request: {
            params: z.object({
                id: z.string().uuid()
            }),
            body :{
                content :{
                    "application/json" : {
                        schema : CategorySchemaCreate
                    }
                }
            }
        },
        responses: {
            201: {
                description: 'Category created',
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
            },
        }
    }),
    listCategories: createRoute({
        method: 'get',
        path: '/{id}/categories',
        summary: 'Get all categories',
        description: 'Get all categories of the tournament',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'Details of the categories',
                content: {
                    'application/json': {
                        schema: z.array(CategorySchema)
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
    }),
    assignCompetitors: createRoute({
        method: 'post',
        path: '/{id}/assign-competitors',
        summary: 'Assign competitors to a category',
        description: 'Assign competitors to a category',
        request: {
            params: z.object({
                id: z.string().uuid()
            }),
        },
        responses: {
            200: {
                description: 'Competitors assigned',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            404: {
                description: 'Tournament or Category not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
        },
    }),
    assignCompetitor: createRoute({
        method: 'post',
        path: '/{id}/assign-competitor/{categoryId}',
        summary: 'Assign one competitor to a category',
        description: 'Assign one competitor to a category',
        request: {
            params: z.object({
                id: z.string().uuid(),
                categoryId: z.string().uuid()
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
            200: {
                description: 'Competitor assigned',
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
        },
    }),
    getCategories: createRoute({
        method: 'get',
        path: '/{id}/categories',
        summary: 'Get all categories',
        description: 'Get all categories of the tournament',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'Details of the categories',
                content: {
                    'application/json': {
                        schema: z.array(CategorySchema)
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
    }),
    deleteCategory: createRoute({
        method: 'delete',
        path: '/categories/{categoryId}',
        summary: 'Delete one category',
        description: 'Delete one category by ID',
        request: {
            params: z.object({
                categoryId: z.string().uuid()
            })
        },
        responses: {
            202: {
                description: 'Category deleted',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            404: {
                description: 'Tournament or Category not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            }

        }
    }),
    getCategoryCompetitors: createRoute({
        method: 'get',  
        path: '/categories/{categoryId}/competitors',
        summary: 'Get all competitors of a category',
        description: 'Get all competitors of a category',
        request: {
            params: z.object({
                categoryId: z.string().uuid()
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
                description: 'Category not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
        }
    }),
   

}