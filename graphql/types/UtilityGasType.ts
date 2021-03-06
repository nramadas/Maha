import { registerEnumType } from 'type-graphql';

import { UtilityGasType } from '@/models/UtilityGasType';

registerEnumType(UtilityGasType, {
  name: 'UtilityGasType',
  description: 'How the gas is integrated with the property',
  valuesConfig: {
    Integrated: {
      description: 'Gas lines are integrated into the property',
    },
    Canister: {
      description: 'Gas is provided via canisters',
    },
    None: {
      description: 'This utility does not exist',
    },
  },
});

export { UtilityGasType };
