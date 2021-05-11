import { FieldResolver, Resolver, Root } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Property as PropertyEntity } from '@/db/entities/Property';
import { Metropolitan } from '@/graphql/types/Metropolitan';
import { Property } from '@/graphql/types/Property';
import { ENABLED_METROPOLITANS } from '@/lib/flags/metropolitan';
import { convertFromDBModel as convertFromPropertyDBModel } from '@/lib/modelConversions/property';

@Resolver(of => Metropolitan)
export class MetropolitanResolver {
  constructor(
    @InjectRepository(PropertyEntity)
    private readonly _properties: Repository<PropertyEntity>,
  ) {}

  @FieldResolver(type => Boolean, {
    description: 'Whether or not the metropolitan is enabled',
  })
  async enabled(@Root() metropolitan: Metropolitan) {
    return ENABLED_METROPOLITANS.has(metropolitan.key);
  }

  @FieldResolver(type => [Property], {
    description: 'Returns the properties located in this metropolitan',
  })
  async properties(@Root() metropolitan: Metropolitan) {
    const dbProperties = await this._properties.find({
      where: { metropolitanKey: metropolitan.key },
    });

    return dbProperties.map(convertFromPropertyDBModel);
  }
}
