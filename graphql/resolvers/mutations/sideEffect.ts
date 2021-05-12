import { Arg, Mutation, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Invite as InviteEntity } from '@/db/entities/Invite';
import { Role as RoleEntity } from '@/db/entities/Role';
import { User as UserEntity } from '@/db/entities/User';
import { SideEffect } from '@/graphql/types/SideEffect';

import { doAuthentication } from './jwt';

@Resolver(of => SideEffect)
export class SideEffectMutationResolver {
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
}
