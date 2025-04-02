import { resourceLimits } from "worker_threads";
import { getApp } from "../../api/get-app.ts";
import { EnumRank, Tournament } from "../../entities/Tournament.entity.ts";
import { TournamentsRoutes } from "./tournaments.openapi.ts";
import { Filter } from "@mikro-orm/core";

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
            name: result.name,
            rank: result.rank,
            city: result.city,
            start_date: result.start_date,
            end_date: result.end_date

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
        result.start_date = body.start_date ?? result.start_date
        result.end_date = body.end_date ?? result.end_date

        await em.flush();

        return ctx.text("Tournament updated", 201);
    })
    .openapi(TournamentsRoutes.list, async (ctx) => {
        const rank = ctx.req.query('rank')
        console.log(rank)

        const where: any = {};

    if (rank) {
      where.rank = rank;
    }
    

        const em = ctx.get("em");
        const result = await em.find(Tournament,where);
        return ctx.json(
            result
        , 200)
    })
    .openapi(TournamentsRoutes.delete, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const em = ctx.get("em");
        const result = await em.findOne(Tournament, { id })
        
        
        if (result == null) {
            return ctx.text("Not found", 404);
        }
        em.nativeDelete(Tournament,{id})

        return ctx.text("Tournament Deleted", 202)
    })

}

