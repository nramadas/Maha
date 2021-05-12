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
}
