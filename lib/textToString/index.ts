import type { LanguagePack } from '@/models/LanguagePack';
import type { Text } from '@/models/Text';

export function textToString(text: Text, languagePack: LanguagePack) {
  if (typeof text === 'string') {
    return text;
  }

  return text(languagePack);
}
