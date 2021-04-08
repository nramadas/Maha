import { Field, ObjectType, ID } from 'type-graphql';

import { User as BaseUserModel } from '@/models/User';

@ObjectType({ description: 'A user' })
export class User implements BaseUserModel {
  @Field({ description: 'When the user created the account' })
  created!: Date;

  @Field({ description: "User's email" })
  email!: string;

  @Field(type => ID, { description: 'User ID' })
  id!: string;
}
