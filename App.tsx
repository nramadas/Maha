import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components/native';

import { createColors } from '@/lib/theme/createColors';
import useCachedResources from '@/native/hooks/useCachedResources';
import Navigation from '@/native/navigation';

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
      <ThemeProvider theme={makeTheme()}>
        <SafeAreaProvider>
          <Navigation colorScheme="dark" />
          <StatusBar />
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }
}
