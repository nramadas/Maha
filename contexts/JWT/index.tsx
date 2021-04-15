import React, { createContext, useCallback, useState } from 'react';

interface Props {
  /**
   * Standard React children
   */
  children?: React.ReactNode;
  /**
   * Initialize the JWT
   */
  initialJwt?: string;
  /**
   * How to preserve the JWT
   */
  preserveJwt?(jwt: string): void;
}

interface JWTDetails {
  jwt?: string;
  setJwt(jwt: string): void;
}

export const JWTContext = createContext<JWTDetails>({
  jwt: undefined,
  setJwt: () => {},
});

export function JWTProvider(props: Props) {
  const { children, initialJwt, preserveJwt } = props;
  const [jwt, _setJwt] = useState<JWTDetails['jwt']>(initialJwt);

  const setJwt = useCallback(
    (jwt: string) => {
      _setJwt(jwt);
      preserveJwt?.(jwt);
    },
    [_setJwt, preserveJwt],
  );

  return (
    <JWTContext.Provider value={{ jwt, setJwt: jwt => setJwt(jwt) }}>
      {children}
    </JWTContext.Provider>
  );
}
