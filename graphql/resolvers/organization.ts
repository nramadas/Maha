import { Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Invite as InviteEntity } from '@/db/entities/Invite';
import { Organization as OrganizationEntity } from '@/db/entities/Organization';
import { Role as RoleEntity } from '@/db/entities/Role';
import { User as UserEntity } from '@/db/entities/User';
import { MyPermissions } from '@/graphql/decorators';
import { buildOrganizationPage } from '@/graphql/helpers/buildOrganizationPage';
import { Invite } from '@/graphql/types/Invite';
import { Organization } from '@/graphql/types/Organization';
import { OrganizationPage } from '@/graphql/types/OrganizationPage';
import { Role } from '@/graphql/types/Role';
import { User } from '@/graphql/types/User';
import { convertFromDBModel as convertFromInviteDBModel } from '@/lib/modelConversions/invite';
import { convertFromDBModel as convertFromRoleDBModel } from '@/lib/modelConversions/role';
import { convertFromDBModel as convertFromUserDBModel } from '@/lib/modelConversions/user';
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
}
