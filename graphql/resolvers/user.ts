import { Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { User as UserEntity } from '@/db/entities/User';
import { Context } from '@/graphql/context';
import { User } from '@/graphql/types/User';

@Resolver(of => User)
export class UserResolver {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
  ) {}

  @Authorized()
  @Query(returns => User, { description: 'Get info for self' })
  me(@Ctx() ctx: Context) {
    return ctx.me;
  }
}
