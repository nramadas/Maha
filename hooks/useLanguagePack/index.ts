import { useContext } from 'react';

import {
  LanguagePackContext,
  LanguagePackDetails,
} from '@/contexts/LanguagePack';

export function useLanguagePack() {
  const details = useContext(LanguagePackContext) as LanguagePackDetails;
  return details.languagePack;
}
