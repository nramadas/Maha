import { Ctx, FieldResolver, Resolver, Root } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Media as MediaEntity } from '@/db/entities/Media';
import { Role as RoleEntity } from '@/db/entities/Role';
import { User as UserEntity } from '@/db/entities/User';
import { Context } from '@/graphql/context';
import * as errors from '@/graphql/errors';
import { Media } from '@/graphql/types/Media';
import { MediaParentType } from '@/graphql/types/MediaParentType';
import { Organization } from '@/graphql/types/Organization';
import { Permission } from '@/graphql/types/Permission';
import { Role } from '@/graphql/types/Role';
import { User } from '@/graphql/types/User';
import { convertFromDBModel as convertFromMediaDBModel } from '@/lib/modelConversions/media';
import { convertFromDBModel as convertFromOrganizationDBModel } from '@/lib/modelConversions/organization';
import { convertFromDBModel as convertFromRoleDBModel } from '@/lib/modelConversions/role';
import { fromRoles } from '@/lib/permissions/fromRoles';
import { hasPermission } from '@/lib/permissions/hasPermission';

@Resolver(of => User)
export class UserResolver {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly _media: Repository<MediaEntity>,
    @InjectRepository(RoleEntity)
    private readonly _roles: Repository<RoleEntity>,
    @InjectRepository(UserEntity)
    private readonly _users: Repository<UserEntity>,
  ) {}

  @FieldResolver(type => [Media], {
    description: 'All the media for this property',
  })
  async media(@Root() root: User) {
    const dbMedia = await this._media.find({
      where: { parentId: root.id, parentType: MediaParentType.User },
    });

    return dbMedia.map(convertFromMediaDBModel);
  }

  @FieldResolver(type => [Permission], {
    description: 'A list of permissions this user has',
  })
  async permissions(@Ctx() ctx: Context, @Root() root: User) {
    const roles = await this.roles(ctx, root);
    return fromRoles(roles);
  }

  @FieldResolver(type => [Role], {
    description: 'The roles that this users is assigned to',
  })
  async roles(@Ctx() ctx: Context, @Root() root: User) {
    const { me, roles } = ctx;

    if (!me) {
      throw new errors.Unauthorized();
    }

    if (root.id !== me.id && !hasPermission(Permission.ModifyRoles, roles)) {
      throw new errors.Unauthorized();
    }

    const dbUser = await this._users.findOne({
      where: { id: root.id },
      relations: ['roles'],
    });

    if (!dbUser) {
      return [];
    }

    return dbUser.roles.map(convertFromRoleDBModel);
  }

  @FieldResolver(type => Organization, {
    description: 'Which, if any, organization this user is a part of',
    nullable: true,
  })
  async organization(@Root() root: User) {
    const dbUser = await this._users.findOne({
      where: { id: root.id },
      relations: ['organization'],
    });

    if (!dbUser || !dbUser.organization) {
      return null;
    }

    return convertFromOrganizationDBModel(dbUser.organization);
  }
}
