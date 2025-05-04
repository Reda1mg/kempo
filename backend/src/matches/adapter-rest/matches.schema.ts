import { z } from "@hono/zod-openapi";
import { CompetitorSchema } from "../../competitors/adapter-rest/competitors.schema.ts";
import { CategorySchema } from "../../tournaments/adapter-rest/tournaments.schema.ts";


export const MatchSchemaCreate = z.object({
    id: z.string().uuid(),
    competitor1: z.string().uuid(),
    competitor2: z.string().uuid(),
})

export const MatchSchema = z.object({
    id: z.string().uuid(),
    competitor1: z.string().uuid().nullable(),
    competitor2: z.string().uuid().nullable(),
    score1: z.number(),
    score2: z.number(),
    category: z.string().uuid(),
    keikuka1: z.number(),
    keikuka2: z.number(),
    winner: z.string().uuid().nullable(),
    isFinished: z.boolean(),
    pool_number: z.string()
})
    
