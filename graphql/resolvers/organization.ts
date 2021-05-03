import { AuthenticationError, UserInputError } from 'apollo-server-micro';
import {
  Arg,
  Authorized,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Invite as InviteEntity } from '@/db/entities/Invite';
import { Organization as OrganizationEntity } from '@/db/entities/Organization';
import { Role as RoleEntity } from '@/db/entities/Role';
import { User as UserEntity } from '@/db/entities/User';
import { Me, MyOrganization, MyPermissions } from '@/graphql/decorators';
import { buildOrganizationPage } from '@/graphql/helpers/buildOrganizationPage';
import { CreateOrganizationInput } from '@/graphql/types/CreateOrganizationInput';
import { Invite } from '@/graphql/types/Invite';
import { Organization } from '@/graphql/types/Organization';
import { OrganizationPage } from '@/graphql/types/OrganizationPage';
import { Role } from '@/graphql/types/Role';
import { User } from '@/graphql/types/User';
import { PG_UNIQUE_VIOLATION } from '@/lib/errors/pg';
import { ErrorType } from '@/lib/errors/type';
import { convertFromDBModel as convertFromInviteDBModel } from '@/lib/modelConversions/invite';
import { convertFromDBModel as convertFromOrganizationDBModel } from '@/lib/modelConversions/organization';
import { convertFromDBModel as convertFromRoleDBModel } from '@/lib/modelConversions/role';
import { convertFromDBModel as convertFromUserDBModel } from '@/lib/modelConversions/user';
import { CommonRoleType } from '@/models/CommonRoleType';
import { InviteType as InviteTypeModel } from '@/models/InviteType';
import { Permission } from '@/models/Permission';

@Resolver(of => Organization)
export class OrganizationResolver {
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

  @Authorized(Permission.ViewMembers, Permission.ManageMembers)
  @FieldResolver(type => [User], {
    description: 'All the members of this organization',
  })
  async members(@Root() root: Organization) {
    const dbUsers = await this._users.find({
      where: { organizationId: root.id },
    });

    return dbUsers.map(convertFromUserDBModel);
  }

  @Authorized()
  @FieldResolver(returns => [OrganizationPage], {
    description: 'Returns the possible company pages the user can view',
  })
  async pages(@MyPermissions() permissions: Permission[]) {
    return buildOrganizationPage(permissions);
  }

  @Authorized(Permission.ManageMembers)
  @FieldResolver(type => [Invite], {
    description:
      'Returns all the pending invites originating from this organization',
  })
  async pendingInvites(@Root() root: Organization) {
    const dbInvites = await this._invites.find({
      where: { organizationId: root.id, expired: false },
    });

    return dbInvites.map(convertFromInviteDBModel);
  }

  @Authorized(Permission.ModifyRoles)
  @FieldResolver(type => [Role], {
    description: 'All the roles that members of this organization can acquire',
  })
  async roles(@Root() root: Organization) {
    const dbRoles = await this._roles.find({
      where: { organizationId: root.id },
    });

    return dbRoles.map(convertFromRoleDBModel);
  }

  @Query(returns => Organization, {
    description: "Given an Organization's id, return the organization",
    nullable: true,
  })
  async organizationById(@Arg('id', type => ID) id: string) {
    const org = await this._organizations.findOne(id);
    return org ? convertFromOrganizationDBModel(org) : null;
  }

  @Query(returns => Organization, {
    description: "Given an Organization's name, return the organization",
    nullable: true,
  })
  async organizationByName(@Arg('name') name: string) {
    const org = await this._organizations.findOne({ where: { name } });
    return org ? convertFromOrganizationDBModel(org) : null;
  }

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
