import { registerEnumType } from 'type-graphql';

import { Permission } from '@/models/Permission';

registerEnumType(Permission, {
  name: 'Permission',
  description: '',
  valuesConfig: {
    ModifyRoles: {
      description: 'Can add/remove roles, and set roles for each user',
    },
    ViewMembers: {
      description: 'Can view all the members of the organization',
    },
  },
});

export { Permission };
