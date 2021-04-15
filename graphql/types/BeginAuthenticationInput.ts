import { Field, InputType } from 'type-graphql';

@InputType({ description: 'Credentials required to begin authentication' })
export class BeginAuthenticationInput {
  @Field({ description: "The User's email" })
  email!: string;
}
