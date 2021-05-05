import { Field, ObjectType, ID } from 'type-graphql';

import { Location } from '@/graphql/types/Location';
import { SchoolType } from '@/graphql/types/SchoolType';
import { School as SchoolModel } from '@/models/School';

@ObjectType({ description: 'A school' })
export class School implements SchoolModel {
  @Field(type => ID, { description: 'School ID' })
  id!: SchoolModel['id'];

  @Field(type => ID, {
    description: 'The ID google associates with this school',
    nullable: true,
  })
  googleId?: SchoolModel['googleId'];

  @Field({ description: 'The name of the school' })
  name!: string;

  @Field({ description: 'Where the school is located' })
  location!: Location;

  @Field({ description: 'The type of school', nullable: true })
  type?: SchoolType;
}
