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
   * Initialized the refresh token
   */
  initialAut?: string;
  /**
   * How to preserve the JWT
   */
  preserveJwt?(jwt: string): void;
  /**
   * How to preserve the refresh token
   */
  preserveAut?(jwt: string): void;
}

interface JWTDetails {
  jwt?: string;
  aut?: string;
  setJwt(jwt: string): void;
  setAut(aut: string): void;
}

export const JWTContext = createContext<JWTDetails>({
  jwt: undefined,
  aut: undefined,
  setJwt: () => {},
  setAut: () => {},
});

export function JWTProvider(props: Props) {
  const { children, initialJwt, initialAut, preserveJwt, preserveAut } = props;
  const [jwt, _setJwt] = useState<JWTDetails['jwt']>(initialJwt);
  const [aut, _setAut] = useState<JWTDetails['aut']>(initialAut);

  const setJwt = useCallback(
    (jwt: string) => {
      _setJwt(jwt);
      preserveJwt?.(jwt);
    },
    [_setJwt, preserveJwt],
  );

  const setAut = useCallback(
    (aut: string) => {
      _setAut(aut);
      preserveAut?.(aut);
    },
    [_setAut, preserveAut],
  );

  return (
    <JWTContext.Provider
      value={{
        aut,
        setAut: aut => setAut(aut),
        jwt,
        setJwt: jwt => setJwt(jwt),
      }}
    >
      {children}
    </JWTContext.Provider>
  );
}
