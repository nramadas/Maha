import { AuthenticationError } from 'apollo-server-micro';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { User as UserEntity } from '@/db/entities/User';
import { CompleteAuthenticationInput } from '@/graphql/types/CompleteAuthentication';
import { JWT } from '@/graphql/types/JWT';
import { JWTWithRefresh } from '@/graphql/types/JWTWithRefresh';
import { RefreshAuthenticationInput } from '@/graphql/types/RefreshAuthenticationInput';
import { submitPasswordlessLogin, refreshSession } from '@/lib/authn/api';
import { extractAuthId } from '@/lib/authn/token';
import { ErrorType } from '@/lib/errors/type';

@Resolver(of => JWT)
export class JWTResolver {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
  ) {}

  @Mutation(returns => JWTWithRefresh, {
    description: 'Completes user authentication',
  })
  async completeAuthentication(
    @Arg('credentials') credentials: CompleteAuthenticationInput,
  ) {
    const { email, token } = credentials;

    const result = await submitPasswordlessLogin(token);

    if (!result.ok) {
      throw new AuthenticationError(ErrorType.SomethingElse);
    }

    const idToken = result.idToken;
    const refreshToken = result.refreshToken;

    const authId = await extractAuthId(idToken).catch(() => {
      throw new AuthenticationError(ErrorType.SomethingElse);
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
      throw new AuthenticationError(ErrorType.SomethingElse);
    }

    return { jwt: idToken, aut: refreshToken };
  }

  @Mutation(returns => JWT, { description: 'Swap a token for a new one' })
  async refreshAuthentication(
    @Arg('credentials') credentials: RefreshAuthenticationInput,
  ) {
    const { refreshToken } = credentials;

    if (!refreshToken) {
      throw new AuthenticationError(ErrorType.Unauthorized);
    }

    const result = await refreshSession(refreshToken);

    if (!result.ok) {
      throw new AuthenticationError(ErrorType.SomethingElse);
    }

    const idToken = result.idToken;

    return { jwt: idToken };
  }
}
