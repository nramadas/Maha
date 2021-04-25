import { registerEnumType } from 'type-graphql';

import { AmenityAccess } from '@/models/AmenityAccess';

registerEnumType(AmenityAccess, {
  name: 'AmenityAccess',
  description: '',
  valuesConfig: {
    Private: {
      description: 'This amenity is available on a per-unit basis',
    },
    Shared: {
      description: 'This amenity is shared with others in the building',
    },
    None: {
      description: 'There is no access to this amenity',
    },
  },
});

export { AmenityAccess };
