import { Field, ObjectType, ID } from 'type-graphql';

import { JWT as JWTModel } from '@/models/JWT';

@ObjectType({ description: 'A jwt token paired with a refresh token' })
export class JWTWithRefresh implements JWTModel {
  @Field(type => ID, { description: 'The JWT token value' })
  jwt!: string;

  @Field(type => ID, { description: 'A refresh token' })
  aut!: string;
}
