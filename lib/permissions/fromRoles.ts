import { CommonRoleType } from '@/models/CommonRoleType';
import { Permission } from '@/models/Permission';
import { Role } from '@/models/Role';

export function fromRoles(roles: Role[]) {
  const permissions = new Set<Permission>();

  roles.forEach(role => {
    if (role.name === CommonRoleType.Owner) {
      Object.values(Permission).forEach(p => permissions.add(p));
    } else {
      role.permissions.forEach(p => permissions.add(p));
    }
  });

  return permissions;
}
