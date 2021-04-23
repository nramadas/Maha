import { LanguagePack } from '@/models/LanguagePack';

import { Param, makeParamToken } from './param';

interface Options<S, R> {
  translation: LanguagePack<any>['translations'][string];
  substitutions: S[];
  getParam: (s: S) => Param;
  getValue: (s: S) => R;
}

export function substitute<S, R>(options: Options<S, R>) {
  const { translation, substitutions, getParam, getValue } = options;

  const variation = substitutions
    .map(options.getParam)
    .map(param => makeParamToken(param))
    .join('--');

  const baseTemplate = translation.template || translation.reference;
  const variationTemplate = translation.variations[variation];
  const template = variationTemplate || baseTemplate;

  let phrases: (string | R)[] = [template];

  substitutions.forEach(s => {
    const token = `%%${getParam(s).name}`;
    const newPhrases: (string | R)[] = [];

    phrases.forEach(phrase => {
      if (typeof phrase === 'string') {
        const parts = phrase.split(token);

        parts.forEach((part, index) => {
          if (part) {
            newPhrases.push(part);
          }

          if (index !== parts.length - 1) {
            newPhrases.push(getValue(s));
          }
        });
      } else {
        newPhrases.push(phrase);
      }
    });

    phrases = newPhrases;
  });

  return phrases;
}
