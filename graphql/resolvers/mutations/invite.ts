import { Arg, Authorized, Ctx, ID, Mutation, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Invite as InviteEntity } from '@/db/entities/Invite';
import { Role as RoleEntity } from '@/db/entities/Role';
import { User as UserEntity } from '@/db/entities/User';
import { Context } from '@/graphql/context';
import { MyOrganization } from '@/graphql/decorators';
import * as errors from '@/graphql/errors';
import { Invite } from '@/graphql/types/Invite';
import { InviteType } from '@/graphql/types/InviteType';
import { Organization } from '@/graphql/types/Organization';
import { Permission } from '@/graphql/types/Permission';
import { convertFromDBModel as convertFromInviteDBModel } from '@/lib/modelConversions/invite';
import { userIsAdmin } from '@/lib/permissions/userIsAdmin';

import { doAuthentication } from './jwt';

@Resolver(of => Invite)
export class InviteMutationResolver {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _users: Repository<UserEntity>,
    @InjectRepository(InviteEntity)
    private readonly _invites: Repository<InviteEntity>,
    @InjectRepository(RoleEntity)
    private readonly _roles: Repository<RoleEntity>,
  ) {}

  @Mutation(returns => Invite, {
    description: 'Invite a user to create an organization',
  })
  async inviteUserToCreateOrganization(
    @Ctx() ctx: Context,
    @Arg('email') email: string,
  ) {
    const user = ctx.me;

    if (!user || !userIsAdmin(user)) {
      throw new errors.Unauthorized();
    }

    let invite = await this._invites.findOne({
      where: { email, type: InviteType.CreateOrganization, expired: false },
    });

    if (!invite) {
      invite = this._invites.create({
        email,
        type: InviteType.CreateOrganization,
      });
      await this._invites.save(invite);
    }

    await doAuthentication(email);
    return convertFromInviteDBModel(invite);
  }

  @Authorized(Permission.ModifyRoles)
  @Mutation(returns => Invite, {
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
    return convertFromInviteDBModel(invite);
  }
}
