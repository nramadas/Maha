import { ValidationError } from 'apollo-server-micro';
import { Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Role as RoleEntity } from '@/db/entities/Role';
import { Organization } from '@/graphql/types/Organization';
import { Permission } from '@/graphql/types/Permission';
import { Role } from '@/graphql/types/Role';
import { User } from '@/graphql/types/User';
import { ErrorType } from '@/lib/errors/type';
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

    if (!dbRole || !dbRole.organization) {
      throw new ValidationError(ErrorType.SomethingElse);
    }

    return convertFromOrganizationDBModel(dbRole.organization);
  }
}