import { registerEnumType } from 'type-graphql';

import { UtilityGasType } from '@/models/UtilityGasType';

registerEnumType(UtilityGasType, {
  name: 'UtilityGasType',
  description: '',
  valuesConfig: {
    Integrated: {
      description: 'Gas lines are integrated into the property',
    },
    Canister: {
      description: 'Gas is provided via canisters',
    },
  },
});

export { UtilityGasType };
