import { registerEnumType } from 'type-graphql';

import { Gender } from '@/models/Gender';

registerEnumType(Gender, {
  name: 'Gender',
  description: 'Genders',
  valuesConfig: {
    Male: {
      description: 'Male',
    },
    Female: {
      description: 'Female',
    },
    Other: {
      description: 'Other',
    },
  },
});

export { Gender };
