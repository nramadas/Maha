import { Field, ObjectType } from 'type-graphql';

import { MapPoint as MapPointModel } from '@/models/MapPoint';

@ObjectType({ description: 'MapPoint description' })
export class MapPoint implements MapPointModel {
  @Field({ description: 'Latitude' })
  lat!: number;

  @Field({ description: 'Longitude' })
  lng!: number;
}
