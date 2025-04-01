import { z } from "@hono/zod-openapi";
import { EnumRank } from "../../entities/Tournament.entity.ts";


export const TournamentSchema = z.object({
    id: z.string().uuid(),
    name: z.string() ,
    rank: z.optional(z.nativeEnum(EnumRank)),
    city: z.optional(z.string())
})

export type Tournament = z.infer<typeof TournamentSchema>