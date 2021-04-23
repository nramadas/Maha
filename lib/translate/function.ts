import { useLanguagePack } from '@/hooks/useLanguagePack';

import calculateHash from './hash.js';
import { Param } from './param';
import { substitute } from './substitute';

type LanguagePack = ReturnType<typeof useLanguagePack>;

interface ParamObj extends Param {
  value: string;
}

export function makeText(
  strings: TemplateStringsArray,
  substitutions: ParamObj[],
) {
  const textParts: string[] = [];
  strings.forEach((string, index) => {
    textParts.push(string);

    if (index !== strings.length - 1) {
      textParts.push(`%%${substitutions[index].name}`);
    }
  });

  return textParts.join('');
}

export function translate(
  strings: TemplateStringsArray,
  ...substitutions: ParamObj[]
) {
  const text = makeText(strings, substitutions);
  const hash = calculateHash(text);

  return (languagePack: LanguagePack) => {
    const translation = languagePack.translations[hash] || {
      template: text,
      reference: text,
      variations: {
        [hash]: text,
      },
    };

    const phrases = substitute({
      translation,
      substitutions,
      getParam: s => s,
      getValue: s => s.value,
    });

    return phrases.join('');
  };
}
