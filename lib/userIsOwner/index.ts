import { CommonRoleType } from '@/models/CommonRoleType';
import { Role } from '@/models/Role';

interface User {
  roles: Pick<Role, 'name'>[];
}

export function userIsOwner(user: User) {
  for (const role of user.roles) {
    if (role.name === CommonRoleType.Owner) {
      return true;
    }
  }

  return false;
}
