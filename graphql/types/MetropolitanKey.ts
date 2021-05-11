import { registerEnumType } from 'type-graphql';

import { MetropolitanKey } from '@/models/MetropolitanKey';

registerEnumType(MetropolitanKey, {
  name: 'MetropolitanKey',
  description: 'Metropolitan areas',
});

export { MetropolitanKey };
