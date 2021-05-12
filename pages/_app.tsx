import Cookies from 'js-cookie';
import BaseApp, { AppContext } from 'next/app';
import React from 'react';

import '@/styles/fonts.css';
import '@/styles/normalize.css';

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
import { DEFAULT as DEFAULT_LANGUAGE_PACK } from '@/models/LanguagePack';

function getBody() {
  if (typeof window === 'undefined') {
    return null;
  } else {
    return document.body;
  }
}

export default class MyApp extends BaseApp {
  static getInitialProps = async (context: AppContext) => {
    const pageProps = {
      query: context.ctx.query,
      pathname: context.ctx.pathname,
    };

    return { pageProps };
  };

  render() {
    const { Component, pageProps } = this.props;
    const jwt = Cookies.get('token') || pageProps.jwt;
    const aut = Cookies.get('authn') || pageProps.aut;
    const ssrInitialState =
      typeof window === 'undefined'
        ? pageProps.ssrInitialState
        : // @ts-ignore
          window.__INITIAL_STATE__;
    const schema =
      typeof window === 'undefined'
        ? pageProps.schema
        : // @ts-ignore
          window.__GQL_SCHEMA__;

    return (
      <JWTProvider
        initialJwt={jwt}
        initialAut={aut}
        preserveJwt={jwt => Cookies.set('token', jwt, { path: Route.Home })}
        preserveAut={aut => Cookies.set('authn', aut, { path: Route.Home })}
      >
        <URQLProvider
          initialState={ssrInitialState}
          schema={schema}
          ssrExchange={pageProps.ssrExchange}
        >
          <JWTRefresh />
          <LanguagePackProvider
            initialLanguagePack={DEFAULT_LANGUAGE_PACK}
            getLanguagePack={language => Promise.resolve(DEFAULT_LANGUAGE_PACK)}
          >
            <DialogProvider getContainer={getBody}>
              <TooltipProvider>
                <NotificationsProvider getContainer={getBody}>
                  <ConfirmationProvider>
                    <NoopFormProvider>
                      <DomContainerProvider body>
                        <Component {...pageProps} />
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
    );
  }
}
