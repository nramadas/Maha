import { Field, ObjectType } from 'type-graphql';

import { Location } from '@/graphql/types/Location';

@ObjectType({ description: 'Return type for address autocomplete' })
export class AddressMatch extends Location {
  @Field({ description: 'The ID google associated with this address' })
  googleId!: string;
}
