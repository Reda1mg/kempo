// src/entities/Tournament.ts
import { EntitySchema} from '@mikro-orm/core';
import { v4 } from 'uuid';

export enum EnumRank{
  WHITE = 'Ceinture Blanche',
  YELLOW = 'Ceinture Jaune',
  ORANGE = 'Ceinture Orange',
  PURPLE = 'Ceinture Violette',
  BLUE = 'Ceinture Bleue',
  GREEN = 'Ceinture Verte',
  BROWN = 'Ceinture Marron',
  BLACK = 'Ceinture Noire',
}


export class Tournament{
  id!: string ;
  name!: string ;
  rank?: EnumRank ;
  city?: string ;
  start_date!: Date ;
  end_date?: Date;
}

export const TournamentSchema = new EntitySchema({
  class: Tournament,
  properties: {
    id: { type: 'uuid', onCreate: () => v4(), primary: true },
    name: { type: String },
    rank: { enum: true, items: () => Object.values(EnumRank) },
    city : { type : String },
    start_date : { type : Date },
    end_date : {type : Date}
  },
});


