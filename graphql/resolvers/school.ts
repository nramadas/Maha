import { ValidationError } from 'apollo-server-micro';
import { FieldResolver, Resolver, Root } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Property as PropertyEntity } from '@/db/entities/Property';
import { School as SchoolEntity } from '@/db/entities/School';
import { Property } from '@/graphql/types/Property';
import { School } from '@/graphql/types/School';
import { ErrorType } from '@/lib/errors/type';
import { convertFromDBModel as convertFromPropertyDBModel } from '@/lib/modelConversions/property';

@Resolver(of => School)
export class SchoolResolver {
  constructor(
    @InjectRepository(PropertyEntity)
    private readonly _properties: Repository<PropertyEntity>,
    @InjectRepository(SchoolEntity)
    private readonly _schools: Repository<SchoolEntity>,
  ) {}

  @FieldResolver(type => [Property], {
    description: 'All properties close to this school',
  })
  async nearbyProperties(@Root() school: School) {
    const dbSchool = await this._schools.findOne({
      where: { id: school.id },
      relations: ['nearbyProperties'],
    });

    if (!dbSchool) {
      throw new ValidationError(ErrorType.SomethingElse);
    }

    return (dbSchool.nearbyProperties || []).map(convertFromPropertyDBModel);
  }
}
