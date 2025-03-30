import { getApp } from "../../api/get-app.ts";
import { TournamentsRoutes } from "./tournaments.openapi.ts";
import { TournamentEliminationType, TournamentCategory } from "./tournaments.schema.ts";

export function buildTournamentsRouter() {
    const router = getApp()

    return router.openapi(TournamentsRoutes.get, (ctx) => {
        const { id } = ctx.req.valid('param')

        return ctx.json({
            id: '123',
            name: 'Tournament 1',
            date: new Date().toISOString(),
            location: 'New York',
            category: TournamentCategory.SENIOR,
            elimination_type: TournamentEliminationType.POOL,
        })
    })
}