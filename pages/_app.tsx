import Cookies from 'js-cookie';
import BaseApp from 'next/app';
import React from 'react';

import '@/styles/fonts.css';
import '@/styles/normalize.css';

import { IsomorphicSuspense } from '@/components/IsomorphicSuspense';
import { JWTRefresh } from '@/components/JWTRefresh';
import { ConfirmationProvider } from '@/contexts/Confirmation';
import { DialogProvider } from '@/contexts/Dialog';
import { DomContainerProvider } from '@/contexts/DomContainer';
import { NoopFormProvider } from '@/contexts/Form';
import { JWTProvider } from '@/contexts/JWT';
import { LanguagePackProvider } from '@/contexts/LanguagePack';
import { NotificationsProvider } from '@/contexts/Notifications';
import { TooltipProvider } from '@/contexts/Tooltip';
import { URQLProvider } from '@/contexts/URQL';
import { Route } from '@/lib/route';
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
            preserveJwt={jwt => Cookies.set('token', jwt, { path: Route.Home })}
            preserveAut={aut => Cookies.set('authn', aut, { path: Route.Home })}
          >
            <URQLProvider
              ssrExchange={pageProps.ssrExchange}
              initialState={pageProps.ssrInitialState}
            >
              <JWTRefresh />
              <LanguagePackProvider
                initialLanguagePack={DEFAULT_LANGUAGE_PACK}
                getLanguagePack={language =>
                  Promise.resolve(DEFAULT_LANGUAGE_PACK)
                }
              >
                <DialogProvider getContainer={getBody}>
                  <TooltipProvider>
                    <NotificationsProvider getContainer={getBody}>
                      <ConfirmationProvider>
                        <NoopFormProvider>
                          <DomContainerProvider body>
                            <IsomorphicSuspense fallback={<div />}>
                              <Component {...pageProps} />
                            </IsomorphicSuspense>
                          </DomContainerProvider>
                          <div id="extra-container" />
                        </NoopFormProvider>
                      </ConfirmationProvider>
                    </NotificationsProvider>
                  </TooltipProvider>
                </DialogProvider>
              </LanguagePackProvider>
            </URQLProvider>
          </JWTProvider>
        </>
      );
    }
  },
);
