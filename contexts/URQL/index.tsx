import { cacheExchange } from '@urql/exchange-graphcache';
import React, { useContext } from 'react';
import {
  createClient,
  Provider,
  ssrExchange,
  fetchExchange,
  dedupExchange,
} from 'urql';

import { JWTContext } from '@/contexts/JWT';
import { config } from '@/graphcache';

type SSRExchange = ReturnType<typeof ssrExchange>;

const isServerSide = typeof window === 'undefined';

const setupClient = (ssr: SSRExchange, jwt?: string) => {
  const exchanges = [dedupExchange, cacheExchange(config), ssr, fetchExchange];

  return createClient({
    exchanges,
    fetchOptions: () => ({
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : '',
      },
    }),
    suspense: true,
    url: process.env.NEXT_PUBLIC_GQL_ADDRESS!,
  });
};

interface Props {
  children?: React.ReactNode;
  ssrExchange?: SSRExchange;
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

  const client = setupClient(ssr, jwt);
  return <Provider value={client}>{props.children}</Provider>;
}
