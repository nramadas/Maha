import { Arg, Mutation, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { User as UserEntity } from '@/db/entities/User';
import * as errors from '@/graphql/errors';
import { CompleteAuthentication } from '@/graphql/types/CompleteAuthentication';
import { JWT } from '@/graphql/types/JWT';
import { JWTWithRefresh } from '@/graphql/types/JWTWithRefresh';
import {
  submitPasswordlessLogin,
  refreshSession,
  initiatePasswordlessLogin,
  userExists,
  createUser,
} from '@/lib/authn/api';
import { extractAuthId } from '@/lib/authn/token';

export async function doAuthentication(email: string) {
  const existingUser = await userExists(email);

  if (!existingUser.ok) {
    throw new errors.Unauthorized();
  }

  if (!existingUser.exists) {
    const createUserResult = await createUser(email);

    if (!createUserResult.ok) {
      throw new errors.Unauthorized();
    }
  }

  await initiatePasswordlessLogin(email);
}

@Resolver(of => JWT)
export class JWTMutationResolver {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
  ) {}

  @Mutation(returns => JWTWithRefresh, {
    description: 'Completes user authentication',
  })
  async completeAuthentication(
    @Arg('credentials') credentials: CompleteAuthentication,
  ) {
    const { email, token } = credentials;

    const result = await submitPasswordlessLogin(token);

    if (!result.ok) {
      throw new errors.Unauthorized();
    }

    const idToken = result.idToken;
    const refreshToken = result.refreshToken;

    const authId = await extractAuthId(idToken).catch(() => {
      throw new errors.SomethingElse();
    });

    let user = await this.users.findOne({
      where: { email },
    });

    if (!user) {
      user = this.users.create({
        email,
        authId,
        data: {},
      });

      await this.users.save(user);
    } else if (user.authId !== authId) {
      throw new errors.Unauthorized();
    }

    return { jwt: idToken, aut: refreshToken };
  }

  @Mutation(returns => JWT, { description: 'Swap a token for a new one' })
  async refreshAuthentication(@Arg('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new errors.Unauthorized();
    }

    const result = await refreshSession(refreshToken);

    if (!result.ok) {
      throw new errors.SomethingElse();
    }

    const idToken = result.idToken;

    return { jwt: idToken };
  }
}
