import { AuthenticationError } from 'apollo-server-micro';
import { publicRequest as authnPublicRequest } from 'lib/authn/request';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { User as UserEntity } from '@/db/entities/User';
import { BeginAuthenticationInput } from '@/graphql/types/BeginAuthenticationInput';
import { SideEffect } from '@/graphql/types/SideEffect';
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

    const existingUser = await authnPublicRequest({
      url: `/accounts/available?username=${encodeURIComponent(email)}`,
      method: 'GET',
    });

    if (!existingUser.errors) {
      const createUser = await authnPublicRequest({
        url: '/accounts',
        method: 'POST',
        body: {
          username: email,
          password: await randomString(20),
        },
      });

      if (createUser.errors) {
        throw new AuthenticationError(ErrorType.SomethingElse);
      }
    }

    await authnPublicRequest({
      url: `/session/token?username=${encodeURIComponent(email)}`,
      method: 'GET',
    });

    return { ok: true };
  }
}
