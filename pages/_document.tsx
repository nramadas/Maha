import 'setimmediate';
import Document, { DocumentContext } from 'next/document';
import React from 'react';
import ssrPrepass from 'react-ssr-prepass';
import { ssrExchange } from 'urql';

import { refreshSession } from '@/lib/authn/api';
import { parse } from '@/lib/cookies';
import { Route } from '@/lib/route';
import { createCssStyles } from '@/lib/theme/createCssStyles';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const { AppTree, query, pathname, req } = ctx;
    const cookiesStr = req?.headers?.cookie;
    const cookies = parse(cookiesStr);
    let aut: string | undefined = cookies.authn;
    let jwt: string | undefined = cookies.token;

    if (ctx.pathname === Route.ContinueAuthentication) {
      aut = undefined;
      jwt = undefined;
      ctx.res?.setHeader('set-cookie', 'token=; SameSite=Lax; path=/');
      ctx.res?.setHeader('set-cookie', 'authn=; SameSite=Lax; path=/');
    }

    if (aut) {
      const result = await refreshSession(aut);

      if (result.ok) {
        jwt = result.idToken;
        ctx.res?.setHeader('set-cookie', `token=${jwt}; SameSite=Lax; path=/`);
      } else {
        jwt = undefined;
        aut = undefined;
        ctx.res?.setHeader('set-cookie', 'token=; SameSite=Lax; path=/');
        ctx.res?.setHeader('set-cookie', 'authn=; SameSite=Lax; path=/');
      }
    }

    const basePageProps = {
      jwt,
      aut,
      query,
      pathname,
    };

    let ssrInitialState = {};

    const ssr = ssrExchange({
      isClient: false,
      initialState: undefined,
    });

    await ssrPrepass(
      <AppTree pageProps={{ ...basePageProps, ssrExchange: ssr }} />,
    );

    ssrInitialState = ssr.extractData();

    const pageProps = { ...basePageProps, ssrInitialState };
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props => (
          <App {...props} pageProps={{ ...props.pageProps, ...pageProps }} />
        ),
        enhanceComponent: Component => Component,
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      head: [
        ...(initialProps.head || []),
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__INITIAL_STATE__ = ${JSON.stringify(
              ssrInitialState,
            )}`,
          }}
        />,
      ],
      styles: (
        <>
          {initialProps.styles}
          <style dangerouslySetInnerHTML={{ __html: createCssStyles() }} />
        </>
      ),
    };
  }
}
