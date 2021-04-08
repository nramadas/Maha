import { Field, ObjectType } from 'type-graphql';

import { Place as PlaceModel } from '@/models/Place';

@ObjectType({ description: 'A place; house, flat, etc ' })
export class Place implements PlaceModel {
  @Field({ description: 'The full address of the place ' })
  address!: string;
}
