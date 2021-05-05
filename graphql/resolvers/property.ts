import { ValidationError } from 'apollo-server-micro';
import { Arg, Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Media as MediaEntity } from '@/db/entities/Media';
import { Organization as OrganizationEntity } from '@/db/entities/Organization';
import { Property as PropertyEntity } from '@/db/entities/Property';
import { School as SchoolEntity } from '@/db/entities/School';
import { Media } from '@/graphql/types/Media';
import { MediaParentType } from '@/graphql/types/MediaParentType';
import { Organization } from '@/graphql/types/Organization';
import { Permission } from '@/graphql/types/Permission';
import { Property } from '@/graphql/types/Property';
import { School } from '@/graphql/types/School';
import { SchoolType } from '@/graphql/types/SchoolType';
import { ErrorType } from '@/lib/errors/type';
import { convertFromDBModel as convertFromMediaDBModel } from '@/lib/modelConversions/media';
import { convertFromDBModel as convertFromOrganizationDBModel } from '@/lib/modelConversions/organization';
import { convertFromDBModel as convertFromSchoolDBModel } from '@/lib/modelConversions/school';

@Resolver(of => Property)
export class PropertyResolver {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly _media: Repository<MediaEntity>,
    @InjectRepository(OrganizationEntity)
    private readonly _organizations: Repository<OrganizationEntity>,
    @InjectRepository(PropertyEntity)
    private readonly _properties: Repository<PropertyEntity>,
    @InjectRepository(SchoolEntity)
    private readonly _schools: Repository<SchoolEntity>,
  ) {}

  @FieldResolver(type => [Media], {
    description: 'All the media for this property',
  })
  async media(@Root() root: Property) {
    const dbMedia = await this._media.find({
      where: { parentId: root.id, parentType: MediaParentType.Property },
    });

    return dbMedia.map(convertFromMediaDBModel);
  }

  @Authorized(Permission.ViewProperties)
  @FieldResolver(type => Organization, {
    description: 'The organization that this property belongs to',
  })
  async organization(@Root() root: Property) {
    const dbOrg = await this._organizations.findOne({
      where: { id: root.organizationId },
    });

    if (!dbOrg) {
      throw new ValidationError(ErrorType.SomethingElse);
    }

    return convertFromOrganizationDBModel(dbOrg);
  }

  @FieldResolver(type => String, {
    description: 'The name of the organization this property is a part of',
  })
  async organizationName(@Root() root: Property) {
    const dbOrg = await this._organizations.findOne({
      where: { id: root.organizationId },
    });

    if (!dbOrg) {
      throw new ValidationError(ErrorType.SomethingElse);
    }

    return dbOrg.name;
  }

  @FieldResolver(type => [School], {
    description: 'All the schools close to this property',
  })
  async schools(
    @Root() root: Property,
    @Arg('type', type => SchoolType, { nullable: true }) type?: SchoolType,
  ) {
    const dbProperty = await this._properties.findOne({
      where: { id: root.id },
      relations: ['schools'],
    });

    if (!dbProperty) {
      throw new ValidationError(ErrorType.SomethingElse);
    }

    const schools = dbProperty.schools;

    return schools
      .filter(school => {
        if (!type) {
          return true;
        }

        return school.type === type;
      })
      .map(convertFromSchoolDBModel);
  }
}
