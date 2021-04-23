import { useContext } from 'react';

import {
  LanguagePackContext,
  LanguagePackDetails,
} from '@/contexts/LanguagePack';

export function useSetLanguage<L extends string>() {
  const details = useContext(LanguagePackContext) as LanguagePackDetails<L>;
  return details.setLanguage;
}
