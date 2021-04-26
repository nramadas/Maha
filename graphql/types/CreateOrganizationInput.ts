import { Field, InputType } from 'type-graphql';

@InputType({ description: 'Fields needed to create an organization' })
export class CreateOrganizationInput {
  @Field({ description: "The Organization's name" })
  name!: string;
}
