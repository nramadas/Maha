import { Field, InputType } from 'type-graphql';

import { Location as LocationModel } from '@/models/Location';

@InputType({ description: 'Location description' })
export class CreateLocation implements LocationModel {
  @Field({ description: 'The full address' })
  address!: string;

  @Field({ description: 'Lattitude', nullable: true })
  lat?: number;

  @Field({ description: 'Longitude', nullable: true })
  lng?: number;
}
