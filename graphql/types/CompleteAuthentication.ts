import { Field, InputType } from 'type-graphql';

@InputType({ description: 'Credentials required to complete authentication' })
export class CompleteAuthenticationInput {
  @Field({ description: "The User's email" })
  email!: string;

  @Field({ description: 'JWT token used to complete the authentication' })
  token!: string;
}
