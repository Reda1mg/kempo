import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class TestEntity {
  @PrimaryKey({ type: 'uuid' })
  id!: string;

  @Property()
  name!: string;
}
