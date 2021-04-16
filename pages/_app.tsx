import Cookies from 'js-cookie';
import { AppProps } from 'next/app';
import React from 'react';

import '@/styles/fonts.css';
import '@/styles/normalize.css';

import { JWTRefresh } from '@/components/JWTRefresh';
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
  const jwt = Cookies.get('token');
  const aut = Cookies.get('authn');

  return (
    <>
      <JWTProvider
        initialJwt={jwt}
        initialAut={aut}
        preserveJwt={jwt => Cookies.set('token', jwt)}
        preserveAut={aut => Cookies.set('authn', aut)}
      >
        <URQLProvider>
          <JWTRefresh />
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
