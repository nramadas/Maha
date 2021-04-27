import { AuthenticationError, UserInputError } from 'apollo-server-micro';
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Role as RoleEntity } from '@/db/entities/Role';
import { User as UserEntity } from '@/db/entities/User';
import { Context } from '@/graphql/context';
import { Organization } from '@/graphql/types/Organization';
import { Role } from '@/graphql/types/Role';
import { User } from '@/graphql/types/User';
import { ErrorType } from '@/lib/errors/type';
import { convertFromDBModel as convertFromOrganizationDBModel } from '@/lib/modelConversions/organization';
import { convertFromDBModel as convertFromRoleDBModel } from '@/lib/modelConversions/role';
import { convertFromDBModel as convertFromUserDBModel } from '@/lib/modelConversions/user';
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

  @Query(returns => User, { description: 'Get info for self', nullable: true })
  me(@Ctx() ctx: Context) {
    return ctx.me;
  }

  @Authorized(Permission.ModifyRoles)
  @Mutation(returns => User, { description: 'Set roles on user' })
  async setUserRoles(
    @Arg('roleIds', type => [ID]) roleIds: string[],
    @Arg('userId', type => ID) userId: string,
  ) {
    const dbRoles = await this._roles.find({
      where: roleIds.map(id => ({ id })),
    });

    // Check that we found all the roles
    for (const roleId of roleIds) {
      const role = dbRoles.find(r => r.id === parseInt(roleId, 10));

      if (!role) {
        throw new UserInputError(ErrorType.DoesNotExist, {
          field: 'roleIds',
          value: roleId,
        });
      }
    }

    // Check that the user exists
    const dbUser = await this._users.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!dbUser) {
      throw new UserInputError(ErrorType.DoesNotExist, {
        field: 'userId',
      });
    }

    // Assign the roles to the user
    dbUser.roles = dbRoles;
    await this._users.save(dbUser);

    return convertFromUserDBModel(dbUser);
  }
}
