import { useContext } from 'react';

import {
  LanguagePackContext,
  LanguagePackDetails,
} from '@/contexts/LanguagePack';

export function useSetLanguage() {
  const details = useContext(LanguagePackContext) as LanguagePackDetails;
  return details.setLanguage;
}
