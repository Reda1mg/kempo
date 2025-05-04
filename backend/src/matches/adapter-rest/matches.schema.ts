import { z } from "@hono/zod-openapi";

export const MatchSchemaCreate = z.object({
    id: z.string().uuid(),
    competitor1: z.string().uuid(),
    competitor2: z.string().uuid(),
})
    
