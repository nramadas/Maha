import { Field, ObjectType } from 'type-graphql';

import { Place } from '@/graphql/types/Place';
import { Places as PlacesModel } from '@/models/Places';

@ObjectType({ description: 'A list of places ' })
export class Places implements PlacesModel {
  @Field(type => [Place], { description: 'The full address of the place ' })
  places!: Place[];
}
