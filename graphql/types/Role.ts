import { registerEnumType } from 'type-graphql';

import { Role } from '@/models/Role';

registerEnumType(Role, {
  name: 'Role',
  description: 'Different roles a User can acquire',
  valuesConfig: {
    Agent: {
      description: 'A user that works for a property developer',
    },
    Customer: {
      description: 'A user that is interested in purchasing a property',
    },
    Manager: {
      description: 'A user that is able to manage Agents',
    },
    Owner: {
      description: 'The owner of a property development organization',
    },
  },
});

export { Role };
