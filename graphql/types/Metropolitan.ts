import { Field, ObjectType } from 'type-graphql';

import { MetropolitanKey } from '@/graphql/types/MetropolitanKey';
import { Metropolitan as MetropolitanModel } from '@/models/Metropolitan';

@ObjectType({ description: 'A metropolitan area' })
export class Metropolitan implements MetropolitanModel {
  @Field({ description: 'A key to distinguish the metropolitan area' })
  key!: MetropolitanKey;
}
