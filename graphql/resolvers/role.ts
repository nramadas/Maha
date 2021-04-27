import { ValidationError, UserInputError } from 'apollo-server-micro';
import {
  Arg,
  Authorized,
  FieldResolver,
  Mutation,
  Resolver,
  Root,
} from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Role as RoleEntity } from '@/db/entities/Role';
import { MyOrganization } from '@/graphql/decorators';
import { Organization } from '@/graphql/types/Organization';
import { Role } from '@/graphql/types/Role';
import { User } from '@/graphql/types/User';
import { ErrorType } from '@/lib/errors/type';
import { convertFromDBModel as convertFromOrganizationDBModel } from '@/lib/modelConversions/organization';
import { convertFromDBModel as convertFromRoleDBModel } from '@/lib/modelConversions/role';
import { convertFromDBModel as convertFromUserDBModel } from '@/lib/modelConversions/user';
import { Permission } from '@/models/Permission';

@Resolver(of => Role)
export class RoleResolver {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly _roles: Repository<RoleEntity>,
  ) {}

  @Authorized(Permission.ModifyRoles)
  @FieldResolver(type => [User], {
    description: 'All the users that have this role',
  })
  async users(@Root() root: Role) {
    const dbRole = await this._roles.findOne({
      where: { id: root.id },
      relations: ['users'],
    });

    if (!dbRole) {
      return [];
    }

    return dbRole.users.map(convertFromUserDBModel);
  }

  @Authorized()
  @FieldResolver(type => Organization, {
    description: 'The organization that this role belongs to',
  })
  async organization(@Root() root: Role) {
    const dbRole = await this._roles.findOne({
      where: { id: root.id },
      relations: ['organization'],
    });

    if (!dbRole || !dbRole.organization) {
      throw new ValidationError(ErrorType.SomethingElse);
    }

    return convertFromOrganizationDBModel(dbRole.organization);
  }

  @Authorized(Permission.ModifyRoles)
  @Mutation(returns => [Role], {
    description: 'Add a new role to an organization',
  })
  async createRole(
    @MyOrganization() org: Organization,
    @Arg('name') name: string,
    @Arg('description', { nullable: true }) description?: string,
  ) {
    const dbRoles = await this._roles.find({
      where: { organizationId: org.id },
    });

    const existingRole = dbRoles.find(role => role.name === name);

    if (existingRole) {
      throw new UserInputError(ErrorType.AlreadyTaken, {
        field: 'name',
      });
    }

    const newRole = this._roles.create({
      name,
      organizationId: parseInt(org.id, 10),
      data: { description },
    });

    await this._roles.save(newRole);

    return [...dbRoles, newRole].map(convertFromRoleDBModel);
  }
}
