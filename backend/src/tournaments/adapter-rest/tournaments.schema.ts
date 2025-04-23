import { z } from "@hono/zod-openapi";
import { EnumRank } from "../../entities/tournament.entity.ts";
import { AgeGroup } from "../../entities/age-group.entity.ts";


export const TournamentSchema = z.object({
    id: z.optional(z.string().uuid()),
    name: z.optional(z.string()) ,
    rank: z.optional(z.nativeEnum(EnumRank)),
    city: z.optional(z.string()),
    start_date: z.optional(z.coerce.date()),
    end_date: z.optional(z.coerce.date()),
    age_group_id: z.optional(z.coerce.number())
})

export type Tournament = z.infer<typeof TournamentSchema>