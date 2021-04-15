import { Field, ObjectType, ID } from 'type-graphql';

import { JWT as JWTModel } from '@/models/JWT';

@ObjectType({ description: 'A JWT token' })
export class JWT implements JWTModel {
  @Field(type => ID, { description: 'The JWT token value' })
  jwt!: string;
}
