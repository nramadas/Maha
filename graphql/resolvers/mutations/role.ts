import { Arg, Authorized, ID, Mutation, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Role as RoleEntity } from '@/db/entities/Role';
import { MyOrganization } from '@/graphql/decorators';
import * as errors from '@/graphql/errors';
import { Organization } from '@/graphql/types/Organization';
import { Permission } from '@/graphql/types/Permission';
import { Role } from '@/graphql/types/Role';
import { convertFromDBModel as convertFromRoleDBModel } from '@/lib/modelConversions/role';

@Resolver(of => Role)
export class RoleMutationResolver {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly _roles: Repository<RoleEntity>,
  ) {}

  @Authorized(Permission.ModifyRoles)
  @Mutation(returns => Role, {
    description: 'Change the permissions on a role',
  })
  async setRolePermissions(
    @Arg('roleId', type => ID) roleId: string,
    @Arg('permissions', type => [Permission]) permissions: Permission[],
  ) {
    const dbRole = await this._roles.findOne({ where: { id: roleId } });

    if (!dbRole) {
      throw new errors.DoesNotExist('roleId', roleId);
    }

    dbRole.data = { ...dbRole.data, permissions };
    await this._roles.save(dbRole);

    return convertFromRoleDBModel(dbRole);
  }

  @Authorized(Permission.ModifyRoles)
  @Mutation(returns => Role, {
    description: 'Add a new role to an organization',
  })
  async createRole(
    @MyOrganization() org: Organization,
    @Arg('name') name: string,
    @Arg('description', { nullable: true }) description?: string,
    @Arg('permissions', type => [Permission], { nullable: true })
    permissions?: Permission[],
  ) {
    const dbRoles = await this._roles.find({
      where: { organizationId: org.id },
    });

    const existingRole = dbRoles.find(role => role.name === name);

    if (existingRole) {
      throw new errors.AlreadyTaken('name', name);
    }

    const newRole = this._roles.create({
      name,
      organizationId: org.id,
      data: { description, permissions },
    });

    await this._roles.save(newRole);

    return convertFromRoleDBModel(newRole);
  }

  @Authorized(Permission.ModifyRoles)
  @Mutation(returns => Role, {
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
      throw new errors.DoesNotExist('id', id);
    }

    const roleModel = convertFromRoleDBModel(dbRole);
    await this._roles.delete(dbRole.id);
    return roleModel;
  }
}
