import { registerEnumType } from 'type-graphql';

import { Metropolitan } from '@/models/Metropolitan';

registerEnumType(Metropolitan, {
  name: 'Metropolitan',
  description: 'Metropolitan areas',
});

export { Metropolitan };
