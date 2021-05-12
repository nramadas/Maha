import { Field, ObjectType } from 'type-graphql';

import { LocalizedStrings as LocalizedStringsModel } from '@/models/LocalizedStrings';

@ObjectType({ description: 'A map of translated strings' })
export class LocalizedStrings implements LocalizedStringsModel {
  @Field({ description: 'String in english', nullable: true })
  en?: string;
}
