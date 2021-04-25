import { Field, ObjectType, ID } from 'type-graphql';

import { MediaType } from '@/graphql/types/MediaType';
import { Media as MediaModel } from '@/models/Media';
import { MediaType as MediaTypeModel } from '@/models/MediaType';

@ObjectType({ description: 'A media object' })
export class Media implements MediaModel {
  @Field(type => ID, { description: 'An id for this media' })
  id!: MediaModel['id'];

  @Field({ description: 'A url for the media' })
  src!: string;

  @Field(type => MediaType, { description: 'What kind of media it is' })
  type!: MediaTypeModel;
}
