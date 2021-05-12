import { Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Invite as InviteEntity } from '@/db/entities/Invite';
import { Media as MediaEntity } from '@/db/entities/Media';
import { Organization as OrganizationEntity } from '@/db/entities/Organization';
import { Property as PropertyEntity } from '@/db/entities/Property';
import { Role as RoleEntity } from '@/db/entities/Role';
import { User as UserEntity } from '@/db/entities/User';
import { MyPermissions } from '@/graphql/decorators';
import { buildOrganizationPage } from '@/graphql/helpers/buildOrganizationPage';
import { Invite } from '@/graphql/types/Invite';
import { Media } from '@/graphql/types/Media';
import { MediaParentType } from '@/graphql/types/MediaParentType';
import { Organization } from '@/graphql/types/Organization';
import { OrganizationPage } from '@/graphql/types/OrganizationPage';
import { Permission } from '@/graphql/types/Permission';
import { Property } from '@/graphql/types/Property';
import { Role } from '@/graphql/types/Role';
import { User } from '@/graphql/types/User';
import { convertFromDBModel as convertFromInviteDBModel } from '@/lib/modelConversions/invite';
import { convertFromDBModel as convertFromMediaDBModel } from '@/lib/modelConversions/media';
import { convertFromDBModel as convertFromPropertyDBModel } from '@/lib/modelConversions/property';
import { convertFromDBModel as convertFromRoleDBModel } from '@/lib/modelConversions/role';
import { convertFromDBModel as convertFromUserDBModel } from '@/lib/modelConversions/user';

@Resolver(of => Organization)
export class OrganizationResolver {
  constructor(
    @InjectRepository(InviteEntity)
    private readonly _invites: Repository<InviteEntity>,
    @InjectRepository(MediaEntity)
    private readonly _media: Repository<MediaEntity>,
    @InjectRepository(OrganizationEntity)
    private readonly _organizations: Repository<OrganizationEntity>,
    @InjectRepository(PropertyEntity)
    private readonly _properties: Repository<PropertyEntity>,
    @InjectRepository(RoleEntity)
    private readonly _roles: Repository<RoleEntity>,
    @InjectRepository(UserEntity)
    private readonly _users: Repository<UserEntity>,
  ) {}

  @FieldResolver(type => [Media], {
    description: 'All the media for this property',
  })
  async media(@Root() root: Organization) {
    const dbMedia = await this._media.find({
      where: { parentId: root.id, parentType: MediaParentType.Organization },
    });

    return dbMedia.map(convertFromMediaDBModel);
  }

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

  @FieldResolver(type => [Property], {
    description: 'Returns all the properties belonging to this organization',
  })
  async properties(@Root() root: Organization) {
    const dbProperties = await this._properties.find({
      where: { organizationId: root.id },
    });

    return dbProperties.map(convertFromPropertyDBModel);
  }

  @Authorized(Permission.ModifyRoles)
  @FieldResolver(type => [Role], {
    description:
      'All the roles that members of this organization can be assigned',
  })
  async roles(@Root() root: Organization) {
    const dbRoles = await this._roles.find({
      where: { organizationId: root.id },
    });

    return dbRoles.map(convertFromRoleDBModel);
  }
}
