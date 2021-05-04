import { AuthenticationError } from 'apollo-server-micro';
import { Ctx, FieldResolver, Resolver, Root } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Role as RoleEntity } from '@/db/entities/Role';
import { User as UserEntity } from '@/db/entities/User';
import { Context } from '@/graphql/context';
import { Organization } from '@/graphql/types/Organization';
import { Permission as PermissionType } from '@/graphql/types/Permission';
import { Role } from '@/graphql/types/Role';
import { User } from '@/graphql/types/User';
import { ErrorType } from '@/lib/errors/type';
import { convertFromDBModel as convertFromOrganizationDBModel } from '@/lib/modelConversions/organization';
import { convertFromDBModel as convertFromRoleDBModel } from '@/lib/modelConversions/role';
import { fromRoles } from '@/lib/permissions/fromRoles';
import { hasPermission } from '@/lib/permissions/hasPermission';
import { Permission } from '@/models/Permission';

@Resolver(of => User)
export class UserResolver {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly _roles: Repository<RoleEntity>,
    @InjectRepository(UserEntity)
    private readonly _users: Repository<UserEntity>,
  ) {}

  @FieldResolver(type => [PermissionType], {
    description: 'A list of permissions this user has',
  })
  async permissions(@Ctx() ctx: Context, @Root() root: User) {
    const roles = await this.roles(ctx, root);
    return fromRoles(roles);
  }

  @FieldResolver(type => [Role], {
    description: 'The roles that this users is assigned to',
  })
  async roles(@Ctx() ctx: Context, @Root() root: User) {
    const { me, roles } = ctx;

    if (!me) {
      throw new AuthenticationError(ErrorType.Unauthorized);
    }

    if (root.id !== me.id && !hasPermission(Permission.ModifyRoles, roles)) {
      throw new AuthenticationError(ErrorType.Unauthorized);
    }

    const dbUser = await this._users.findOne({
      where: { id: root.id },
      relations: ['roles'],
    });

    if (!dbUser) {
      return [];
    }

    return dbUser.roles.map(convertFromRoleDBModel);
  }

  @FieldResolver(type => Organization, {
    description: 'Which, if any, organization this user is a part of',
    nullable: true,
  })
  async organization(@Root() root: User) {
    const dbUser = await this._users.findOne({
      where: { id: root.id },
      relations: ['organization'],
    });

    if (!dbUser || !dbUser.organization) {
      return null;
    }

    return convertFromOrganizationDBModel(dbUser.organization);
  }
}
