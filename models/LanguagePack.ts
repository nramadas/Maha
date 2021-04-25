import { Language } from '@/models/Language';

export interface LanguagePack {
  name: Language;
  translations: {
    [hash: string]: {
      reference: string;
      template: string;
      variations: {
        [variation: string]: string;
      };
    };
  };
}

export const DEFAULT: LanguagePack = {
  name: Language.en,
  translations: {},
};
