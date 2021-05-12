import { Arg, Authorized, ID, Mutation, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Invite as InviteEntity } from '@/db/entities/Invite';
import { Organization as OrganizationEntity } from '@/db/entities/Organization';
import { Role as RoleEntity } from '@/db/entities/Role';
import { User as UserEntity } from '@/db/entities/User';
import { Me, MyOrganization } from '@/graphql/decorators';
import * as errors from '@/graphql/errors';
import { Organization } from '@/graphql/types/Organization';
import { Permission } from '@/graphql/types/Permission';
import { User } from '@/graphql/types/User';
import { PG_UNIQUE_VIOLATION } from '@/lib/errors/pg';
import { convertFromDBModel as convertFromOrganizationDBModel } from '@/lib/modelConversions/organization';
import { CommonRoleType } from '@/models/CommonRoleType';
import { InviteType as InviteTypeModel } from '@/models/InviteType';

@Resolver(of => Organization)
export class OrganizationMutationResolver {
  constructor(
    @InjectRepository(InviteEntity)
    private readonly _invites: Repository<InviteEntity>,
    @InjectRepository(OrganizationEntity)
    private readonly _organizations: Repository<OrganizationEntity>,
    @InjectRepository(RoleEntity)
    private readonly _roles: Repository<RoleEntity>,
    @InjectRepository(UserEntity)
    private readonly _users: Repository<UserEntity>,
  ) {}

  @Mutation(returns => Organization, {
    description: 'Create a new organization',
  })
  async createOrganization(@Me() user: User | null, @Arg('name') name: string) {
    if (!user) {
      throw new errors.Unauthorized();
    }

    const dbUser = await this._users.findOne({
      where: { email: user.email },
    });

    if (!dbUser) {
      throw new errors.Unauthorized();
    }

    const invite = await this._invites.findOne({
      where: {
        email: user.email,
        expired: false,
        type: InviteTypeModel.CreateOrganization,
      },
    });

    if (!invite) {
      throw new errors.Unauthorized();
    }

    try {
      const org = this._organizations.create({
        name,
        data: {},
        users: [dbUser],
      });
      await this._organizations.save(org);

      invite.expired = true;
      await this._invites.save(invite);

      await Promise.all(
        Object.values(CommonRoleType).map(async name => {
          let role = await this._roles.findOne({
            where: {
              name,
              organizationId: org.id,
            },
            relations: ['users'],
          });

          if (!role) {
            role = this._roles.create({
              name,
              organizationId: org.id,
              data: {},
            });
          }

          if (name === CommonRoleType.Owner) {
            role.users = (role.users || []).concat(dbUser);
          }

          await this._roles.save(role);
        }),
      );

      return convertFromOrganizationDBModel(org);
    } catch (e) {
      if ('code' in e) {
        switch (e.code) {
          case PG_UNIQUE_VIOLATION: {
            throw new errors.AlreadyTaken('name', name);
          }
        }
      }
      throw new errors.Unauthorized();
    }
  }

  @Authorized(Permission.ManageMembers)
  @Mutation(returns => Organization, {
    description: 'Remove a member from your organization',
  })
  async removeMember(
    @MyOrganization() org: Organization | null,
    @Arg('userId', type => ID) userId: string,
  ) {
    if (!org) {
      throw new errors.Unauthorized();
    }

    const dbUser = await this._users.findOne({
      where: { id: userId },
      relations: ['organization'],
    });

    if (!dbUser) {
      throw new errors.DoesNotExist('userId', userId);
    }

    dbUser.organization = null;
    dbUser.organizationId = undefined;

    await this._users.save(dbUser);

    return org;
  }
}
