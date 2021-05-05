import { registerEnumType } from 'type-graphql';

import { UtilityConfiguration } from '@/models/UtilityConfiguration';

registerEnumType(UtilityConfiguration, {
  name: 'UtilityConfiguration',
  description: 'How the utility is integrated with the property',
  valuesConfig: {
    Central: {
      description: 'This utility is centrally integrated',
    },
    PerRoom: {
      description: 'This utility exists on a per-room basis',
    },
    None: {
      description: 'This utility does not exist',
    },
  },
});

export { UtilityConfiguration };
