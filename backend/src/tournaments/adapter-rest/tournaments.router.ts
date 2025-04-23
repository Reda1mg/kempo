
import { getApp } from "../../api/get-app.ts";
import { AgeGroup } from "../../entities/age-group.entity.ts";
import { Competitor } from "../../entities/competitor.entity.ts";
import { Tournament } from "../../entities/tournament.entity.ts";
import { TournamentsRoutes } from "./tournaments.openapi.ts";


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
        const body = ctx.req.valid("json")

        const em = ctx.get("em");
        const result =  em.create(Tournament,{
            ...body,
            age_group: body.age_group_id
        })

        const oui = await em.persistAndFlush(result);


        return ctx.text("Tournament created", 201);
    })
    .openapi(TournamentsRoutes.put, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const body = ctx.req.valid('json');

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

        if  ( body.age_group_id){
            const age_group = await em.findOne(AgeGroup, {id : body.age_group_id})
            result.age_group = age_group ?? result.age_group
        }
        

        

        await em.flush();

        return ctx.text("Tournament updated", 201);
    })
    .openapi(TournamentsRoutes.list, async (ctx) => {
        const query = ctx.req.valid('query')

        const em = ctx.get("em");
        const result = await em.find(Tournament,query);
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
    .openapi(TournamentsRoutes.addCompetitor, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const body = ctx.req.valid('json')

        const em = ctx.get("em");
        const tournament = await em.findOne(Tournament, { id })
        if (tournament == null) {
            return ctx.text("Not found", 404);
        }

        const competitor = await em.findOne(Competitor, { id: body.competitor_id })
        if (competitor == null) {
            return ctx.text("Competitor not found", 404);
        }
        

        if (tournament.competitors.contains(competitor)) {
            return ctx.text("Competitor already in tournament", 409);
        }
        
        tournament.competitors.add(competitor)
        
        await em.flush()

        return ctx.text("Competitor added to tournament", 201)
    })
    .openapi(TournamentsRoutes.deleteCompetitor, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const body = ctx.req.valid('json')

        const em = ctx.get("em");
        const tournament = await em.findOne(Tournament, { id },{ populate: ['competitors'] })
        if (tournament == null) {
            return ctx.text("Not found", 404);
        }

        const competitor = await em.findOne(Competitor, { id: body.competitor_id })
        if (competitor == null) {
            return ctx.text("Competitor not found", 404);
        }
        

        if (!tournament.competitors.contains(competitor)) {
            return ctx.text("Competitor not in tournament", 409);
        }
        
        tournament.competitors.remove(competitor)
        
        await em.flush()

        return ctx.text("Competitor removed from tournament", 202)
    })
    .openapi(TournamentsRoutes.getCompetitors, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const em = ctx.get("em");
        const tournament = await em.findOne(Tournament, { id },{ populate: ['competitors'] })
        if (tournament == null) {
            return ctx.text("Not found", 404);
        }

        return ctx.json(
            tournament.competitors
        , 200)
    })
        
        
}

