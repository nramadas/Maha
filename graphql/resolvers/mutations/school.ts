import { Arg, Authorized, Mutation, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Property as PropertyEntity } from '@/db/entities/Property';
import { School as SchoolEntity } from '@/db/entities/School';
import { CreateSchool } from '@/graphql/types/CreateSchool';
import { Permission } from '@/graphql/types/Permission';
import { School } from '@/graphql/types/School';
import { convertFromDBModel as convertFromSchoolDBModel } from '@/lib/modelConversions/school';

@Resolver(of => School)
export class SchoolMutationResolver {
  constructor(
    @InjectRepository(PropertyEntity)
    private readonly _properties: Repository<PropertyEntity>,
    @InjectRepository(SchoolEntity)
    private readonly _schools: Repository<SchoolEntity>,
  ) {}

  @Authorized(Permission.ManageProperties)
  @Mutation(returns => School, { description: 'Create a new school' })
  async createSchool(@Arg('school') school: CreateSchool) {
    if (school.googleId) {
      const existingSchool = await this._schools.findOne({
        where: { googleId: school.googleId },
      });

      if (existingSchool) {
        return convertFromSchoolDBModel(existingSchool);
      }
    }

    const newSchool = this._schools.create({
      googleId: school.googleId,
      name: school.name,
      type: school.type,
      data: { location: school.location },
    });

    await this._schools.save(newSchool);
    return convertFromSchoolDBModel(newSchool);
  }
}
