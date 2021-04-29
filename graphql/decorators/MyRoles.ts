import { createParamDecorator } from 'type-graphql';

import { Context } from '@/graphql/context';

export function MyRoles() {
  return createParamDecorator<Context>(({ context }) => context.roles);
}
