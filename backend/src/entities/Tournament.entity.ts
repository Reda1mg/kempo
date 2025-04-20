import { EntitySchema} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { AgeGroup } from './age-group.entity.ts';

export enum EnumRank{
  WHITE = 'Ceinture Blanche',
  WHITE_YELLOW = 'Ceinture Blanche-Jaune',
  YELLOW = 'Ceinture Jaune',
  YELLOW_ORANGE = 'Ceinture Jaune-Orange',
  ORANGE = 'Ceinture Orange',
  ORANGE_GREEN = 'Ceinture Orange-Verte',
  GREEN = 'Ceinture Verte',
  GREEN_BLUE = 'Ceinture Verte-Bleue',
  BLUE = 'Ceinture Bleue',
  BLUE_BROWN = 'Ceinture Bleue-Marron',
  BROWN = 'Ceinture Marron',
  BLACK_1 = 'Ceinture Noire 1ère dan',
  BLACK_2 = 'Ceinture Noire 2ème dan',
  BLACK_3 = 'Ceinture Noire 3ème dan',
  BLACK_4 = 'Ceinture Noire 4ème dan',
  BLACK_5 = 'Ceinture Noire 5ème dan',
  BLACK_6 = 'Ceinture Noire 6ème dan',
}


export class Tournament{
  id!: string ;
  name!: string ;
  rank?: EnumRank ;
  city?: string ;
  start_date!: Date ;
  end_date?: Date;
  age_group?: AgeGroup;
  
}

export const TournamentSchema = new EntitySchema({
  class: Tournament,
  properties: {
    id: { type: 'uuid', onCreate: () => v4(), primary: true },
    name: { type: String },
    rank: { enum: true, items: () => Object.values(EnumRank) },
    city : { type : String },
    start_date : { type : Date },
    end_date : {type : Date},
    age_group : {kind: 'm:1',entity: ()=> AgeGroup, nullable: true}
  },
});


