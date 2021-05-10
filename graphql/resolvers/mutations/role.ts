import { Arg, Authorized, ID, Mutation, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Role as RoleEntity } from '@/db/entities/Role';
import * as errors from '@/graphql/errors';
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
}
