import Cookies from 'js-cookie';
import BaseApp from 'next/app';
import React from 'react';

import '@/styles/fonts.css';
import '@/styles/normalize.css';

import { JWTRefresh } from '@/components/JWTRefresh';
import { DialogProvider } from '@/contexts/Dialog';
import { JWTProvider } from '@/contexts/JWT';
import { TooltipProvider } from '@/contexts/Tooltip';
import { URQLProvider } from '@/contexts/URQL';
import { establishAuthentication } from '@/lib/ssr';

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
                  <Component {...pageProps} />
                </TooltipProvider>
              </DialogProvider>
            </URQLProvider>
          </JWTProvider>
        </>
      );
    }
  },
);
