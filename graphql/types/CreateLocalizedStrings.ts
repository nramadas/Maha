import { Field, InputType } from 'type-graphql';

import { LocalizedStrings as LocalizedStringsModel } from '@/models/LocalizedStrings';

@InputType({ description: 'A map of translated strings' })
export class CreateLocalizedStrings implements Partial<LocalizedStringsModel> {
  @Field({ description: 'String in english', nullable: true })
  en?: string;
}
