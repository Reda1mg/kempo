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
            const result = em.create(Competitor, {
                ...body,
                club: body.club ?? null,
                weight: body.weight ?? null
            })

            await em.persistAndFlush(result);

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
        .openapi(CompetitorsRoutes.postBulk, async (ctx) => {
            const body = ctx.req.valid("json")
            const em = ctx.get("em");
            
            const results = { 
                success: 0, 
                errors: 0, 
                errorDetails: [] as Array<{ competitor: string; error: string }> 
            };
            
            try {
                console.log(`Processing ${body.length} competitors...`);
                
                // Traiter par batch pour éviter les timeouts
                const batchSize = 10;
                for (let i = 0; i < body.length; i += batchSize) {
                    const batch = body.slice(i, i + batchSize);
                    
                    for (const competitorData of batch) {
                        try {
                            const competitor = em.create(Competitor, competitorData);
                            em.persist(competitor);
                            results.success++;
                        } catch (error) {
                            results.errors++;
                            results.errorDetails.push({
                                competitor: `${competitorData.firstname} ${competitorData.lastname}`,
                                error: error instanceof Error ? error.message : String(error)
                            });
                        }
                    }
                    
                    // Flush par batch
                    try {
                        await em.flush();
                    } catch (error) {
                        console.error('Batch flush error:', error);
                        // En cas d'erreur de flush, on continue avec le batch suivant
                    }
                }
                
                console.log(`Import completed: ${results.success} success, ${results.errors} errors`);
                
            } catch (error) {
                console.error('Bulk import error:', error);
                results.errors++;
                results.errorDetails.push({
                    competitor: 'Bulk import',
                    error: error instanceof Error ? error.message : String(error)
                });
            }
            
            return ctx.json(results, 201);
        })

}