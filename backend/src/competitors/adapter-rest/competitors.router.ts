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
                    sexe: result.sexe
        
                }, 200)

    })
    .openapi(CompetitorsRoutes.post, async (ctx) => {
            const body = ctx.req.valid("json")
    
            const em = ctx.get("em");
            const result =  em.create(Competitor,body)
    
            const oui = await em.persistAndFlush(result);
    
    
            return ctx.text("Competitor created", 201);
        })
    
}