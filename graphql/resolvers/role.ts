import { ValidationError, UserInputError } from 'apollo-server-micro';
import {
  Arg,
  Authorized,
  FieldResolver,
  ID,
  Mutation,
  Resolver,
  Root,
} from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Role as RoleEntity } from '@/db/entities/Role';
import { MyOrganization } from '@/graphql/decorators';
import { Organization } from '@/graphql/types/Organization';
import { Permission as PermissionType } from '@/graphql/types/Permission';
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
  @Mutation(returns => Organization, {
    description: 'Add a new role to an organization',
  })
  async createRole(
    @MyOrganization() org: Organization,
    @Arg('name') name: string,
    @Arg('description', { nullable: true }) description?: string,
    @Arg('permissions', type => [PermissionType], { nullable: true })
    permissions?: Permission[],
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
      organizationId: org.id,
      data: { description, permissions },
    });

    await this._roles.save(newRole);

    return org;
  }

  @Authorized(Permission.ModifyRoles)
  @Mutation(returns => Organization, {
    description: 'Remove a role from an organization',
  })
  async deleteRole(
    @MyOrganization() org: Organization,
    @Arg('id', type => ID) id: string,
  ) {
    const dbRole = await this._roles.findOne({
      where: { id },
    });

    if (!dbRole) {
      throw new UserInputError(ErrorType.DoesNotExist, {
        field: 'id',
      });
    }

    await this._roles.delete(dbRole.id);
    return org;
  }

  @Authorized(Permission.ModifyRoles)
  @Mutation(returns => Role, {
    description: 'Change the permissions on a role',
  })
  async setRolePermissions(
    @Arg('roleId', type => ID) roleId: string,
    @Arg('permissions', type => [PermissionType]) permissions: Permission[],
  ) {
    const dbRole = await this._roles.findOne({ where: { id: roleId } });

    if (!dbRole) {
      throw new UserInputError(ErrorType.DoesNotExist, {
        field: 'roleId',
      });
    }

    dbRole.data = { ...dbRole.data, permissions };
    await this._roles.save(dbRole);

    return convertFromRoleDBModel(dbRole);
  }
}
