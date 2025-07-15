import { createRoute, z } from "@hono/zod-openapi";
import { TournamentSchema, CategorySchema, CategorySchemaCreate, TournamentCreateSchema, TournamentUpdateSchema } from "./tournaments.schema.ts";

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
                        schema: TournamentCreateSchema
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

    put: createRoute({
        method: 'put',
        path: '/{id}',
        summary: 'Update a tournament',
        description: 'Update an existing tournament',
        request: {
            params: z.object({
                id: z.string().uuid()
            }),
            body: {
                content: {
                    'application/json': {
                        schema: TournamentUpdateSchema
                    }
                }
            }
        },
        responses: {
            201: {
                description: 'Tournament updated',
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

    delete: createRoute({
        method: 'delete',
        path: '/{id}',
        summary: 'Delete a tournament',
        description: 'Delete a tournament by ID',
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
    }),

    addCompetitor: createRoute({
        method: 'post',
        path: '/{id}/competitors/{competitorId}',
        summary: 'Add competitor to tournament',
        description: 'Add a competitor to a tournament',
        request: {
            params: z.object({
                id: z.string().uuid(),
                competitorId: z.string().uuid()
            })
        },
        responses: {
            201: {
                description: 'Competitor added to tournament',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            404: {
                description: 'Tournament or competitor not found',
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
        path: '/{id}/competitors/{idCompetitor}',
        summary: 'Remove competitor from tournament',
        description: 'Remove a competitor from a tournament',
        request: {
            params: z.object({
                id: z.string().uuid(),
                idCompetitor: z.string().uuid()
            })
        },
        responses: {
            202: {
                description: 'Competitor removed from tournament',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            404: {
                description: 'Tournament or competitor not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            409: {
                description: 'Competitor already assigned to category',
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
        path: '/{id}/competitors',
        summary: 'Get tournament competitors',
        description: 'Get all competitors in a tournament',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'List of competitors',
                content: {
                    'application/json': {
                        schema: z.array(z.any())
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

    createCategory: createRoute({
        method: 'post',
        path: '/{id}/categories',
        summary: 'Create category in tournament',
        description: 'Create a new category in a tournament',
        request: {
            params: z.object({
                id: z.string().uuid()
            }),
            body: {
                content: {
                    'application/json': {
                        schema: CategorySchemaCreate
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
            }
        }
    }),

    listCategories: createRoute({
        method: 'get',
        path: '/{id}/categories',
        summary: 'List tournament categories',
        description: 'List all categories in a tournament',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'List of categories',
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
            }
        }
    }),

    assignCompetitor: createRoute({
        method: 'post',
        path: '/{id}/categories/{categoryId}/competitors/{competitorId}',
        summary: 'Assign competitor to category',
        description: 'Assign a competitor to a category in a tournament',
        request: {
            params: z.object({
                id: z.string().uuid(),
                categoryId: z.string().uuid(),
                competitorId: z.string().uuid()
            })
        },
        responses: {
            201: {
                description: 'Competitor assigned to category',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            404: {
                description: 'Tournament, category, or competitor not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            409: {
                description: 'Competitor already assigned to this category',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            }
        }
    }),

    getAllCompetitors: createRoute({
        method: 'get',
        path: '/{id}/categories/{categoryId}/competitors',
        summary: 'Get available competitors for category',
        description: 'Get all competitors available for assignment to a category',
        request: {
            params: z.object({
                id: z.string().uuid(),
                categoryId: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'List of available competitors',
                content: {
                    'application/json': {
                        schema: z.array(z.any())
                    }
                }
            }
        }
    })
}
