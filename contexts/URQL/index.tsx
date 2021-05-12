import { cacheExchange } from '@urql/exchange-graphcache';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';
import { persistedFetchExchange } from '@urql/exchange-persisted-fetch';
import React, { useContext, useEffect, useRef } from 'react';
import { createClient, Provider, ssrExchange, dedupExchange } from 'urql';

import { JWTContext } from '@/contexts/JWT';
import { config } from '@/graphcache';

type SSRExchange = ReturnType<typeof ssrExchange>;

const isServerSide = typeof window === 'undefined';

const setupClient = (
  ssr: SSRExchange,
  jwt: { current: () => string | undefined },
  schema?: any,
) => {
  const exchanges: any = [];

  exchanges.push(dedupExchange);
  exchanges.push(cacheExchange({ ...config, schema }));
  exchanges.push(ssr);

  if (!isServerSide) {
    exchanges.push(
      persistedFetchExchange({
        preferGetForPersistedQueries: true,
      }),
    );
  }

  exchanges.push(multipartFetchExchange);

  return createClient({
    exchanges,
    fetchOptions: () => ({
      headers: {
        Authorization: jwt.current() ? `Bearer ${jwt.current()}` : '',
      },
    }),
    suspense: isServerSide,
    url: process.env.NEXT_PUBLIC_GQL_ADDRESS!,
  });
};

interface Props {
  children?: React.ReactNode;
  ssrExchange?: SSRExchange;
  schema?: any;
  initialState?: any;
}

export function URQLProvider(props: Props) {
  const { jwt } = useContext(JWTContext);
  const ssr =
    props.ssrExchange ||
    ssrExchange({
      isClient: !isServerSide,
      initialState: props.initialState,
    });

  const getJwt = useRef(() => jwt);

  useEffect(() => {
    getJwt.current = () => jwt;
  }, [jwt]);

  const client = useRef(setupClient(ssr, getJwt, props.schema));

  return <Provider value={client.current}>{props.children}</Provider>;
}
