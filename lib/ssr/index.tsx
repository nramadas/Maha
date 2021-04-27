import BaseApp from 'next/app';
import React from 'react';
import ssrPrepass from 'react-ssr-prepass';
import { ssrExchange } from 'urql';

import { refreshSession } from '@/lib/authn/api';
import { parse } from '@/lib/cookies';

export function establishAuthentication(App: typeof BaseApp) {
  App.getInitialProps = async context => {
    const { AppTree, ctx } = context;
    const cookiesStr = ctx.req?.headers?.cookie;
    const cookies = parse(cookiesStr);
    let aut: string | undefined = cookies.authn;
    let jwt: string | undefined = cookies.token;

    if (aut) {
      const result = await refreshSession(aut);

      if (result.ok) {
        jwt = result.idToken;
        context.ctx.res?.setHeader(
          'set-cookie',
          `token=${jwt}; SameSite=Lax; path=/`,
        );
      } else {
        jwt = undefined;
        aut = undefined;
        context.ctx.res?.setHeader('set-cookie', 'token=');
        context.ctx.res?.setHeader('set-cookie', 'authn=');
      }
    }

    const ssr = ssrExchange({
      isClient: false,
      initialState: undefined,
    });

    const basePageProps = {
      jwt,
      aut,
      query: context.ctx.query,
      pathname: context.ctx.pathname,
    };

    await ssrPrepass(
      <AppTree pageProps={{ ...basePageProps, ssrExchange: ssr }} />,
    );
    const initialState = ssr.extractData();

    return {
      pageProps: {
        ...basePageProps,
        ssrInitialState: initialState,
      },
    };
  };

  return App;
}
