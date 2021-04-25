import { registerEnumType } from 'type-graphql';

import { UtilityConfiguration } from '@/models/UtilityConfiguration';

registerEnumType(UtilityConfiguration, {
  name: 'UtilityConfiguration',
  description: '',
  valuesConfig: {
    Central: {
      description: 'This utility is centrally integrated',
    },
    PerRoom: {
      description: 'This utility exists on a per-room basis',
    },
  },
});

export { UtilityConfiguration };
