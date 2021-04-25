import { registerEnumType } from 'type-graphql';

import { PropertyCondition } from '@/models/PropertyCondition';

registerEnumType(PropertyCondition, {
  name: 'PropertyCondition',
  description: '',
  valuesConfig: {
    New: {
      description: 'This property has no previous owners',
    },
    Resale: {
      description: 'This property has been owned before',
    },
    Unknown: {
      description: 'It cannot be determined if this property is new or not',
    },
  },
});

export { PropertyCondition };
