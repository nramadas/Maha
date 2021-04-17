import React, { useContext } from 'react';
import {
  createClient,
  Provider,
  ssrExchange,
  fetchExchange,
  dedupExchange,
  cacheExchange,
} from 'urql';

import { JWTContext } from '@/contexts/JWT';

type SSRExchange = ReturnType<typeof ssrExchange>;

const isServerSide = typeof window === 'undefined';

const setupClient = (ssr: SSRExchange, jwt?: string) => {
  return createClient({
    exchanges: [dedupExchange, cacheExchange, ssr, fetchExchange],
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
