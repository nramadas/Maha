import { gql } from '@urql/core';
import React, { useContext, useEffect, useState } from 'react';
import { useMutation } from 'urql';

import { JWTContext } from '@/contexts/JWT';
import { waitAtLeast } from '@/lib/delay';
import { ErrorType } from '@/lib/errors/type';

import { Error } from './Error';
import { Processing } from './Processing';

const completeAuthenticationMutation = gql`
  mutation($email: String!, $token: String!) {
    completeAuthentication(credentials: { email: $email, token: $token }) {
      jwt
      aut
    }
  }
`;

interface Props {
  email: string;
  token: string;
  onComplete(): void;
}

export function CompleteAuthentication(props: Props) {
  const { email, token, onComplete } = props;
  const { setJwt, setAut } = useContext(JWTContext);
  const [, completeAuthentication] = useMutation(
    completeAuthenticationMutation,
  );
  const [error, setError] = useState<ErrorType | null>(null);

  useEffect(() => {
    waitAtLeast(3000, () => {
      return completeAuthentication({ email, token }).then(result => {
        if (result.error) {
          const errorType = result.error.graphQLErrors[0].message as ErrorType;
          setError(errorType);
        } else {
          const { jwt, aut } = result.data.completeAuthentication;
          setJwt(jwt);
          setAut(aut);
          onComplete();
        }
      });
    });
  }, []);

  return error ? <Error errorType={error} /> : <Processing />;
}
