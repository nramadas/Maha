import { registerEnumType } from 'type-graphql';

import { Permission } from '@/models/Permission';

registerEnumType(Permission, {
  name: 'Permission',
  description: 'User permissions to access various resources',
  valuesConfig: {
    ManageMembers: {
      description: 'Can add/remove members and assign roles to members',
    },
    ManageProperties: {
      description: 'Can add/remove properties and change their data',
    },
    ManageSales: {
      description: 'Can remove leads, set up visits, etc',
    },
    ModifyRoles: {
      description: 'Can add/remove roles, and set roles for each user',
    },
    ViewInsights: {
      description: 'Can view insights',
    },
    ViewMembers: {
      description: 'Can view all the members of the organization',
    },
    ViewProperties: {
      description: 'Can view properties',
    },
    ViewSales: {
      description: 'Can view sales',
    },
  },
});

export { Permission };
