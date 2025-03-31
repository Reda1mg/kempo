// src/entities/Tournament.ts
import { EntitySchema} from '@mikro-orm/core';



export class Tournament{
  _id!: number ;
  name: string | undefined;
}

export const TournamentSchema = new EntitySchema({
  class: Tournament,
  properties: {
    _id: { type: Number, primary: true },
    name: { type: String },
  },
});