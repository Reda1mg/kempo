import { resourceLimits } from "worker_threads";
import { getApp } from "../../api/get-app.ts";
import { EnumRank, Tournament } from "../../entities/Tournament.entity.ts";
import { TournamentsRoutes } from "./tournaments.openapi.ts";
import { zValidator } from '@hono/zod-validator'
import { validator } from "hono/validator";

export function buildTournamentsRouter() {
    const router = getApp()

    return router.openapi(TournamentsRoutes.get, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const em = ctx.get("em");
        const result = await em.findOne(Tournament, { id })
        if (result == null) {
            return ctx.text("Not found", 404);
        }

        return ctx.json({
            id: result.id,
            name: result.name ?? "",
            rank: result.rank ?? EnumRank.WHITE,
            city: result.city ?? ""

        }, 200)
    })
    .openapi(TournamentsRoutes.post, async (ctx) => {
        const body = await ctx.req.json()

        const em = ctx.get("em");
        const result =  em.create(Tournament,body)
        await em.persistAndFlush(result);

        return ctx.text("Tournament created", 201);
    })
    .openapi(TournamentsRoutes.put, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const body = await ctx.req.json()

        const em = ctx.get("em");
        const result = await em.findOne(Tournament, { id })
        if (result == null) {
            return ctx.text("Not found", 404);
        }
        result.name = body.name ?? result.name
        result.rank = body.rank ??  result.rank
        result.city = body.city ?? result.city

        await em.flush();

        return ctx.text("Tournament updated", 201);
    })
    .openapi(TournamentsRoutes.list, async (ctx) => {


        const em = ctx.get("em");
        const result = await em.findAll(Tournament);
        return ctx.json(
            result
        , 200)
    })
}

