import React, { createContext, useCallback, useState } from 'react';

import { LanguagePack as LanguagePackModel } from '@/models/LanguagePack';

interface Props<L extends string> {
  children?: React.ReactNode;
  initialLanguagePack: LanguagePackModel<L>;
  getLanguagePack: (language: L) => Promise<LanguagePackModel<L>>;
}

export interface LanguagePackDetails<L extends string> {
  languagePack: LanguagePackModel<L>;
  setLanguage(language: L): void;
}

export const LanguagePackContext = createContext<
  Partial<LanguagePackDetails<string>>
>({});

export function LanguagePackProvider<L extends string>(props: Props<L>) {
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
