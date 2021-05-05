import { Field, ObjectType } from 'type-graphql';

import { Location as LocationModel } from '@/models/Location';

@ObjectType({ description: 'Location description' })
export class Location implements LocationModel {
  @Field({ description: 'The full address' })
  address!: string;

  @Field({ description: 'Latitude', nullable: true })
  lat?: number;

  @Field({ description: 'Longitude', nullable: true })
  lng?: number;
}
