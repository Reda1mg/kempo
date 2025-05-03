import { getApp } from "../../api/get-app.ts";
import { Competitor } from "../../entities/Competitor.entity.ts";
import { CompetitorsRoutes } from "./competitors.openapi.ts";

export function buildCompetitorsRouter(){
    const router = getApp()

    return router.openapi(CompetitorsRoutes.get, async (ctx) => {

        const { id } = ctx.req.valid('param')
                const em = ctx.get("em");
                const result = await em.findOne(Competitor, { id })
                if (result == null) {
                    return ctx.text("Not found", 404);
                }
        
                return ctx.json({
                    id: result.id,
                    firstname: result.firstname,
                    lastname: result.lastname,
                    birthday: result.birthday,
                    club: result.club,
                    country: result.country,
                    weight: result.weight,
                    rank: result.rank,
                    gender: result.gender
        
                }, 200)

    })
    .openapi(CompetitorsRoutes.post, async (ctx) => {
            const body = ctx.req.valid("json")
    
            const em = ctx.get("em");
            const result =  em.create(Competitor,body)
    
            const oui = await em.persistAndFlush(result);
    
    
            return ctx.text("Competitor created", 201);
        })
    .openapi(CompetitorsRoutes.put, async (ctx) => {
            const { id } = ctx.req.valid('param')
            const body = ctx.req.valid('json');
    
            const em = ctx.get("em");
            const result = await em.findOne(Competitor, { id })
            if (result == null) {
                return ctx.text("Not found", 404);
            }
    
            result.firstname = body.firstname ?? result.firstname
            result.lastname = body.lastname ?? result.lastname
            result.birthday = body.birthday ?? result.birthday
            result.club = body.club ?? result.club
            result.country = body.country ?? result.country
            result.weight = body.weight ?? result.weight
            result.rank = body.rank ??  result.rank
            result.gender = body.gender ?? result.gender
    
            
    
            await em.flush();
    
            return ctx.text("Tournament updated", 201);
        })
    .openapi(CompetitorsRoutes.delete, async (ctx) => {
            const { id } = ctx.req.valid('param')
            const em = ctx.get("em")
            const result = await em.findOne(Competitor, { id })
            
            
            if (result == null) {
                return ctx.text("Not found", 404);
            }
            em.nativeDelete(Competitor,{id})
    
            return ctx.text("Competitor Deleted", 202)
        })
}