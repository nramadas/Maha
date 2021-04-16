import { Field, InputType } from 'type-graphql';

@InputType({ description: 'Credentials required to renew authentication' })
export class RefreshAuthenticationInput {
  @Field({ description: 'Refresh token used to generate a new jwt' })
  refreshToken!: string;
}
