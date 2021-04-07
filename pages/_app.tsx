import React from 'react';
import '@/styles/normalize.css';

import { DialogProvider } from '@/contexts/Dialog';
import { TooltipProvider } from '@/contexts/Tooltip';

function getBody() {
  if (typeof window === 'undefined') {
    return null;
  } else {
    return document.body;
  }
}

export default function MyApp({ Component, pageProps }: any) {
  return (
    <>
      <DialogProvider getContainer={getBody}>
        <TooltipProvider getContainer={getBody}>
          <Component {...pageProps} />
        </TooltipProvider>
      </DialogProvider>
    </>
  );
}
