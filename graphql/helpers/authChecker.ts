import { AuthChecker } from 'type-graphql';

import { Context } from '@/graphql/context';
import { fromRoles } from '@/lib/permissions/fromRoles';
import { userIsAdmin } from '@/lib/permissions/userIsAdmin';
import { Organization } from '@/models/Organization';
import { Permission } from '@/models/Permission';

function getOrgId(
  root: any,
  context: Context,
  info: any,
): Organization['id'] | null {
  const type = info.path.typename;

  switch (type) {
    case 'Invite':
      return root.organizationId;
    case 'Organization':
      return root.id;
    case 'Role':
      return root.organizationId;
    case 'User':
      return root.organizationId;
    case 'Property':
      return root.organizationId;
    case 'Mutation':
      return context.organization?.id || null;
    default:
      return null;
  }
}

export const authChecker: AuthChecker<Context, Permission> = (
  { context, root, info },
  oneOf,
) => {
  // User must be logged in
  if (!context.me) {
    return false;
  }

  // Admin users are always authorized
  if (userIsAdmin(context.me)) {
    return true;
  }

  // Permissions exist within the scope of an organization. If the user does
  // not belong to any organizations, they are not authorized.
  if (!context.organization) {
    return false;
  }

  const availablePermissions = fromRoles(context.roles);

  // User must be assigned some roles
  if (!context.roles.length) {
    return false;
  }

  // User must belong to the correct organiztaion
  const orgId = getOrgId(root, context, info);

  if (!orgId || context.organization.id !== orgId) {
    return false;
  }

  // User doesn't need any special permissions, they just need to be a part of
  // the organization
  if (!oneOf || !oneOf.length) {
    return true;
  }

  // User belongs to the correct organization and hash atleast one of the
  // required permissions.
  for (const permission of oneOf) {
    if (availablePermissions.has(permission)) {
      return true;
    }
  }

  return false;
};
