import type { Query } from "@mikro-orm/migrations";
import { getApp } from "../../api/get-app.ts";
import { Category } from "../../entities/Category.entity.ts";
import { Competitor } from "../../entities/Competitor.entity.ts";
import { CompetitorsRoutes } from "./competitors.openapi.ts";
import type { FilterQuery } from "@mikro-orm/core";

export function buildCompetitorsRouter() {
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
            const result = em.create(Competitor, body)

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
            result.rank = body.rank ?? result.rank
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
            em.nativeDelete(Competitor, { id })

            return ctx.text("Competitor Deleted", 202)
        })
        .openapi(CompetitorsRoutes.getByCategory, async (ctx) => {
            const { id } = ctx.req.valid('param')
            const em = ctx.get("em")
            const category = await em.findOne(Category, { id }, { populate: ['weight_category', 'age_group'] })

            if (category == null) {
                return ctx.text("Category not found", 404);
            }

            let query: FilterQuery<Competitor> = {
                rank: { $in: category.rank }
            }

            if (category.gender) {
                query = {
                    ...query,
                    gender: category.gender
                }

            }
            if (category.weight_category) {
                query = {
                    ...query,
                    weight: { $gte: category.weight_category.weight_min, $lte: category.weight_category.weight_max }
                }
            }

            if (category.age_group) {
                let dateAgeMin = new Date()
                let dateAgeMax = new Date()
                dateAgeMin.setFullYear(dateAgeMin.getFullYear() - category.age_group.age_min)
                dateAgeMax.setFullYear(dateAgeMax.getFullYear() - category.age_group.age_max)
                query = {
                    ...query,
                    birthday: { $lte: dateAgeMin, $gte: dateAgeMax }
                }
            }



            const competitors = await em.find(Competitor, query)

            return ctx.json(competitors, 200)
        })
        .openapi(CompetitorsRoutes.getAll, async (ctx) => {
            const em = ctx.get("em")
            const competitors = await em.find(Competitor, {}, { populate: ['rank'] })
            return ctx.json(competitors, 200)
        })
}