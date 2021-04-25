import { registerEnumType } from 'type-graphql';

import { MediaType } from '@/models/MediaType';

registerEnumType(MediaType, {
  name: 'MediaType',
  description: '',
  valuesConfig: {
    Image: {
      description: 'An image (ex: png, jpeg, etc)',
    },
    Video: {
      description: 'A video (ex: mp4)',
    },
    Blueprint: {
      description: 'A blueprint file. Note: Should this exist?',
    },
  },
});

export { MediaType };
