import { Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Role as RoleEntity } from '@/db/entities/Role';
import * as errors from '@/graphql/errors';
import { Organization } from '@/graphql/types/Organization';
import { Permission } from '@/graphql/types/Permission';
import { Role } from '@/graphql/types/Role';
import { User } from '@/graphql/types/User';
import { convertFromDBModel as convertFromOrganizationDBModel } from '@/lib/modelConversions/organization';
import { convertFromDBModel as convertFromUserDBModel } from '@/lib/modelConversions/user';

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

    if (!dbRole) {
      throw new errors.DoesNotExist('this', root.id);
    }

    if (!dbRole.organization) {
      throw new errors.DoesNotExist('this.organization', null);
    }

    return convertFromOrganizationDBModel(dbRole.organization);
  }
}
