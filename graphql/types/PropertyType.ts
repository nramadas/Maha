import { registerEnumType } from 'type-graphql';

import { PropertyType } from '@/models/PropertyType';

registerEnumType(PropertyType, {
  name: 'PropertyType',
  description: 'Various types of properties',
  valuesConfig: {
    Apartment: {
      description: 'Unit for rent',
    },
    Flat: {
      description: 'Purchaseable unit within a larger multi-unit structure',
    },
    House: {
      description: 'Unit is the only one on the property',
    },
  },
});

export { PropertyType };
