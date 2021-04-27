import { createParamDecorator } from 'type-graphql';

import { Context } from '@/graphql/context';

export function Me() {
  return createParamDecorator<Context>(({ context }) => context.me);
}
