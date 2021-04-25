import { Field, ObjectType, ID } from 'type-graphql';

import { OrganizationId } from '@/models/Organization';
import { Role as RoleModel } from '@/models/Role';

@ObjectType({ description: 'The role of the user in an organization' })
export class Role implements RoleModel {
  @Field({ description: 'When the user created the account' })
  created!: Date;

  @Field(type => ID, { description: 'Role ID' })
  id!: RoleModel['id'];

  @Field({ description: 'What the role is called' })
  name!: string;

  @Field(type => ID, { description: 'The ID of the organization' })
  organizationId!: OrganizationId;
}
