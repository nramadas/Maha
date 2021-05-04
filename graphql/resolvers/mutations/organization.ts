import { AuthenticationError, UserInputError } from 'apollo-server-micro';
import { Arg, Authorized, ID, Mutation, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Invite as InviteEntity } from '@/db/entities/Invite';
import { Organization as OrganizationEntity } from '@/db/entities/Organization';
import { Role as RoleEntity } from '@/db/entities/Role';
import { User as UserEntity } from '@/db/entities/User';
import { Me, MyOrganization } from '@/graphql/decorators';
import { CreateOrganizationInput } from '@/graphql/types/CreateOrganizationInput';
import { Organization } from '@/graphql/types/Organization';
import { Permission as PermissionType } from '@/graphql/types/Permission';
import { User } from '@/graphql/types/User';
import { PG_UNIQUE_VIOLATION } from '@/lib/errors/pg';
import { ErrorType } from '@/lib/errors/type';
import { convertFromDBModel as convertFromOrganizationDBModel } from '@/lib/modelConversions/organization';
import { CommonRoleType } from '@/models/CommonRoleType';
import { InviteType as InviteTypeModel } from '@/models/InviteType';
import { Permission } from '@/models/Permission';

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
  async createOrganization(
    @Me() user: User | null,
    @Arg('details') details: CreateOrganizationInput,
  ) {
    if (!user) {
      throw new AuthenticationError(ErrorType.Unauthorized);
    }

    const dbUser = await this._users.findOne({
      where: { email: user.email },
    });

    if (!dbUser) {
      throw new AuthenticationError(ErrorType.Unauthorized);
    }

    const invite = await this._invites.findOne({
      where: {
        email: user.email,
        expired: false,
        type: InviteTypeModel.CreateOrganization,
      },
    });

    if (!invite) {
      throw new AuthenticationError(ErrorType.Unauthorized);
    }

    try {
      const name = details.name;
      const org = this._organizations.create({
        name,
        data: {},
        users: [dbUser],
      });
      await this._organizations.save(org);

      invite.expired = true;
      await this._invites.save(invite);

      await Promise.all(
        [
          CommonRoleType.Owner,
          CommonRoleType.Manager,
          CommonRoleType.SalesAgent,
        ].map(async name => {
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
            throw new UserInputError(ErrorType.AlreadyTaken, {
              field: 'name',
            });
          }
        }
      }
      throw new AuthenticationError(ErrorType.SomethingElse);
    }
  }

  @Authorized(Permission.ModifyRoles)
  @Mutation(returns => Organization, {
    description: 'Add a new role to an organization',
  })
  async createRole(
    @MyOrganization() org: Organization,
    @Arg('name') name: string,
    @Arg('description', { nullable: true }) description?: string,
    @Arg('permissions', type => [PermissionType], { nullable: true })
    permissions?: Permission[],
  ) {
    const dbRoles = await this._roles.find({
      where: { organizationId: org.id },
    });

    const existingRole = dbRoles.find(role => role.name === name);

    if (existingRole) {
      throw new UserInputError(ErrorType.AlreadyTaken, {
        field: 'name',
      });
    }

    const newRole = this._roles.create({
      name,
      organizationId: org.id,
      data: { description, permissions },
    });

    await this._roles.save(newRole);

    return org;
  }

  @Authorized(Permission.ModifyRoles)
  @Mutation(returns => Organization, {
    description: 'Remove a role from an organization',
  })
  async deleteRole(
    @MyOrganization() org: Organization,
    @Arg('id', type => ID) id: string,
  ) {
    const dbRole = await this._roles.findOne({
      where: { id },
    });

    if (!dbRole) {
      throw new UserInputError(ErrorType.DoesNotExist, {
        field: 'id',
      });
    }

    await this._roles.delete(dbRole.id);
    return org;
  }

  @Mutation(returns => Organization, {
    description: 'Create a new organization',
  })
  async joinOrganization(
    @Me() user: User | null,
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('phoneNumber') phoneNumber: string,
    @Arg('organizationName') organizationName: string,
  ) {
    if (!user) {
      throw new AuthenticationError(ErrorType.Unauthorized);
    }

    const dbOrganization = await this._organizations.findOne({
      where: { name: organizationName },
      relations: ['users'],
    });

    if (!dbOrganization) {
      throw new UserInputError(ErrorType.DoesNotExist, {
        field: 'organizationName',
      });
    }

    const dbUser = await this._users.findOne({
      where: { email: user.email },
      relations: ['roles'],
    });

    if (!dbUser) {
      throw new AuthenticationError(ErrorType.Unauthorized);
    }

    const dbInvite = await this._invites.findOne({
      where: {
        organizationId: dbOrganization.id,
        email: user.email,
        expired: false,
        type: InviteTypeModel.JoinOrganization,
      },
      relations: ['roles'],
    });

    if (!dbInvite) {
      throw new AuthenticationError(ErrorType.Unauthorized);
    }

    dbUser.data = {
      ...dbUser.data,
      firstName,
      lastName,
      phoneNumber,
    };

    dbUser.roles = dbInvite.roles;

    await this._users.save(dbUser);

    dbOrganization.users.push(dbUser);
    await this._organizations.save(dbOrganization);

    dbInvite.expired = true;
    await this._invites.save(dbInvite);

    return convertFromOrganizationDBModel(dbOrganization);
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
      throw new AuthenticationError(ErrorType.Unauthorized);
    }

    const dbUser = await this._users.findOne({
      where: { id: userId },
      relations: ['organization'],
    });

    if (!dbUser) {
      throw new UserInputError(ErrorType.DoesNotExist, {
        field: 'userId',
      });
    }

    dbUser.organization = null;
    dbUser.organizationId = undefined;

    await this._users.save(dbUser);

    return org;
  }
}
