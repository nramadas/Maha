import { AuthenticationError } from 'apollo-server-micro';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { User as UserEntity } from '@/db/entities/User';
import { BeginAuthenticationInput } from '@/graphql/types/BeginAuthenticationInput';
import { SideEffect } from '@/graphql/types/SideEffect';
import {
  initiatePasswordlessLogin,
  userExists,
  createUser,
} from '@/lib/authn/api';
import { ErrorType } from '@/lib/errors/type';
import { randomString } from '@/lib/random';

@Resolver(of => SideEffect)
export class SideEffectResolver {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
  ) {}

  @Mutation(returns => SideEffect, { description: 'Register a new user' })
  async beginAuthentication(
    @Arg('credentials') credentials: BeginAuthenticationInput,
  ) {
    const { email } = credentials;

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

    return { ok: true };
  }
}
