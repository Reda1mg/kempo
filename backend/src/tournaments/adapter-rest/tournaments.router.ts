import type { Context } from "hono";
import { getApp } from "../../api/get-app.ts";
import { AgeGroup } from "../../entities/age-group.entity.ts";
import { Category, EnumEliminationType } from "../../entities/Category.entity.ts";
import { Competitor } from "../../entities/Competitor.entity.ts";
import { Match } from "../../entities/match.entity.ts";
import { TournamentCompetitorCategory } from "../../entities/tournament-competitor-category.entity.ts";
import { Tournament } from "../../entities/Tournament.entity.ts";
import { TournamentsRoutes } from "./tournaments.openapi.ts";
import { CompetitorSchema } from "../../competitors/adapter-rest/competitors.schema.ts";
import type { Bracket } from "../../matches/adapter-rest/matches.schema.ts";
import { WeightCategory } from "../../entities/weight-category.ts";


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
            const result = em.create(Tournament, {
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
            const result = await em.find(Tournament, query);
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
            em.nativeDelete(Tournament, { id })

            return ctx.text("Tournament Deleted", 202)
        })
        .openapi(TournamentsRoutes.addCompetitor, async (ctx) => {
            const { id, competitorId } = ctx.req.valid('param')



            const em = ctx.get("em");
            const tournament = await em.findOne(Tournament, { id }, { populate: ['competitors'] })
            if (tournament == null) {

                return ctx.text("Tournament not found", 404);
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
            const { id,idCompetitor } = ctx.req.valid('param')


            const em = ctx.get("em");
            const tournament = await em.findOne(Tournament, { id }, { populate: ['competitors'] })
            if (tournament == null) {
                return ctx.text("Not found", 404);
            }

            const competitor = await em.findOne(Competitor, { id: idCompetitor })
            if (competitor == null) {
                return ctx.text("Competitor not found", 404);
            }

            const tournamentCompetitor = await em.findOne(TournamentCompetitorCategory, { tournament: id, competitor: idCompetitor })
            if (tournamentCompetitor == null) {
                return ctx.text("Competitor not in tournament", 404);
            }

            if (tournamentCompetitor.category != null) {
                return ctx.text("Competitor already assigned to category", 409);
            }

             em.nativeDelete(TournamentCompetitorCategory, { tournament: id, competitor: idCompetitor })

            return ctx.text("Competitor removed from tournament", 202)
        })
        .openapi(TournamentsRoutes.getCompetitors, async (ctx) => {
            const { id } = ctx.req.valid('param')
            const em = ctx.get("em");
            const tournament = await em.findOne(Tournament, { id }, { populate: ['competitors'] })
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
            const tournament = await em.findOne(Tournament, { id }, { populate: ['competitors'] })
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
            const tournament = await em.findOne(Tournament, { id }, { populate: ['competitors'] })
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
                }
            })


            return ctx.json(
                result
                , 200)
        })
        .openapi(TournamentsRoutes.assignCompetitors, async (ctx) => {
            const { id } = ctx.req.valid('param')
            const em = ctx.get("em")
            const tournamentCompetitorCategory = await em.find(TournamentCompetitorCategory, { tournament: id }, { populate: ['competitor'] })
            if (tournamentCompetitorCategory == null) {
                return ctx.text("Not found", 404);
            }
            const categories = await em.find(Category, { tournament: id }, { populate: ['competitors'] })
            if (categories == null) {
                return ctx.text("Not found", 404);
            }

            //console.log(categories)

            for (const competitor of tournamentCompetitorCategory) {
                if (competitor.category == null) {
                    for (const category of categories) {
                        console.log(category.rank, competitor.competitor.rank)
                        console.log(category.gender, competitor.competitor.gender)
                        if (category.rank.includes(competitor.competitor.rank)) {
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
            const tournamentCompetitorCategory = await em.findOne(TournamentCompetitorCategory, { tournament: id, competitor: body.competitor_id }, { populate: ['competitor'] })
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
            const rawResult = await em.find(Category, { tournament: id }, { populate: ['competitors'] })
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
                }
            })
            return ctx.json(result, 200)
        })
        .openapi(TournamentsRoutes.deleteCategory, async (ctx) => {
            const { id } = ctx.req.valid('param')
            const em = ctx.get("em")
            const category = await em.findOne(Category, { id }, { populate: ['weight_category', 'age_group'] })
            if (category == null) {
                return ctx.text("Category not found", 404);
            }
            em.nativeDelete(Category, { id })
            return ctx.text("Category deleted", 202)
        })
        .openapi(TournamentsRoutes.modifyCategory, async (ctx) => {
            const { id } = ctx.req.valid('param')
            const body = ctx.req.valid('json')
            const em = ctx.get("em")
            const category = await em.findOne(Category, { id })
            if (category == null) {
                return ctx.text("Category not found", 404);
            }
            category.name = body.name ?? category.name
            category.rank = body.rank ?? category.rank
            category.gender = body.gender ?? category.gender
            category.elimination_type = body.elimination_type ?? category.elimination_type

            if (body.weight_category != null) {
                const weightCategory = await em.findOne(WeightCategory, { id: body.weight_category })
                if (weightCategory == null) {
                    return ctx.text("Weight category not found", 404);
                }
                category.weight_category = weightCategory
            }
            if (body.age_group != null) {
                const ageGroup = await em.findOne(AgeGroup, { id: body.age_group })
                if (ageGroup == null) {
                    return ctx.text("Age group not found", 404);
                }
                category.age_group = ageGroup
            }

            await em.persistAndFlush(category)
            
            return ctx.text("Category updated", 201);
        })

        .openapi(TournamentsRoutes.getCategoryCompetitors, async (ctx) => {
            const { categoryId } = ctx.req.valid('param')
            const em = ctx.get("em")
            const category = await em.findOne(Category, { id: categoryId }, { populate: ['competitors'] })
            if (category == null) {
                return ctx.text("Category not found", 404);
            }

            const rawResult = await em.find(TournamentCompetitorCategory, { category: categoryId }, { populate: ['competitor'] })
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
                }
            })
            return ctx.json(result, 200)


        })
        .openapi(TournamentsRoutes.startTournament, async (ctx) => {
            const { id } = ctx.req.valid('param')
            const em = ctx.get("em")
            const tournament = await em.findOne(Tournament, { id }, { populate: ['competitors'] })
            if (tournament == null) {
                return ctx.text("Not found", 404);
            }

            const tournamentCompetitor = await em.find(TournamentCompetitorCategory, { tournament: id }, { populate: ['competitor'] })
            if (tournamentCompetitor == null) {
                return ctx.text("No competitor in this tournament", 404);
            }
            for (const competitor of tournamentCompetitor) {
                if (competitor.category == null) {
                    return ctx.text("Competitor not assigned to category", 404);
                }
            }

            const categories = await em.find(Category, { tournament: id }, { populate: ['competitors'] })
            if (categories == null) {
                return ctx.text("No category in this tournament", 404);
            }


            for (const category of categories) {
                const competitors = await em.find(TournamentCompetitorCategory, { category: category.id }, { populate: ['competitor'] })
                if (category.elimination_type == EnumEliminationType.POOL) {
                    switch (competitors.length) {
                        case 2:
                            return ctx.text("Not enough competitors in this category", 404);
                            break;
                        case 3:  //1 Pool of 3 competitors
                        case 4:  //1 Pool of 4 competitors
                        case 5:  //1 Pool of 5 competitors
                        case 6:  //1 Pool of 6 competitors
                            createPoolMatches(competitors.map(tc => tc.competitor), category, ctx)
                            break;
                        case 7:  //2 Pool of 4-3 competitors
                        case 8:  //2 Pool of 4 competitors
                        case 9:  //2 Pool of 4-5 competitors
                            createPoolMatches(competitors.slice(0, 4).map(tc => tc.competitor), category, ctx, "1")
                            createPoolMatches(competitors.slice(4).map(tc => tc.competitor), category, ctx, "2")
                            break;

                        case 10: //2 Pool of 5 competitors
                            createPoolMatches(competitors.slice(0, 5).map(tc => tc.competitor), category, ctx, "1")
                            createPoolMatches(competitors.slice(5).map(tc => tc.competitor), category, ctx, "2")
                            break;
                        case 11: //3 Pool of 4-4-3 competitors
                            createPoolMatches(competitors.slice(0, 4).map(tc => tc.competitor), category, ctx, "1")
                            createPoolMatches(competitors.slice(4, 8).map(tc => tc.competitor), category, ctx, "2")
                            createPoolMatches(competitors.slice(8).map(tc => tc.competitor), category, ctx, "3")
                            break;
                        case 12: //4 Pool of 3 competitors    
                            createPoolMatches(competitors.slice(0, 3).map(tc => tc.competitor), category, ctx, "1")
                            createPoolMatches(competitors.slice(3, 6).map(tc => tc.competitor), category, ctx, "2")
                            createPoolMatches(competitors.slice(6, 9).map(tc => tc.competitor), category, ctx, "3")
                            createPoolMatches(competitors.slice(9).map(tc => tc.competitor), category, ctx, "4")
                            break;
                        default:
                            return ctx.text("Too many competitors in this category", 404);
                    }
                } else if (category.elimination_type == EnumEliminationType.DIRECT) {
                    createFullBracket(competitors.map(tc => tc.competitor), category, ctx);
                }

            }
            return ctx.text("Tournament started", 200)

        })
        .openapi(TournamentsRoutes.startRankingPool, async (ctx) => {
            const { id } = ctx.req.valid('param')
            const em = ctx.get("em")
            const category = await em.findOne(Category, { id }, { populate: ['competitors'] })
            if (category == null) {
                return ctx.text("Not found", 404);
            }
            const matches = await em.find(Match, { category: id }, { populate: ['competitor1', 'competitor2'] })

            matches.forEach((match) => {
                if (!match.isFinished) {
                    return ctx.text("Not all matches are finished", 404);
                }
            })

            const competitors = await em.find(TournamentCompetitorCategory, { category: id }, { populate: ['competitor'] })
            if (competitors == null) {
                return ctx.text("No competitor in this category", 404);
            }

            let competitorsResult = competitors.map(tc => ({
                ...(tc.competitor as Competitor & { score: number; pool_number: string })
            }));

            for (const competitor of competitorsResult) {
                
                
                competitor.score = 0
                
                for (const match of matches) {
                    
                    if (match.winner != null) {
                        if (match.winner.id == competitor.id ) {
                            competitor.score += 2
                            competitor.pool_number = match.pool_number   
                        }else if (match.competitor1.id == competitor.id || match.competitor2.id ==competitor.id) {
                            competitor.pool_number = match.pool_number
                        }
                        
                    }else if (match.competitor1.id == competitor.id || match.competitor2.id == competitor.id) {
                        competitor.score += 1
                        competitor.pool_number = match.pool_number

                    }
                }
            }
            competitorsResult.sort((a, b) => {
                if (a.score > b.score) return -1
                if (a.score < b.score) return 1
                return 0
            })

           
    
            const competitorsResultFiltered1 = competitorsResult.filter((competitor) => {
                return competitor.pool_number == "1"
            })
            const competitorsResultFiltered2 = competitorsResult.filter((competitor) => {
                return competitor.pool_number == "2"
            })
            const competitorsResultFiltered3 = competitorsResult.filter((competitor) => {
                return competitor.pool_number == "3"
            })
            const competitorsResultFiltered4 = competitorsResult.filter((competitor) => {
                return competitor.pool_number == "4"
            })
        
            if (competitorsResultFiltered1.length != 0) {
                return ctx.text("No ranking pool needing", 404)
            }

            if (competitorsResultFiltered4.length != 0) {
                const comptop : Competitor[] = []
                comptop.push(competitorsResultFiltered4[0])
                comptop.push(competitorsResultFiltered3[0])
                comptop.push(competitorsResultFiltered2[0])
                comptop.push(competitorsResultFiltered1[0])

                createPoolMatches(comptop, category, ctx, "0-1")

            }else if (competitorsResultFiltered3.length != 0) {
                const comptop : Competitor[] = []
                comptop.push(competitorsResultFiltered3[0])
                comptop.push(competitorsResultFiltered2[0])
                comptop.push(competitorsResultFiltered1[0])

                createPoolMatches(comptop, category, ctx, "0-1")

            }else if (competitorsResultFiltered2.length != 0) {
                const  match1 = em.create(Match, {
                    competitor1: competitorsResultFiltered1[0],
                    competitor2: competitorsResultFiltered1[1],
                    category: category.id,
                    pool_number: "0-1"
                })

                await em.persistAndFlush(match1);

                const match2 = em.create(Match, {
                    competitor1: competitorsResultFiltered1[2],
                    competitor2: competitorsResultFiltered1[3],
                    category: category.id,
                    pool_number: "0-3"
                })

                await em.persistAndFlush(match2);
            }



           console.log(competitorsResultFiltered2)
           return ctx.text("Ranking pool created", 200)
        })
        .openapi(TournamentsRoutes.notfinishedMatches, async (ctx) => {
            const { id } = ctx.req.valid('param')
            const em = ctx.get("em")
            const category = await em.findOne(Category, { id }, { populate: ['competitors'] })
            if (category == null) {
                return ctx.text("Not found", 404);
            }
            const matches = await em.find(Match, { category: id, isFinished: false }, { populate: ['competitor1', 'competitor2'] })

            if (matches == null) {
                return ctx.text("All matches are finished", 404);
            }

            return ctx.json(matches.map((match) => {
                return {
                    id: match.id,
                    competitor1: match.competitor1.id,
                    competitor2: match.competitor2.id,
                    score1: match.score1,
                    score2: match.score2,
                    category: match.category.id,
                    keikuka1: match.keikuka1,
                    keikuka2: match.keikuka2,
                    winner: match.winner?.id ?? null,
                    isFinished: match.isFinished,
                    pool_number: match.pool_number
                }
            }), 200)
        })
        .openapi(TournamentsRoutes.getMatch, async (ctx) => {
            const { id } = ctx.req.valid('param')
            const em = ctx.get("em")
            const match = await em.findOne(Match, { id }, { populate: ['competitor1', 'competitor2'] })
            if (match == null) {
                return ctx.text("Not found", 404);
            }

            return ctx.json({
                id: match.id,
                competitor1: match.competitor1?.id ?? null,
                competitor2: match.competitor2?.id ?? null,
                score1: match.score1, 
                score2: match.score2,
                category: match.category.id,
                keikuka1: match.keikuka1,
                keikuka2: match.keikuka2,
                winner: match.winner?.id ?? null,
                isFinished: match.isFinished,
                pool_number: match.pool_number
            }, 200)
        })
        .openapi(TournamentsRoutes.getMatches, async (ctx) => {
            const { id } = ctx.req.valid('param')
            const em = ctx.get("em")
            const category = await em.findOne(Category, { id }, { populate: ['competitors'] })
            if (category == null) {
                return ctx.text("Not found", 404);
            }
            const matches = await em.find(Match, { category: id }, { populate: ['competitor1', 'competitor2'] })

            if (matches == null) {
                return ctx.text("No matches in this category", 404);
            }

            return ctx.json(matches.map((match) => {
                return {
                    id: match.id,
                    competitor1: match.competitor1?.id ?? null,
                    competitor2: match.competitor2?.id ?? null,
                    score1: match.score1,
                    score2: match.score2,
                    category: match.category.id,
                    keikuka1: match.keikuka1,
                    keikuka2: match.keikuka2,
                    winner: match.winner?.id ?? null,
                    isFinished: match.isFinished,
                    pool_number: match.pool_number
                }
            }), 200)

        })
        .openapi(TournamentsRoutes.getCategoryResults, async (ctx) => {
            const { id } = ctx.req.valid('param')
            const em = ctx.get("em")
            const category = await em.findOne(Category, { id }, { populate: ['competitors'] })
            if (category == null) {
                return ctx.text("Not found", 404);
            }

            const matches = await em.find(Match, { category: id, pool_number: ["0","0-1","0-3"] }, { populate: ['competitor1', 'competitor2'] })

            matches.forEach((match) => {
                if (!match.isFinished) {
                    return ctx.text("Not all matches are finished", 404);
                }
            })

            const competitors = await em.find(TournamentCompetitorCategory, { category: id }, { populate: ['competitor'] })
            if (competitors == null) {
                return ctx.text("No competitor in this category", 404);
            }

            if (category.elimination_type == EnumEliminationType.POOL ){
                let competitorsResult = competitors.map(tc => ({
                    ...(tc.competitor as Competitor & { score: number; pool_number: string })
                }));
    
                for (const competitor of competitorsResult) {
                    
                    
                    competitor.score = 0
                    
                    for (const match of matches) {
                        
                        if (match.winner != null) {
                            if (match.winner.id == competitor.id ) {
                                competitor.score += 2
                                competitor.pool_number = match.pool_number   
                            }else if (match.competitor1.id == competitor.id || match.competitor2.id ==competitor.id) {
                                competitor.pool_number = match.pool_number
                            }
                            
                        }else if (match.competitor1.id == competitor.id || match.competitor2.id == competitor.id) {
                            competitor.score += 1
                            competitor.pool_number = match.pool_number
    
                        }
                    }
                }
                competitorsResult.sort((a, b) => {
                    if (a.score > b.score) return -1
                    if (a.score < b.score) return 1
                    return 0
                })
    
               
        
                const competitorsResultFiltered03 = competitorsResult.filter((competitor) => {
                    return competitor.pool_number == "0-3"
                })
                const competitorsResultFiltered01 = competitorsResult.filter((competitor) => {
                    return competitor.pool_number == "0-1"
                })
                const competitorsResultFiltered0 = competitorsResult.filter((competitor) => {
                    return competitor.pool_number == "0"
                })
    
    
                const comptop : Competitor[] = []
                if (competitorsResultFiltered03.length != 0) {
                    
                    comptop.push(competitorsResultFiltered01[0])
                    comptop.push(competitorsResultFiltered01[1])
                    comptop.push(competitorsResultFiltered03[0])
    
    
                }else if (competitorsResultFiltered01.length != 0) {
    
                    comptop.push(competitorsResultFiltered01[0])
                    comptop.push(competitorsResultFiltered01[1])
                    comptop.push(competitorsResultFiltered01[2])
                }else if (competitorsResultFiltered0.length != 0) {
                    comptop.push(competitorsResultFiltered0[0])
                    comptop.push(competitorsResultFiltered0[1])
                    comptop.push(competitorsResultFiltered0[2])
                }
    
    
                const ranking = {
                    first: comptop[0].id,
                    second: comptop[1].id,
                    third: comptop[2].id,
                }
                
                return ctx.json(ranking, 200)
            }else  {
                return ctx.text("No ranking in this category", 404)
            }


            return ctx.text("No matches in this category", 404);
            
            

        })
        .openapi(TournamentsRoutes.getBracket, async (ctx) => {
            const { id } = ctx.req.valid('param');
            const em = ctx.get("em");

            
            const matches = await em.find(Match, { category: id }, { populate: ['competitor1', 'competitor2', 'next_match'] });
            if (matches.length === 0) {
                return ctx.text("No matches in this category", 404);
            }

            // Organize matches by rounds
            const bracket: Bracket = {};
            matches.forEach(match => {
                const round = match.pool_number;
                
                const roundKey = `round-${round[round.length-1]}` as keyof Bracket;
                if (!bracket[roundKey]) {
                    bracket[roundKey] = [];
                }
                bracket[roundKey].push({
                    id: match.id,
                    competitor1: match.competitor1?.id ?? null,
                    competitor2: match.competitor2?.id ?? null,
                    winner: match.winner?.id ?? null,
                    isFinished: match.isFinished,
                    next_match: match.next_match ? match.next_match.id : null
                });
            });

            return ctx.json(bracket, 200);
        });
}








            



    function createPoolMatches(competitors: Competitor[], category: Category, ctx: Context, poolNumber = "0") {
                    const em = ctx.get("em")
                    const matches: Match[] = []

                    for (let i = 0; i < competitors.length; i++) {
                        for (let j = i + 1; j < competitors.length; j++) {
                            const match = em.create(Match, {
                                competitor1: competitors[i],
                                competitor2: competitors[j],
                                category: category.id,
                                pool_number: poolNumber
                            })
                            matches.push(match)
                        }
                    }

                    em.persistAndFlush(matches)

                }

    function createFullBracket(competitors: Array<Competitor | null>, category: Category, ctx: Context) {
        const em = ctx.get("em");
        const matches: Match[] = [];
        const totalRounds = Math.ceil(Math.log2(competitors.length)); // Calculate total rounds needed
        const bracketSize = Math.pow(2, totalRounds); // Ensure bracket size is a power of 2
        const paddedCompetitors = [...competitors];

        // Add null competitors for byes to fill the bracket
        while (paddedCompetitors.length < bracketSize) {
            paddedCompetitors.push(null);
        }

        // Generate matches for the first round
        const firstRoundMatches: Match[] = [];
        for (let i = 0; i < paddedCompetitors.length; i += 2) {
            const competitor1 = paddedCompetitors[i];
            const competitor2 = paddedCompetitors[i + 1] || null;

            const match = em.create(Match, {
                competitor1,
                competitor2,
                category: category.id,
                pool_number: `round-1`,
                isFinished: competitor2 === null, // Automatically finish matches with a bye
                winner: competitor2 === null ? competitor1 : null, // Automatically set winner for bye matches
                next_match: null // Placeholder for the next match
            });

            matches.push(match);
            firstRoundMatches.push(match);
        }

        // Generate matches for subsequent rounds
        let previousRoundMatches = firstRoundMatches;
        for (let round = 2; round <= totalRounds; round++) {
            const currentRoundMatches: Match[] = [];
            for (let i = 0; i < previousRoundMatches.length; i += 2) {
                const match = em.create(Match, {
                    competitor1: null, // Placeholder for winner of previous match
                    competitor2: null, // Placeholder for winner of previous match
                    category: category.id,
                    pool_number: `round-${round}`,
                    isFinished: false,
                    winner: null,
                    next_match: null // Placeholder for the next match
                });

                matches.push(match);
                currentRoundMatches.push(match);

                // Link previous round matches to this match
                if (previousRoundMatches[i]) {
                    previousRoundMatches[i].next_match = match;
                    if (previousRoundMatches[i].winner) {
                        match.competitor1 = previousRoundMatches[i].winner; // Directly associate the winner
                    }
                }
                if (previousRoundMatches[i + 1]) {
                    previousRoundMatches[i + 1].next_match = match;
                    if (previousRoundMatches[i + 1].winner) {
                        match.competitor2 = previousRoundMatches[i + 1].winner; // Directly associate the winner
                    }
                }
            }
            previousRoundMatches = currentRoundMatches;
        }

        em.persistAndFlush(matches);
    }



