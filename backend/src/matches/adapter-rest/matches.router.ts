import { getApp } from "../../api/get-app.ts";
import { Category } from "../../entities/Category.entity.ts";
import { Competitor } from "../../entities/Competitor.entity.ts";
import { Match } from "../../entities/match.entity.ts";
import { MatchesRoutes } from "./maches.openapi.ts";


export function buildMatchesRouter() {
    const router = getApp()

    // Routes OpenAPI
    router.openapi(MatchesRoutes.getMatchesByCategory, async (ctx) => {
        const { categoryId } = ctx.req.valid('param')
        const em = ctx.get("em");

        // Vérifier si la catégorie existe
        const category = await em.findOne(Category, { id: categoryId })
        if (category == null) {
            return ctx.text("Category not found", 404);
        }

        // Récupérer tous les matches de cette catégorie
        const matches = await em.find(Match, { category: categoryId }, { 
            populate: ['competitor1', 'competitor2', 'winner'] 
        })

        return ctx.json(matches, 200)
    })

    router.openapi(MatchesRoutes.getMatch, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const em = ctx.get("em");

        // Récupérer le match spécifique
        const match = await em.findOne(Match, { id }, { 
            populate: ['competitor1', 'competitor2', 'winner', 'category'] 
        })

        if (match == null) {
            return ctx.text("Match not found", 404);
        }

        return ctx.json({
            id: match.id,
            competitor1: match.competitor1,
            competitor2: match.competitor2,
            score1: match.score1,
            score2: match.score2,
            keikuka1: match.keikuka1,
            keikuka2: match.keikuka2,
            winner: match.winner,
            time: match.time,
            isRunning: match.isRunning,
            isFinished: match.isFinished,
            pool_number: match.pool_number,
            category: match.category,
        }, 200)
    })

    router.openapi(MatchesRoutes.setResult, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const body = ctx.req.valid('json')

        const em = ctx.get("em");
        const match = await em.findOne(Match, { id })
        if (match == null) {
            return ctx.text("Not found", 404);
        }

        match.score1 = body.score1 ?? match.score1
        match.score2 = body.score2 ?? match.score2
        match.keikuka1 = body.keikuka1 ?? match.keikuka1
        match.keikuka2 = body.keikuka2 ?? match.keikuka2
        match.time = body.time ?? match.time
        match.isRunning = body.isRunning ?? match.isRunning
        
        // Ne marquer comme terminé que si explicitement demandé
        if (body.isFinished !== undefined) {
            match.isFinished = body.isFinished
        }

        // Déterminer le gagnant seulement si le match est terminé
        if (match.isFinished) {
            if (match.score1 > match.score2) {
                match.winner = match.competitor1
            } else if (match.score2 > match.score1) {
                match.winner = match.competitor2
            } else if (match.keikuka1 > match.keikuka2) {
                match.winner = match.competitor2
            } else if (match.keikuka2 > match.keikuka1) {
                match.winner = match.competitor1
            }
            else {
                match.winner = body.winner ? await em.findOne(Competitor, { id: body.winner }) : null
            }
        }

        if (match.winner != null && match.next_match != null) {
            const nextMatch = await em.findOne(Match, { id: match.next_match.id })
            if (nextMatch == null) {
                return ctx.text("Next match not found", 404);
            }
            if (nextMatch?.competitor1 == null) {
                nextMatch.competitor1 = match.winner
            } else if (nextMatch?.competitor2 == null) {
                nextMatch.competitor2 = match.winner
            }

        }
        await em.persistAndFlush(match);
        return ctx.json(match.winner?.id ?? null, 200)
    })

    // Route de suppression (syntaxe standard)
    router.delete('/category/:categoryId', async (ctx) => {
        const { categoryId } = ctx.req.param();
        const em = ctx.get("em");

        // Vérifier si la catégorie existe
        const category = await em.findOne(Category, { id: categoryId })
        if (category == null) {
            return ctx.text("Category not found", 404);
        }

        // Supprimer tous les matches de cette catégorie
        const matches = await em.find(Match, { category: categoryId })
        await em.removeAndFlush(matches)

        return ctx.text("All matches deleted", 200)
    })

    return router
}
