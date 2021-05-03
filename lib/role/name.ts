import { i18n } from '@/lib/translate';
import { CommonRoleType } from '@/models/CommonRoleType';
import { Role } from '@/models/Role';

export function name(role: Pick<Role, 'name'>) {
  switch (role.name) {
    case CommonRoleType.Owner:
      return i18n.translate`Owner`;
    case CommonRoleType.Manager:
      return i18n.translate`Manager`;
    case CommonRoleType.SalesAgent:
      return i18n.translate`Sales Agent`;
    default:
      return () => role.name;
  }
}
