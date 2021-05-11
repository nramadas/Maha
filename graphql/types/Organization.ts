import { Authorized, Field, ObjectType, ID } from 'type-graphql';

import { Permission } from '@/graphql/types/Permission';
import { Property } from '@/graphql/types/Property';
import { Organization as OrganizationModel } from '@/models/Organization';
import { User as UserModel } from '@/models/User';

@ObjectType({ description: 'A property developer' })
export class Organization implements OrganizationModel {
  @Field({
    description: 'When the organization was registered with the platform',
  })
  created!: Date;

  @Field(type => ID, { description: 'Organization ID' })
  id!: OrganizationModel['id'];

  @Authorized(Permission.ViewMembers)
  @Field(type => [ID], {
    description: 'List of user ids that are associated with this organization',
  })
  memberIds!: UserModel['id'][];

  @Field({ description: 'The name of the organization' })
  name!: string;

  @Field(type => [ID], {
    description:
      'A list of property ids that are associated with this organization',
  })
  propertyIds!: Property['id'][];
}
