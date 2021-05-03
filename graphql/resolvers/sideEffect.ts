import { AuthenticationError } from 'apollo-server-micro';
import { Arg, Authorized, Ctx, ID, Mutation, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Invite as InviteEntity } from '@/db/entities/Invite';
import { Role as RoleEntity } from '@/db/entities/Role';
import { User as UserEntity } from '@/db/entities/User';
import { Context } from '@/graphql/context';
import { MyOrganization } from '@/graphql/decorators';
import { SideEffect } from '@/graphql/types/SideEffect';
import {
  initiatePasswordlessLogin,
  userExists,
  createUser,
} from '@/lib/authn/api';
import { ErrorType } from '@/lib/errors/type';
import { userIsAdmin } from '@/lib/permissions/userIsAdmin';
import { InviteType } from '@/models/InviteType';
import type { Organization } from '@/models/Organization';
import { Permission } from '@/models/Permission';

async function doAuthentication(email: string) {
  const existingUser = await userExists(email);

  if (!existingUser.ok) {
    throw new AuthenticationError(ErrorType.SomethingElse);
  }

  if (!existingUser.exists) {
    const createUserResult = await createUser(email);

    if (!createUserResult.ok) {
      throw new AuthenticationError(ErrorType.SomethingElse);
    }
  }

  await initiatePasswordlessLogin(email);
}

@Resolver(of => SideEffect)
export class SideEffectResolver {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _users: Repository<UserEntity>,
    @InjectRepository(InviteEntity)
    private readonly _invites: Repository<InviteEntity>,
    @InjectRepository(RoleEntity)
    private readonly _roles: Repository<RoleEntity>,
  ) {}

  @Mutation(returns => SideEffect, { description: 'Register a new user' })
  async beginAuthentication(@Arg('email') email: string) {
    await doAuthentication(email);
    return { ok: true };
  }

  @Mutation(returns => SideEffect, {
    description: 'Invite a user to create an organization',
  })
  async inviteUserToCreateOrganization(
    @Ctx() ctx: Context,
    @Arg('email') email: string,
  ) {
    const user = ctx.me;

    if (!user || !userIsAdmin(user)) {
      throw new AuthenticationError(ErrorType.Unauthorized);
    }

    const existingInvite = await this._invites.findOne({
      where: { email, type: InviteType.CreateOrganization, expired: false },
    });

    if (!existingInvite) {
      const invite = this._invites.create({
        email,
        type: InviteType.CreateOrganization,
      });
      await this._invites.save(invite);
    }

    await doAuthentication(email);
    return { ok: true };
  }

  @Authorized(Permission.ModifyRoles)
  @Mutation(returns => SideEffect, {
    description: 'Invite a user to an organization',
  })
  async inviteUserToOrganization(
    @MyOrganization() org: Organization,
    @Arg('email') email: string,
    @Arg('roleIds', type => [ID], { nullable: true }) roleIds?: string[],
  ) {
    let invite = await this._invites.findOne({
      where: {
        email,
        expired: false,
        organizationId: org.id,
        type: InviteType.JoinOrganization,
      },
      relations: ['roles'],
    });

    if (!invite) {
      invite = this._invites.create({
        email,
        data: {},
        organizationId: org.id,
        type: InviteType.JoinOrganization,
      });
    }

    if (roleIds?.length) {
      const roles = await this._roles.find({
        where: (roleIds || []).map(id => ({ id })),
      });

      invite.roles = roles;
    }

    await this._invites.save(invite);
    await doAuthentication(email);
    return { ok: true };
  }
}
