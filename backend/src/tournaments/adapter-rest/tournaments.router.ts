
import { getApp } from "../../api/get-app.ts";
import { AgeGroup } from "../../entities/age-group.entity.ts";
import { Category } from "../../entities/Category.entity.ts";
import { Competitor } from "../../entities/Competitor.entity.ts";
import { TournamentCompetitorCategory } from "../../entities/tournament-competitor-category.entity.ts";
import { Tournament } from "../../entities/Tournament.entity.ts";
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
            city: result.city,
            start_date: result.start_date,
            end_date: result.end_date

        }, 200)
    })
    .openapi(TournamentsRoutes.post, async (ctx) => {
        const body = ctx.req.valid("json")

        const em = ctx.get("em");
        const result =  em.create(Tournament,{
            ...body
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
        result.city = body.city ?? result.city
        result.start_date = body.start_date ?? result.start_date
        result.end_date = body.end_date ?? result.end_date

        
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
        const { id,competitorId } = ctx.req.valid('param')


        const em = ctx.get("em");
        const tournament = await em.findOne(Tournament, { id },{ populate: ['competitors'] })
        if (tournament == null) {
            return ctx.text("Not found", 404);
        }

        const competitor = await em.findOne(Competitor, { id: competitorId })
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
    .openapi(TournamentsRoutes.createCategory, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const body = ctx.req.valid('json')

        const em = ctx.get("em");
        const tournament = await em.findOne(Tournament, { id },{ populate: ['competitors']} )
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
        const tournament = await em.findOne(Tournament, { id },{ populate: ['competitors']} )
        if (tournament == null) {
            return ctx.text("Not found", 404);
        }

        const rawResult = await em.find(Category, { tournament: id });

        const result = rawResult.map((category) => {
            return {
                id: category.id,
                name: category.name,
                rank: category.rank,
                gender: category.gender,
                weight_category: category.weight_category?.id,
                elimination_type: category.elimination_type,
                age_group: category.age_group?.id
            }})


        return ctx.json(
            result
        , 200)
    })
    .openapi(TournamentsRoutes.assignCompetitors, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const em = ctx.get("em")
        const tournamentCompetitorCategory = await em.find(TournamentCompetitorCategory, {  tournament: id },{ populate: ['competitor'] })
        if (tournamentCompetitorCategory == null) {
            return ctx.text("Not found", 404);
        }
        const categories = await em.find(Category, { tournament: id },{ populate: ['competitors'] })
        if (categories == null) {
            return ctx.text("Not found", 404);
        }

        //console.log(categories)
        
        for (const competitor of tournamentCompetitorCategory) { 
            if (competitor.category == null) {
                for (const category of categories) {
                    console.log(category.rank,competitor.competitor.rank)
                    console.log(category.gender,competitor.competitor.gender)
                    if (category.rank.includes(competitor.competitor.rank)){
                        if (category.gender == competitor.competitor.gender || category.gender == null) {
                            if ((category.weight_category == null) || (competitor.competitor.weight != null && category.weight_category.weight_min <= competitor.competitor.weight && category.weight_category.weight_max >= competitor.competitor.weight)) {
                                console.log("Competitor assigned to category")
                                competitor.category = category
                            }
                            

                        } 
                    } 
                }
            }

        }

        await em.persistAndFlush(tournamentCompetitorCategory)
            
            

        return ctx.text("Competitors assigned to categories", 200)
    })
    .openapi(TournamentsRoutes.assignCompetitor, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const { categoryId } = ctx.req.valid('param')
        const body = ctx.req.valid('json')
        const em = ctx.get("em")
        const tournamentCompetitorCategory = await em.findOne(TournamentCompetitorCategory, {  tournament: id, competitor: body.competitor_id },{ populate: ['competitor'] })
        if (tournamentCompetitorCategory == null) {
            return ctx.text("Not found", 404);
        }
        const category = await em.findOne(Category, { id: categoryId })
        if (category == null) {
            return ctx.text("Category not found", 404);
        }
        tournamentCompetitorCategory.category = category;
        await em.persistAndFlush(tournamentCompetitorCategory)
        return ctx.text("Competitor assigned to category", 200)
    })
    .openapi(TournamentsRoutes.getCategories, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const em = ctx.get("em")
        const rawResult = await em.find(Category, { tournament: id },{ populate: ['competitors'] })
        if (rawResult == null) {
            return ctx.text("Not found", 404);
        }
        const result = rawResult.map((category) => {
            return {
                id: category.id,
                name: category.name,
                rank: category.rank,
                gender: category.gender,
                weight_category: category.weight_category?.id,
                elimination_type: category.elimination_type,
                age_group: category.age_group?.id
            }})
        return ctx.json(result, 200)
    })
    .openapi(TournamentsRoutes.deleteCategory, async (ctx) => {
        const { categoryId } = ctx.req.valid('param')
        const em = ctx.get("em")
        const category = await em.findOne(Category, { id: categoryId })
        if (category == null) {
            return ctx.text("Category not found", 404);
        }
        em.nativeDelete(Category,{id: categoryId})
        return ctx.text("Category deleted", 202)
    })
    .openapi(TournamentsRoutes.getCategoryCompetitors, async (ctx) => {
        const { categoryId } = ctx.req.valid('param')
        const em = ctx.get("em")
        const category = await em.findOne(Category, { id: categoryId },{ populate: ['competitors'] })
        if (category == null) {
            return ctx.text("Category not found", 404);
        }

        const rawResult = await em.find(TournamentCompetitorCategory, { category: categoryId },{ populate: ['competitor'] })
        if (rawResult == null) {
            return ctx.text("No competitor in this category", 404);
        }
        const result = rawResult.map((competitor) => {
            return {
                id: competitor.competitor.id,
                firstname: competitor.competitor.firstname,
                lastname: competitor.competitor.lastname,
                gender: competitor.competitor.gender,
                birthday: competitor.competitor.birthday,
                club: competitor.competitor.club,
                country: competitor.competitor.country,
                weight: competitor.competitor.weight,
                rank: competitor.competitor.rank,
            }})
        return ctx.json(result, 200)
        

    })
        







        
}

