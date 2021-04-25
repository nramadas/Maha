import React, { createContext, useCallback, useState } from 'react';

import { Language } from '@/models/Language';
import { LanguagePack as LanguagePackModel } from '@/models/LanguagePack';

interface Props {
  children?: React.ReactNode;
  initialLanguagePack: LanguagePackModel;
  getLanguagePack: (language: Language) => Promise<LanguagePackModel>;
}

export interface LanguagePackDetails {
  languagePack: LanguagePackModel;
  setLanguage(language: Language): void;
}

export const LanguagePackContext = createContext<Partial<LanguagePackDetails>>(
  {},
);

export function LanguagePackProvider(props: Props) {
  const { children, initialLanguagePack, getLanguagePack } = props;
  const [languagePack, setLanguagePack] = useState(initialLanguagePack);

  const setLanguage = useCallback(
    async newLanguage => {
      const newLanguagePack = await getLanguagePack(newLanguage);
      setLanguagePack(newLanguagePack);
    },
    [setLanguagePack],
  );

  return (
    <LanguagePackContext.Provider value={{ languagePack, setLanguage }}>
      {children}
    </LanguagePackContext.Provider>
  );
}
