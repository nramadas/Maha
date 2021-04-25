import { registerEnumType } from 'type-graphql';

import { UtilityWaterFilter } from '@/models/UtilityWaterFilter';

registerEnumType(UtilityWaterFilter, {
  name: 'UtilityWaterFilter',
  description: '',
  valuesConfig: {
    CentrallyFiltered: {
      description:
        'All water in the property is filtered in a central location',
    },
    TapFiltered: {
      description: 'Certain taps are filtered',
    },
    NoFilter: {
      description: 'None of the water is filtered',
    },
  },
});

export { UtilityWaterFilter };
