import { EntitySchema } from "@mikro-orm/core";
import { AgeGroup } from "./AgeGroup.entity.ts";

export enum EnumSexe{
    MAN = 'H',
    WOMAN = 'F'
}



export class WeightCategory{
    id!: string ;
    name!: string;
    weight_min!: number;
    weight_max!: number;
    age_group!: AgeGroup;
    sexe!: EnumSexe
}


export const WeightCategorySchema = new EntitySchema({
    class: WeightCategory,
    properties: {
        id: { type: Number,primary:true,autoincrement: true},
        name: {type: String},
        weight_min: {type: Number},
        weight_max: {type: Number},
        age_group: {kind: 'm:1',entity: ()=> AgeGroup},
        sexe: { enum: true, items: () => Object.values(EnumSexe)}
    }
})