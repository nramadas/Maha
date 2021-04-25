import { Field, ObjectType } from 'type-graphql';

import { Language } from '@/graphql/types/Language';
import { Language as LanguageModel } from '@/models/Language';
import { LanguagePack as LanguagePackModel } from '@/models/LanguagePack';

@ObjectType({ description: 'A language pack' })
export class LanguagePack implements LanguagePackModel {
  @Field(type => Language, { description: 'Which language is this pack for' })
  name!: LanguageModel;

  @Field({ description: 'A list of translations' })
  translations!: LanguagePackModel['translations'];
}
