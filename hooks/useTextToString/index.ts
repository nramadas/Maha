import { useLanguagePack } from '@/hooks/useLanguagePack';
import { textToString } from '@/lib/textToString';
import type { Text } from '@/models/Text';

export function useTextToString() {
  const languagePack = useLanguagePack();
  return (text: Text) => textToString(text, languagePack);
}
