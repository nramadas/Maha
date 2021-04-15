import React, { useContext } from 'react';
import { createClient, Provider } from 'urql';

import { JWTContext } from '@/contexts/JWT';

const setupClient = (jwt?: string) =>
  createClient({
    url: process.env.NEXT_PUBLIC_GQL_ADDRESS!,
    fetchOptions: () => ({
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : '',
      },
    }),
  });

interface Props {
  children?: React.ReactNode;
}

export function URQLProvider(props: Props) {
  const { jwt } = useContext(JWTContext);
  return <Provider value={setupClient(jwt)}>{props.children}</Provider>;
}
