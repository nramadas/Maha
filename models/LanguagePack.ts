export interface LanguagePack<L extends string> {
  name: L;
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

export const DEFAULT: LanguagePack<'default'> = {
  name: 'default',
  translations: {},
};
