import { gql } from '@urql/core';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { useMutation } from 'urql';

import { JWTContext } from '@/contexts/JWT';
import { extractPayload } from '@/lib/authn/extractPayload';

const refreshAuthentication = gql`
  mutation($refreshToken: String!) {
    refreshAuthentication(credentials: { refreshToken: $refreshToken }) {
      jwt
    }
  }
`;

export function JWTRefresh() {
  const { jwt, aut, setJwt } = useContext(JWTContext);
  const [, refresh] = useMutation(refreshAuthentication);

  const timer = useRef<number | undefined>(undefined);

  const refreshSession = useCallback(async () => {
    const result = await refresh({ refreshToken: aut });
    if (!result.error) {
      const { jwt } = result.data.refreshAuthentication;
      setJwt(jwt);
    }
  }, [aut]);

  useEffect(() => {
    if (aut) {
      if (jwt) {
        const jwtPayload = extractPayload(jwt);

        if (jwtPayload) {
          const { iat, exp } = jwtPayload;
          const _iat = iat * 1000;
          const _exp = exp * 1000;
          const halflife = _exp - _iat / 2;
          const refreshAt = _iat + halflife;
          const now = Date.now();

          if (now >= refreshAt || now < _iat) {
            refreshSession();
          } else {
            clearTimeout(timer.current);
            timer.current = setTimeout(() => refreshSession(), refreshAt - now);
          }
        }
      } else {
        refreshSession();
      }
    }

    return () => clearTimeout(timer.current);
  }, [aut, jwt, refreshSession]);

  return null;
}
