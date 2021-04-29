import { createParamDecorator } from 'type-graphql';

import { Context } from '@/graphql/context';
import { fromRoles } from '@/lib/permissions/fromRoles';

export function MyPermissions() {
  return createParamDecorator<Context>(({ context }) =>
    fromRoles(context.roles),
  );
}
