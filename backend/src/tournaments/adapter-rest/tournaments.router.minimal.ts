import type { Context } from "hono";
import { getApp } from "../../api/get-app.ts";
import { Tournament } from "../../entities/Tournament.entity.ts";
import { Category } from "../../entities/Category.entity.ts";
import { TournamentsRoutes } from "./tournaments.openapi.minimal.ts";

export function buildTournamentsRouter() {
    const router = getApp()

    return router.openapi(TournamentsRoutes.get, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const em = ctx.get("em");
        const result = await em.findOne(Tournament, { id }, { populate: ['competitors'] })
        if (result == null) {
            return ctx.text("Not found", 404);
        }
        return ctx.json(result, 200)
    })

    .openapi(TournamentsRoutes.post, async (ctx) => {
        const body = ctx.req.valid("json")
        const em = ctx.get("em");
        const result = em.create(Tournament, {
            name: body.name,
            city: body.city || "",
            start_date: body.start_date,
            end_date: body.end_date || body.start_date
        })
        await em.persistAndFlush(result);
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
        result.city = body.city ?? result.city
        result.start_date = body.start_date ?? result.start_date
        result.end_date = body.end_date ?? result.end_date

        await em.flush();
        return ctx.text("Tournament updated", 201);
    })

    .openapi(TournamentsRoutes.list, async (ctx) => {
        const query = ctx.req.valid('query')
        const em = ctx.get("em");
        const result = await em.find(Tournament, query);
        return ctx.json(result, 200)
    })

    .openapi(TournamentsRoutes.delete, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const em = ctx.get("em");
        const result = await em.findOne(Tournament, { id })
        if (result == null) {
            return ctx.text("Not found", 404);
        }

        // Supprimer le tournoi
        await em.nativeDelete(Tournament, { id });
        
        return ctx.text("Tournament Deleted", 202)
    })

    .openapi(TournamentsRoutes.createCategory, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const body = ctx.req.valid('json')
        const em = ctx.get("em");
        const tournament = await em.findOne(Tournament, { id })
        if (tournament == null) {
            return ctx.text("Not found", 404);
        }
        const result = em.create(Category, { ...body, tournament: id });
        await em.persistAndFlush(result);
        return ctx.text("Category created", 201);
    })

    .openapi(TournamentsRoutes.listCategories, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const em = ctx.get("em");
        const tournament = await em.findOne(Tournament, { id })
        if (tournament == null) {
            return ctx.text("Not found", 404);
        }

        const rawResult = await em.find(Category, { tournament: id }, { populate: ['weight_category', 'age_group'] });
        const result = rawResult.map((category) => {
            return {
                id: category.id,
                name: category.name,
                rank: category.rank,
                gender: category.gender,
                weight_category: category.weight_category?.id,
                elimination_type: category.elimination_type,
                age_group: category.age_group?.id
            }
        })

        return ctx.json(result, 200)
    })
}

// Fonction séparée pour les routes non-OpenAPI
export function buildTournamentsCategoryRouter() {
    const router = getApp()
    return router
}
