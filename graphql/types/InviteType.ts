import { registerEnumType } from 'type-graphql';

import { InviteType } from '@/models/InviteType';

registerEnumType(InviteType, {
  name: 'InviteType',
  description: 'An enum of invite types',
  valuesConfig: {
    CreateOrganization: {
      description: 'Invite to create an organization',
    },
    JoinOrganization: {
      description: 'Invite to join an organization',
    },
    Unknown: {
      description: 'Unknown',
    },
  },
});

export { InviteType };
