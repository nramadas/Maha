import isNil from 'lodash/isNil';
import { Arg, Authorized, ID, Mutation, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Media as MediaEntity } from '@/db/entities/Media';
import { Organization as OrganizationEntity } from '@/db/entities/Organization';
import { Property as PropertyEntity } from '@/db/entities/Property';
import { School as SchoolEntity } from '@/db/entities/School';
import { User as UserEntity } from '@/db/entities/User';
import { MyOrganization } from '@/graphql/decorators';
import * as errors from '@/graphql/errors';
import { CreateProperty } from '@/graphql/types/CreateProperty';
import { EditProperty } from '@/graphql/types/EditProperty';
import { MediaParentType } from '@/graphql/types/MediaParentType';
import { Organization } from '@/graphql/types/Organization';
import { Permission } from '@/graphql/types/Permission';
import { Property } from '@/graphql/types/Property';
import { convertFromDBModel as convertFromPropertyDBModel } from '@/lib/modelConversions/property';
import { removeUndefinedKeys } from '@/lib/removeUndefinedKeys';

@Resolver(of => Property)
export class PropertyMutationResolver {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly _media: Repository<MediaEntity>,
    @InjectRepository(OrganizationEntity)
    private readonly _organizations: Repository<OrganizationEntity>,
    @InjectRepository(PropertyEntity)
    private readonly _properties: Repository<PropertyEntity>,
    @InjectRepository(SchoolEntity)
    private readonly _schools: Repository<SchoolEntity>,
    @InjectRepository(UserEntity)
    private readonly _users: Repository<UserEntity>,
  ) {}

  @Authorized(Permission.ManageProperties)
  @Mutation(returns => Property, {
    description: 'Create a new property',
  })
  async createProperty(
    @MyOrganization() org: Organization | null,
    @Arg('property') property: CreateProperty,
  ) {
    if (!org) {
      throw new errors.Unauthorized();
    }

    const { mediaIds, metropolitanKey, schoolIds, ...rest } = property;

    const dbMedia = mediaIds
      ? await this._media.find({ where: mediaIds.map(id => ({ id })) })
      : [];

    for (const media of dbMedia) {
      if (media.parentId) {
        throw new errors.AlreadyAssigned('mediaIds', media.id);
      }
    }

    const dbSchools = schoolIds
      ? await this._schools.find({ where: schoolIds.map(id => ({ id })) })
      : [];

    const newProperty = this._properties.create({
      organizationId: org.id,
      metropolitanKey,
      data: removeUndefinedKeys(rest),
    });

    if (dbSchools.length) {
      newProperty.schools = dbSchools;
    }

    await this._properties.save(newProperty);

    await Promise.all(
      dbMedia.map(media => {
        media.parentId = newProperty.id;
        media.parentType = MediaParentType.Property;
        return this._media.save(media);
      }),
    );

    return convertFromPropertyDBModel(newProperty);
  }

  @Authorized(Permission.ManageProperties)
  @Mutation(returns => Property, {
    description: 'Removes a property',
  })
  async deleteProperty(
    @MyOrganization() org: Organization | null,
    @Arg('id', type => ID) id: string,
  ) {
    if (!org) {
      throw new errors.Unauthorized();
    }

    const property = await this._properties.findOne({ where: { id } });

    if (!property) {
      throw new errors.DoesNotExist('id', id);
    }

    const propertyModel = convertFromPropertyDBModel(property);
    await this._properties.delete(property.id);
    return propertyModel;
  }

  @Authorized(Permission.ManageProperties)
  @Mutation(returns => Property, {
    description: 'Make changes to a property',
  })
  async editProperty(
    @MyOrganization() org: Organization | null,
    @Arg('property') property: EditProperty,
  ) {
    if (!org) {
      throw new errors.Unauthorized();
    }

    const dbProperty = await this._properties.findOne({
      where: { id: property.id },
    });

    if (!dbProperty) {
      throw new errors.DoesNotExist('property.id', property.id);
    }

    if (org.id !== dbProperty.organizationId) {
      throw new errors.Unauthorized();
    }

    const { id, mediaIds, metropolitanKey, schoolIds, ...rest } = property;

    const dbMedia = mediaIds
      ? await this._media.find({ where: mediaIds.map(id => ({ id })) })
      : [];

    const dbCurrentMedia = await this._media.find({
      where: { parentId: dbProperty.id, parentType: MediaParentType.Property },
    });

    const mediaIdsSet = new Set(mediaIds);
    const newMedia: MediaEntity[] = [];

    for (const media of dbMedia) {
      if (!isNil(media.parentId) && media.parentId !== id) {
        throw new errors.AlreadyAssigned('mediaIds', media.id);
      } else if (!media.parentId) {
        newMedia.push(media);
      }
    }

    const expiredMedia: MediaEntity[] = [];

    for (const media of dbCurrentMedia) {
      if (!mediaIdsSet.has(media.id)) {
        expiredMedia.push(media);
      }
    }

    const dbSchools = schoolIds
      ? await this._schools.find({ where: schoolIds.map(id => ({ id })) })
      : [];

    dbProperty.data = removeUndefinedKeys(rest);
    dbProperty.metropolitanKey = metropolitanKey;
    dbProperty.schools = dbSchools;

    await this._properties.save(dbProperty);

    await Promise.all([
      ...([] as any[]), // just for typescript
      ...newMedia.map(media => {
        media.parentId = dbProperty.id;
        media.parentType = MediaParentType.Property;
        return this._media.save(media);
      }),
      ...expiredMedia.map(media => {
        return this._media.delete(media.id);
      }),
    ]);

    return convertFromPropertyDBModel(dbProperty);
  }
}
