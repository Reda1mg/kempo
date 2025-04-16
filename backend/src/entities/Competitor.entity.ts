import { EntitySchema} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { AgeGroup } from './AgeGroup.entity.ts';
import { EnumRank } from './Tournament.entity.ts';
import { EnumSexe } from './WeightCategory.ts';


export class Competitor{
    id!: string ;
    firstname!: string;
    lastname!: string;
    birthday!: Date;
    club?: string;
    country!: string;
    weight?: number;
    rank!: EnumRank ;
    sexe!: EnumSexe ;
}

export const CompetitorSchema = new EntitySchema({
    class: Competitor,
    properties: {
        id: {type: 'uuid', onCreate: () => v4(), primary: true },
        firstname: {type: String},
        lastname: {type: String},
        birthday: {type: Date},
        club: {type: String},
        country: {type: String},
        weight: {type: Number},
        rank: { enum: true, items: () => Object.values(EnumRank) },
        sexe: { enum: true, items: () => Object.values(EnumSexe)}
    }
})