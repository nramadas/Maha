import { AuthenticationError } from 'apollo-server-micro';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Invite as InviteEntity } from '@/db/entities/Invite';
import { User as UserEntity } from '@/db/entities/User';
import { Context } from '@/graphql/context';
import { SideEffect } from '@/graphql/types/SideEffect';
import {
  initiatePasswordlessLogin,
  userExists,
  createUser,
} from '@/lib/authn/api';
import { ErrorType } from '@/lib/errors/type';
import { userIsAdmin } from '@/lib/permissions/userIsAdmin';
import { InviteType } from '@/models/InviteType';

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
    private readonly users: Repository<UserEntity>,
    @InjectRepository(InviteEntity)
    private readonly invites: Repository<InviteEntity>,
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

    const existingInvite = await this.invites.findOne({
      where: { email, type: InviteType.CreateOrganization, expired: false },
    });

    if (!existingInvite) {
      const invite = this.invites.create({
        email,
        type: InviteType.CreateOrganization,
      });
      await this.invites.save(invite);
    }

    await doAuthentication(email);
    return { ok: true };
  }
}
