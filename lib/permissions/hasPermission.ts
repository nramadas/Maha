import { fromRoles } from '@/lib/permissions/fromRoles';
import { Permission } from '@/models/Permission';
import { Role } from '@/models/Role';

export function hasPermission(permission: Permission, roles: Role[]) {
  return fromRoles(roles).has(permission);
}
