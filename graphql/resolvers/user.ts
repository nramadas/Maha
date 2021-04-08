import { Authorized, Ctx, Query, Resolver } from 'type-graphql';

import { Context } from '@/graphql/context';
import { User } from '@/graphql/types/User';

@Resolver(of => User)
export class UserResolver {
  @Authorized()
  @Query(returns => User, { description: 'Get user info for self' })
  me(@Ctx() ctx: Context): User | null {
    return ctx.me;
  }
}
