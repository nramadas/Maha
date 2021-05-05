import { Field, ObjectType } from 'type-graphql';

import { Location } from '@/graphql/types/Location';
import { Place as PlaceModel } from '@/models/Place';

@ObjectType({ description: 'A place returned by google search results' })
export class Place implements PlaceModel {
  @Field({ description: 'The ID that google gives the place' })
  googleId?: string;

  @Field({ description: 'The name of the place' })
  name!: string;

  @Field({ description: 'Where the place is located' })
  location!: Location;
}
