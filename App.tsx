import { Buffer } from 'buffer';

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components/native';

import { JWTRefresh } from '@/components/JWTRefresh';
import { JWTProvider } from '@/contexts/JWT';
import { LanguagePackProvider } from '@/contexts/LanguagePack';
import { URQLProvider } from '@/contexts/URQL';
import { createColors } from '@/lib/theme/createColors';
import { DEFAULT as DEFAULT_LANGUAGE_PACK } from '@/models/LanguagePack';
import useCachedResources from '@/native/hooks/useCachedResources';
import Navigation from '@/native/navigation';

global.Buffer = Buffer;

if (Platform.OS === 'android') {
  require('intl');
  require('intl/locale-data/jsonp/en');
}

function makeTheme() {
  return {
    ...createColors(),
    font: 'Oswald',
  };
}

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <JWTProvider>
        <URQLProvider>
          <JWTRefresh />
          <LanguagePackProvider
            initialLanguagePack={DEFAULT_LANGUAGE_PACK}
            getLanguagePack={language => Promise.resolve(DEFAULT_LANGUAGE_PACK)}
          >
            <ThemeProvider theme={makeTheme()}>
              <SafeAreaProvider>
                <Navigation colorScheme="dark" />
                <StatusBar />
              </SafeAreaProvider>
            </ThemeProvider>
          </LanguagePackProvider>
        </URQLProvider>
      </JWTProvider>
    );
  }
}
