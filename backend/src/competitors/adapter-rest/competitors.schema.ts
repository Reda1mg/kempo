import { z } from "@hono/zod-openapi";
import { EnumRank } from "../../entities/Tournament.entity.ts";
import { AgeGroup } from "../../entities/AgeGroup.entity.ts";
import { EnumSexe } from "../../entities/WeightCategory.ts";


export const CompetitorSchema = z.object({
    id: z.string().uuid(),
    firstname: z.string() ,
    lastname: z.string() ,
    birthday: z.coerce.date(),
    club: z.string().optional(),
    country: z.string(),
    weight: z.coerce.number().optional(),
    rank: z.nativeEnum(EnumRank),
    sexe: z.nativeEnum(EnumSexe),
})

export const CompetitorSchemaCreate = CompetitorSchema.omit({id : true})

export const CompetitorSchemaUpdate = CompetitorSchema.omit({id : true}).optional()

export type Competitor = z.infer<typeof CompetitorSchema>
export type CompetitorCreate = z.infer<typeof CompetitorSchemaCreate>
export type CompetitorUpdate = z.infer<typeof CompetitorSchemaUpdate>