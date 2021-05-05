import { registerEnumType } from 'type-graphql';

import { SchoolType } from '@/models/SchoolType';

registerEnumType(SchoolType, {
  name: 'SchoolType',
  description: 'Type of school',
  valuesConfig: {
    Matriculation: {
      description: 'Matriculation',
    },
    PrePrimary: {
      description: 'Pre-primary',
    },
    Primary: {
      description: 'Primary',
    },
    Secondary: {
      description: 'Secondary',
    },
    SeniorSecondary: {
      description: 'Senior-secondary',
    },
  },
});

export { SchoolType };
