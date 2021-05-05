import { UserInputError } from 'apollo-server-micro';
import { Arg, Authorized, ID, Mutation, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Role as RoleEntity } from '@/db/entities/Role';
import { User as UserEntity } from '@/db/entities/User';
import { Permission } from '@/graphql/types/Permission';
import { User } from '@/graphql/types/User';
import { ErrorType } from '@/lib/errors/type';
import { convertFromDBModel as convertFromUserDBModel } from '@/lib/modelConversions/user';

@Resolver(of => User)
export class UserMutationResolver {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly _roles: Repository<RoleEntity>,
    @InjectRepository(UserEntity)
    private readonly _users: Repository<UserEntity>,
  ) {}

  @Authorized(Permission.ModifyRoles)
  @Mutation(returns => User, { description: 'Set roles on user' })
  async setUserRoles(
    @Arg('roleIds', type => [ID]) roleIds: string[],
    @Arg('userId', type => ID) userId: string,
  ) {
    const dbRoles = roleIds.length
      ? await this._roles.find({
          where: roleIds.map(id => ({ id })),
        })
      : [];

    // Check that we found all the roles
    for (const roleId of roleIds) {
      const role = dbRoles.find(r => r.id === roleId);

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
