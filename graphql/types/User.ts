import { Field, ObjectType, ID } from 'type-graphql';

import { Gender } from '@/graphql/types/Gender';
import { Language } from '@/graphql/types/Language';
import { Gender as GenderModel } from '@/models/Gender';
import { Language as LanguageModel } from '@/models/Language';
import { User as UserModel } from '@/models/User';

@ObjectType({ description: 'A user' })
export class User implements UserModel {
  @Field({ description: 'When the user created the account' })
  created!: Date;

  @Field({ description: "User's email" })
  email!: string;

  @Field(type => ID, { description: 'User ID' })
  id!: UserModel['id'];

  @Field({ description: "The user's first name", nullable: true })
  firstName!: string;

  @Field({ description: "The user's last name", nullable: true })
  lastName!: string;

  @Field(type => Gender, { description: "The user's gender", nullable: true })
  gender!: GenderModel;

  @Field(type => ID, {
    description: 'The ID of the organization the user belongs to',
    nullable: true,
  })
  organizationId!: string;

  @Field(type => Language, {
    description: 'What language the user prefers to interact in',
    nullable: true,
  })
  preferredLanguage!: LanguageModel;

  @Field({ description: "The user's phone number", nullable: true })
  phoneNumber!: string;
}
