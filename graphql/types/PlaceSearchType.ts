import { registerEnumType } from 'type-graphql';

import { PlaceSearchType } from '@/models/PlaceSearchType';

registerEnumType(PlaceSearchType, {
  name: 'PlaceSearchType',
  description: 'Types of places to search for',
  valuesConfig: {
    School: {
      description: 'Search for schools',
    },
  },
});

export { PlaceSearchType };
