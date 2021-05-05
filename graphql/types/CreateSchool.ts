import { Field, InputType, ID } from 'type-graphql';

import { CreateLocation } from '@/graphql/types/CreateLocation';
import { SchoolType } from '@/graphql/types/SchoolType';
import { School as SchoolModel } from '@/models/School';

@InputType({ description: 'A school' })
export class CreateSchool {
  @Field(type => ID, {
    description: 'The ID google associates with this school',
    nullable: true,
  })
  googleId?: SchoolModel['googleId'];

  @Field({ description: 'The name of the school' })
  name!: string;

  @Field({ description: 'Where the school is located' })
  location!: CreateLocation;

  @Field({ description: 'The type of school', nullable: true })
  type?: SchoolType;
}
