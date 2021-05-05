import { Field, ObjectType, ID } from 'type-graphql';

import { MediaParentType } from '@/graphql/types/MediaParentType';
import { MediaType } from '@/graphql/types/MediaType';
import { Media as MediaModel } from '@/models/Media';

@ObjectType({ description: 'A media object' })
export class Media implements MediaModel {
  @Field(type => ID, { description: 'An id for this media' })
  id!: MediaModel['id'];

  @Field({ description: 'When the Media was uploaded' })
  created!: Date;

  @Field(type => ID, {
    description: "ID of the media's parent",
    nullable: true,
  })
  parentId?: string;

  @Field(type => MediaParentType, {
    description: "Type of the media's parent",
    nullable: true,
  })
  parentType?: MediaParentType;

  @Field({ description: 'A url for the media' })
  src!: string;

  @Field(type => MediaType, { description: 'What kind of media it is' })
  type!: MediaType;
}
