import Cookies from 'js-cookie';
import BaseApp from 'next/app';
import React from 'react';

import '@/styles/fonts.css';
import '@/styles/normalize.css';

import { JWTRefresh } from '@/components/JWTRefresh';
import { DialogProvider } from '@/contexts/Dialog';
import { NoopFormProvider } from '@/contexts/Form';
import { JWTProvider } from '@/contexts/JWT';
import { LanguagePackProvider } from '@/contexts/LanguagePack';
import { TooltipProvider } from '@/contexts/Tooltip';
import { URQLProvider } from '@/contexts/URQL';
import { establishAuthentication } from '@/lib/ssr';
import { DEFAULT as DEFAULT_LANGUAGE_PACK } from '@/models/LanguagePack';

function getBody() {
  if (typeof window === 'undefined') {
    return null;
  } else {
    return document.body;
  }
}

export default establishAuthentication(
  class MyApp extends BaseApp {
    render() {
      const { Component, pageProps } = this.props;
      const jwt = Cookies.get('token') || pageProps.jwt;
      const aut = Cookies.get('authn') || pageProps.aut;

      return (
        <>
          <JWTProvider
            initialJwt={jwt}
            initialAut={aut}
            preserveJwt={jwt => Cookies.set('token', jwt)}
            preserveAut={aut => Cookies.set('authn', aut)}
          >
            <URQLProvider
              ssrExchange={pageProps.ssrExchange}
              initialState={pageProps.ssrInitialState}
            >
              <JWTRefresh />
              <DialogProvider getContainer={getBody}>
                <TooltipProvider getContainer={getBody}>
                  <LanguagePackProvider
                    initialLanguagePack={DEFAULT_LANGUAGE_PACK}
                    getLanguagePack={language =>
                      Promise.resolve(DEFAULT_LANGUAGE_PACK)
                    }
                  >
                    <NoopFormProvider>
                      <Component {...pageProps} />
                    </NoopFormProvider>
                  </LanguagePackProvider>
                </TooltipProvider>
              </DialogProvider>
            </URQLProvider>
          </JWTProvider>
        </>
      );
    }
  },
);
