import { createParamDecorator } from 'type-graphql';

import { Context } from '@/graphql/context';

export function MyOrganization() {
  return createParamDecorator<Context>(({ context }) => context.organization);
}
