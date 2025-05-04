import { getApp } from "../../api/get-app.ts";
import { Match } from "../../entities/match.entity.ts";
import { MatchesRoutes } from "./maches.openapi.ts";


export function buildMatchesRouter() {
    const router = getApp()

    return router.openapi(MatchesRoutes.setResult, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const body = ctx.req.valid('json')

        const em = ctx.get("em");
        const match = await em.findOne(Match, { id })
        if (match == null) {
            return ctx.text("Not found", 404);
        }

        match.score1 = body.score1 ?? match.score1
        match.score2 = body.score2 ?? match.score2
        match.keikuka1 = body.keikuka1 ?? match.keikuka1
        match.keikuka2 = body.keikuka2 ?? match.keikuka2
        match.isFinished = true

        if (match.score1 > match.score2) {
            match.winner = match.competitor1
        }else if (match.score2 > match.score1) {
            match.winner = match.competitor2
        }else if (match.keikuka1 > match.keikuka2) {
            match.winner = match.competitor2
        }else if (match.keikuka2 > match.keikuka1) {
            match.winner = match.competitor1
        }
        else {
            match.winner = null
        }
        await em.persistAndFlush(match);
        return ctx.json(match.winner?.id ?? null, 200)
    })
}
 