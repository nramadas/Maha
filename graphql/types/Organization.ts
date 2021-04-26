import { Field, ObjectType, ID } from 'type-graphql';

import { Organization as OrganizationModel } from '@/models/Organization';
import { Property as PropertyModel } from '@/models/Property';
import { User as UserModel } from '@/models/User';

@ObjectType({ description: 'A property developer' })
export class Organization implements OrganizationModel {
  @Field({
    description: 'When the organization was registered with the platform',
  })
  created!: Date;

  @Field(type => ID, { description: 'User ID' })
  id!: OrganizationModel['id'];

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
  propertyIds!: PropertyModel['id'][];
}
