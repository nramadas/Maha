import { Field, ObjectType, ID } from 'type-graphql';

import { InviteType } from '@/graphql/types/InviteType';
import { Invite as InviteModel } from '@/models/Invite';
import { InviteType as InviteTypeModel } from '@/models/InviteType';
import { Organization } from '@/models/Organization';

@ObjectType({ description: 'An invite' })
export class Invite implements InviteModel {
  @Field(type => ID, { description: 'An id for this invite' })
  id!: InviteModel['id'];

  @Field({ description: 'When the invite was created' })
  created!: Date;

  @Field({ description: 'Email of the user the invite is for' })
  email!: string;

  @Field({ description: 'Is this invite still valid?' })
  expired!: boolean;

  @Field(type => ID, {
    description: 'Which, if any, organization is this invite for',
    nullable: true,
  })
  organizationId?: Organization['id'];

  @Field(type => InviteType, { description: 'What kind of invite it is' })
  type!: InviteTypeModel;
}
