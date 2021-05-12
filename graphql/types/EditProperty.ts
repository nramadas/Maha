import { InputType, Field, ID } from 'type-graphql';

import { CreateProperty } from '@/graphql/types/CreateProperty';

@InputType({ description: 'Fields needed to edit a property' })
export class EditProperty extends CreateProperty {
  @Field(type => ID, {
    description: 'The ID of the property you want to change',
  })
  id!: string;
}
