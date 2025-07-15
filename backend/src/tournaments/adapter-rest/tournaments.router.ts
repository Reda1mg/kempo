import type { Context } from "hono";
import { getApp } from "../../api/get-app.ts";
import { AgeGroup } from "../../entities/age-group.entity.ts";
import { Category, EnumEliminationType } from "../../entities/Category.entity.ts";
import { Competitor } from "../../entities/Competitor.entity.ts";
import { Match } from "../../entities/match.entity.ts";
import { TournamentCompetitorCategory } from "../../entities/tournament-competitor-category.entity.ts";
import { Tournament } from "../../entities/Tournament.entity.ts";
import { TournamentsRoutes } from "./tournaments.openapi.ts";
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
            ...body,
            city: body.city ?? null,
            end_date: body.end_date ?? null
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
        const em = ctx.get("em");
        const result = await em.find(Tournament, {});
        return ctx.json(result, 200)
    })

    .openapi(TournamentsRoutes.delete, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const em = ctx.get("em");
        const result = await em.findOne(Tournament, { id })
        if (result == null) {
            return ctx.text("Not found", 404);
        }

        // Supprimer d'abord tous les matchs associés aux catégories du tournoi
        const categories = await em.find(Category, { tournament: id });
        for (const category of categories) {
            try {
                await em.nativeDelete(Match, { category: category.id });
            } catch (error: any) {
                // Ignorer l'erreur si la table match n'existe pas
                if (!error.message.includes("doesn't exist")) {
                    throw error;
                }
            }
        }
        
        // Supprimer d'abord toutes les catégories associées au tournoi
        await em.nativeDelete(Category, { tournament: id });
        
        // Supprimer toutes les entrées de la table pivot tournament_competitor_category
        await em.nativeDelete(TournamentCompetitorCategory, { tournament: id });
        
        // Maintenant on peut supprimer le tournoi
        await em.nativeDelete(Tournament, { id });
        
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
        const { id, idCompetitor } = ctx.req.valid('param')
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

        await em.nativeDelete(TournamentCompetitorCategory, { tournament: id, competitor: idCompetitor })
        return ctx.text("Competitor removed from tournament", 202)
    })

    .openapi(TournamentsRoutes.getCompetitors, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const em = ctx.get("em");
        
        // Récupérer les compétiteurs via la table pivot
        const tournamentCompetitors = await em.find(TournamentCompetitorCategory, { 
            tournament: id 
        }, { populate: ['competitor'] });
        
        // Extraire les compétiteurs uniques
        const competitors = tournamentCompetitors.map(tc => tc.competitor);
        const uniqueCompetitors = competitors.filter((comp, index, self) => 
            index === self.findIndex(c => c.id === comp.id)
        );
        
        return ctx.json(uniqueCompetitors, 200)
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

    .openapi(TournamentsRoutes.assignCompetitor, async (ctx) => {
        const { id, categoryId, competitorId } = ctx.req.valid('param')
        const em = ctx.get("em");
        
        const tournament = await em.findOne(Tournament, { id })
        if (tournament == null) {
            return ctx.text("Tournament not found", 404);
        }

        const category = await em.findOne(Category, { id: categoryId })
        if (category == null) {
            return ctx.text("Category not found", 404);
        }

        const competitor = await em.findOne(Competitor, { id: competitorId })
        if (competitor == null) {
            return ctx.text("Competitor not found", 404);
        }

        // Vérifier si le compétiteur est déjà assigné à cette catégorie
        const existingAssignment = await em.findOne(TournamentCompetitorCategory, { 
            tournament: id, 
            competitor: competitorId, 
            category: categoryId 
        })
        
        if (existingAssignment) {
            return ctx.text("Competitor already assigned to this category", 409);
        }

        // Chercher s'il y a déjà une entrée pour ce compétiteur dans ce tournoi
        const tournamentCompetitor = await em.findOne(TournamentCompetitorCategory, { 
            tournament: id, 
            competitor: competitorId 
        })
        
        if (tournamentCompetitor) {
            // Mettre à jour l'assignation existante
            tournamentCompetitor.category = category
            await em.flush()
        } else {
            // Créer une nouvelle assignation
            const newAssignment = em.create(TournamentCompetitorCategory, {
                tournament: tournament,
                competitor: competitor,
                category: category
            })
            await em.persistAndFlush(newAssignment)
        }

        return ctx.text("Competitor assigned to category", 201)
    })

    .openapi(TournamentsRoutes.getAllCompetitors, async (ctx) => {
        const { id, categoryId } = ctx.req.valid('param')
        const em = ctx.get("em");
        
        const tournament = await em.findOne(Tournament, { id })
        if (tournament == null) {
            return ctx.json([], 200);
        }

        const category = await em.findOne(Category, { id: categoryId })
        if (category == null) {
            return ctx.json([], 200);
        }

        // Récupérer tous les compétiteurs de la base de données
        const allCompetitors = await em.find(Competitor, {})
        
        // Récupérer les compétiteurs déjà assignés à cette catégorie
        const assignedCompetitors = await em.find(TournamentCompetitorCategory, { 
            tournament: id, 
            category: categoryId 
        }, { populate: ['competitor'] })
        
        const assignedCompetitorIds = assignedCompetitors.map(tc => tc.competitor.id)
        
        // Filtrer les compétiteurs non assignés à cette catégorie
        const availableCompetitors = allCompetitors.filter(competitor => 
            !assignedCompetitorIds.includes(competitor.id)
        )

        return ctx.json(availableCompetitors, 200)
    })

    // Récupérer les compétiteurs assignés à une catégorie
    .openapi(TournamentsRoutes.getAssignedCategoryCompetitors, async (ctx) => {
        const { id, categoryId } = ctx.req.valid('param')
        const em = ctx.get("em");

        // Récupérer les compétiteurs assignés à cette catégorie
        const assignedCompetitors = await em.find(TournamentCompetitorCategory, { 
            tournament: id, 
            category: categoryId 
        }, { populate: ['competitor'] })
        
        const competitors = assignedCompetitors.map(tc => tc.competitor)

        return ctx.json(competitors, 200)
    })

    // Supprimer un compétiteur d'une catégorie
    .openapi(TournamentsRoutes.removeCategoryCompetitor, async (ctx) => {
        const { id, categoryId, competitorId } = ctx.req.valid('param')
        const em = ctx.get("em");

        // Trouver l'assignation spécifique
        const assignment = await em.findOne(TournamentCompetitorCategory, {
            tournament: id,
            category: categoryId,
            competitor: competitorId
        })

        if (!assignment) {
            return ctx.json({ message: 'Assignation non trouvée' }, 404)
        }

        // Supprimer l'assignation
        await em.remove(assignment).flush()

        return ctx.json({ message: 'Compétiteur supprimé de la catégorie avec succès' }, 200)
    })

    // Démarrer un tournoi
    .openapi(TournamentsRoutes.startTournament, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const em = ctx.get("em");

        try {
            console.log(`🚀 Démarrage du tournoi: ${id}`);

            // Vérifier si le tournoi existe
            const tournament = await em.findOne(Tournament, { id })
            if (tournament == null) {
                console.log(`❌ Tournoi ${id} non trouvé`);
                return ctx.text("Tournament not found", 404);
            }

            // Récupérer toutes les catégories du tournoi avec leurs compétiteurs
            const categories = await em.find(Category, { tournament: id })
            console.log(`📊 Nombre de catégories trouvées: ${categories.length}`);
            
            if (categories.length === 0) {
                console.log(`❌ Aucune catégorie trouvée pour le tournoi ${id}`);
                return ctx.text("No categories found - cannot start tournament", 404);
            }

            // Pour chaque catégorie, créer les matches
            for (const category of categories) {
                console.log(`🔄 Traitement de la catégorie: ${category.name}`);
                
                // Vérifier s'il y a déjà des matches pour cette catégorie
                const existingMatches = await em.find(Match, { category: category.id })
                if (existingMatches.length > 0) {
                    console.log(`⚠️ Catégorie ${category.name} a déjà des matches - ignoré`);
                    continue;
                }

                // Récupérer les compétiteurs assignés à cette catégorie
                const assignments = await em.find(TournamentCompetitorCategory, { 
                    tournament: id, 
                    category: category.id 
                }, { populate: ['competitor'] })

                console.log(`👥 Compétiteurs trouvés pour ${category.name}: ${assignments.length}`);

                if (assignments.length < 2) {
                    console.log(`⚠️ Catégorie ${category.name} a seulement ${assignments.length} compétiteurs - pas assez pour créer des matches`);
                    continue;
                }

                // Créer les matches selon le type d'élimination
                if (category.elimination_type === EnumEliminationType.DIRECT) {
                    // Créer les matches d'élimination directe
                    const competitors = assignments.map(a => a.competitor);
                    
                    // Créer les matches de premier tour
                    for (let i = 0; i < competitors.length; i += 2) {
                        if (i + 1 < competitors.length) {
                            const match = em.create(Match, {
                                category: category,
                                competitor1: competitors[i],
                                competitor2: competitors[i + 1],
                                pool_number: "0",
                                isFinished: false,
                                time: 180,
                                isRunning: false
                            });
                            await em.persist(match);
                        }
                    }
                } else if (category.elimination_type === EnumEliminationType.POOL) {
                    // Créer les matches de poule (tous contre tous)
                    const competitors = assignments.map(a => a.competitor);
                    
                    for (let i = 0; i < competitors.length; i++) {
                        for (let j = i + 1; j < competitors.length; j++) {
                            const match = em.create(Match, {
                                category: category,
                                competitor1: competitors[i],
                                competitor2: competitors[j],
                                pool_number: "0",
                                isFinished: false,
                                time: 180,
                                isRunning: false
                            });
                            await em.persist(match);
                        }
                    }
                }
            }

            // Sauvegarder tous les matches
            await em.flush();
            console.log(`✅ Tournoi ${id} démarré avec succès`);

            return ctx.text("Tournament started successfully", 200);
            
        } catch (error: any) {
            console.error(`❌ Erreur lors du démarrage du tournoi ${id}:`, error);
            return ctx.text("Error starting tournament", 500);
        }
    })

    // Réinitialiser un tournoi (supprimer tous les matches)
    .openapi(TournamentsRoutes.resetTournament, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const em = ctx.get("em");

        // Vérifier si le tournoi existe
        const tournament = await em.findOne(Tournament, { id })
        if (tournament == null) {
            return ctx.text("Tournament not found", 404);
        }

        // Récupérer toutes les catégories du tournoi
        const categories = await em.find(Category, { tournament: id })
        
        // Supprimer tous les matches des catégories
        for (const category of categories) {
            await em.nativeDelete(Match, { category: category.id });
        }

        return ctx.text("Tournament reset successfully", 200);
    })
}

// Fonction séparée pour les routes non-OpenAPI
export function buildTournamentsCategoryRouter() {
    const router = getApp()

    return router
        // Récupérer une catégorie spécifique
        .get('/categories/:categoryId', async (ctx) => {
            const { categoryId } = ctx.req.param();
            const em = ctx.get("em");

            try {
                const category = await em.findOne(Category, { id: categoryId }, {
                    populate: ['tournament', 'age_group', 'weight_category']
                });
                
                if (!category) {
                    return ctx.text("Category not found", 404);
                }

                return ctx.json({
                    id: category.id,
                    name: category.name,
                    rank: category.rank,
                    gender: category.gender,
                    elimination_type: category.elimination_type,
                    tournament: category.tournament,
                    age_group: category.age_group,
                    weight_category: category.weight_category
                }, 200);
            } catch (error) {
                console.error('❌ Error fetching category:', error);
                return ctx.text("Internal Server Error", 500);
            }
        })
        
        // Récupérer les matches d'une catégorie
        .get('/categories/:categoryId/matches', async (ctx) => {
            const { categoryId } = ctx.req.param();
            const em = ctx.get("em");

            try {
                // Vérifier si la catégorie existe
                const category = await em.findOne(Category, { id: categoryId })
                if (category == null) {
                    return ctx.text("Category not found", 404);
                }

                // Récupérer tous les matches de la catégorie
                const matches = await em.find(Match, { category: categoryId }, { 
                    populate: ['competitor1', 'competitor2', 'winner', 'category'] 
                })

                return ctx.json(matches, 200)
            } catch (error: any) {
                console.error(`❌ Erreur lors de la récupération des matches:`, error);
                return ctx.text("Error fetching matches", 500);
            }
        })
}
