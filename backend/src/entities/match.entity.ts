import { v4 } from "uuid";
import { Category } from "./Category.entity.ts";
import { Competitor } from "./Competitor.entity.ts";
import { EntitySchema } from "@mikro-orm/core";

export class Match {
    id!: string
    competitor1!: Competitor
    competitor2!: Competitor
    score1!: number
    score2!: number
    category!: Category
    keikuka1!: number
    keikuka2!: number
    winner!: Competitor | null
    isFinished!: boolean

}

export const MatchSchema = new EntitySchema({
    class: Match,
    properties: {
        id: { type: 'uuid', onCreate: () => v4(), primary: true },
        competitor1: { kind: '1:1', entity: () => Competitor },
        competitor2: { kind: '1:1', entity: () => Competitor },
        score1: { type: 'number', default: 0 },
        score2: { type: 'number', default: 0 },
        category: { kind: '1:1', entity: () => Category },
        keikuka1: { type: 'number', default: 0 },
        keikuka2: { type: 'number', default: 0 },
        winner: { kind: '1:1', entity: () => Competitor, nullable: true, default: null },
        isFinished: { type: 'boolean', default: false }
    }
});
        