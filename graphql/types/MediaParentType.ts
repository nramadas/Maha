import { registerEnumType } from 'type-graphql';

import { MediaParentType } from '@/models/MediaParentType';

registerEnumType(MediaParentType, {
  name: 'MediaParentType',
  description: 'What type of entity owns this media',
  valuesConfig: {
    Organization: {
      description: 'This media is associated with an Organization',
    },
    Property: {
      description: 'This media is associated with an Property',
    },
    User: {
      description: 'This media is associated with an User',
    },
  },
});

export { MediaParentType };
