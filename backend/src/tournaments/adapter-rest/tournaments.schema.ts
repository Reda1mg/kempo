import { z } from "@hono/zod-openapi";

export enum TournamentCategory {
    JUNIOR = 'junior',
    SENIOR = 'senior',
    VETERAN = 'veteran',
}

export enum TournamentEliminationType {
    POOL = 'pool',
    DIRECT = 'direct',
}

export const TournamentSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    date: z.date(),
    category: z.nativeEnum(TournamentCategory),
    elimination_type: z.nativeEnum(TournamentEliminationType),
})

export type Tournament = z.infer<typeof TournamentSchema>