import { Arg, Authorized, ID, Mutation, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Invite as InviteEntity } from '@/db/entities/Invite';
import { Organization as OrganizationEntity } from '@/db/entities/Organization';
import { Role as RoleEntity } from '@/db/entities/Role';
import { User as UserEntity } from '@/db/entities/User';
import { Me } from '@/graphql/decorators';
import * as errors from '@/graphql/errors';
import { InviteType } from '@/graphql/types/InviteType';
import { Organization } from '@/graphql/types/Organization';
import { Permission } from '@/graphql/types/Permission';
import { User } from '@/graphql/types/User';
import { convertFromDBModel as convertFromOrganizationDBModel } from '@/lib/modelConversions/organization';
import { convertFromDBModel as convertFromUserDBModel } from '@/lib/modelConversions/user';

@Resolver(of => User)
export class UserMutationResolver {
  constructor(
    @InjectRepository(InviteEntity)
    private readonly _invites: Repository<InviteEntity>,
    @InjectRepository(OrganizationEntity)
    private readonly _organizations: Repository<OrganizationEntity>,
    @InjectRepository(RoleEntity)
    private readonly _roles: Repository<RoleEntity>,
    @InjectRepository(UserEntity)
    private readonly _users: Repository<UserEntity>,
  ) {}

  @Mutation(returns => Organization, {
    description: 'Add yourself to an organization',
  })
  async joinOrganization(
    @Me() user: User | null,
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('phoneNumber') phoneNumber: string,
    @Arg('organizationName') organizationName: string,
  ) {
    if (!user) {
      throw new errors.Unauthorized();
    }

    const dbOrganization = await this._organizations.findOne({
      where: { name: organizationName },
      relations: ['users'],
    });

    if (!dbOrganization) {
      throw new errors.DoesNotExist('organizationName', organizationName);
    }

    const dbUser = await this._users.findOne({
      where: { email: user.email },
      relations: ['roles'],
    });

    if (!dbUser) {
      throw new errors.Unauthorized();
    }

    const dbInvite = await this._invites.findOne({
      where: {
        organizationId: dbOrganization.id,
        email: user.email,
        expired: false,
        type: InviteType.JoinOrganization,
      },
      relations: ['roles'],
    });

    if (!dbInvite) {
      throw new errors.Unauthorized();
    }

    dbUser.data = {
      ...dbUser.data,
      firstName,
      lastName,
      phoneNumber,
    };

    dbUser.roles = dbInvite.roles;

    await this._users.save(dbUser);

    dbOrganization.users.push(dbUser);
    await this._organizations.save(dbOrganization);

    dbInvite.expired = true;
    await this._invites.save(dbInvite);

    return convertFromOrganizationDBModel(dbOrganization);
  }

  @Authorized(Permission.ModifyRoles)
  @Mutation(returns => User, { description: 'Set roles on a user' })
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
        throw new errors.DoesNotExist('roleIds', roleId);
      }
    }

    // Check that the user exists
    const dbUser = await this._users.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!dbUser) {
      throw new errors.DoesNotExist('userId', userId);
    }

    // Assign the roles to the user
    dbUser.roles = dbRoles;
    await this._users.save(dbUser);

    return convertFromUserDBModel(dbUser);
  }
}
