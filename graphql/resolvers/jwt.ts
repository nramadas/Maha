import { AuthenticationError } from 'apollo-server-micro';
import { publicRequest as authnPublicRequest } from 'lib/authn/request';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { User as UserEntity } from '@/db/entities/User';
import { CompleteAuthenticationInput } from '@/graphql/types/CompleteAuthentication';
import { JWT } from '@/graphql/types/JWT';
import { extractPayload } from '@/lib/authn/token';
import { ErrorType } from '@/lib/errors/type';

@Resolver(of => JWT)
export class JWTResolver {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
  ) {}

  @Mutation(returns => JWT, { description: 'Completes user authentication' })
  async completeAuthentication(
    @Arg('credentials') credentials: CompleteAuthenticationInput,
  ) {
    const { email, token } = credentials;

    const verify = await authnPublicRequest({
      url: `/session/token`,
      method: 'POST',
      body: { token },
    });

    if (verify.errors) {
      throw new AuthenticationError(ErrorType.SomethingElse);
    }

    const idToken: string = verify.result.id_token;
    const idTokenPayload = extractPayload(idToken);

    if (!idTokenPayload) {
      throw new AuthenticationError(ErrorType.SomethingElse);
    }

    let user = await this.users.findOne({
      where: { email },
    });

    if (!user) {
      user = this.users.create({
        email,
        authId: idTokenPayload.sub,
        data: {},
      });

      await this.users.save(user);
    } else if (user.authId !== idTokenPayload.sub) {
      throw new AuthenticationError(ErrorType.SomethingElse);
    }

    return { jwt: idToken };
  }
}
