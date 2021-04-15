import Cookies from 'js-cookie';
import { AppProps } from 'next/app';
import React from 'react';

import '@/styles/fonts.css';
import '@/styles/normalize.css';

import { DialogProvider } from '@/contexts/Dialog';
import { JWTProvider } from '@/contexts/JWT';
import { TooltipProvider } from '@/contexts/Tooltip';
import { URQLProvider } from '@/contexts/URQL';

function getBody() {
  if (typeof window === 'undefined') {
    return null;
  } else {
    return document.body;
  }
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const token = Cookies.get('token');

  return (
    <>
      <JWTProvider
        initialJwt={token}
        preserveJwt={jwt => Cookies.set('token', jwt)}
      >
        <URQLProvider>
          <DialogProvider getContainer={getBody}>
            <TooltipProvider getContainer={getBody}>
              <Component {...pageProps} />
            </TooltipProvider>
          </DialogProvider>
        </URQLProvider>
      </JWTProvider>
    </>
  );
}
