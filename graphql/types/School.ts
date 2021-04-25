import { Field, ObjectType, ID } from 'type-graphql';

import { Place } from '@/graphql/types/Place';
import { Place as PlaceModel } from '@/models/Place';
import { School as SchoolModel } from '@/models/School';

@ObjectType({ description: 'A school' })
export class School implements SchoolModel {
  @Field(type => ID, { description: 'User ID' })
  id!: SchoolModel['id'];

  @Field({ description: 'The name of the school' })
  name!: string;

  @Field(type => Place, { description: "The user's last name" })
  location!: PlaceModel;
}
