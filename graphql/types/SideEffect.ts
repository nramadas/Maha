import { ObjectType, Field } from 'type-graphql';

@ObjectType({ description: 'Side Effect' })
export class SideEffect {
  @Field({ description: 'Whether or not the side effect succeeded' })
  ok!: boolean;
}
