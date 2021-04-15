import React, { useContext, useEffect, useState } from 'react';
import { useMutation } from 'urql';

import { JWTContext } from '@/contexts/JWT';
import { waitAtLeast } from '@/lib/delay';
import { ErrorType } from '@/lib/errors/type';

import { Error } from './Error';
import { Processing } from './Processing';

const completeAuthorization = `
  mutation($email: String!, $token: String!) {
    completeAuthentication(credentials: {email: $email, token: $token}) {
      jwt
    }
  }
`;

interface Props {
  email: string;
  token: string;
  onComplete(): void;
}

export function CompleteAuthorization(props: Props) {
  const { email, token, onComplete } = props;
  const { setJwt } = useContext(JWTContext);
  const [, complete] = useMutation(completeAuthorization);
  const [error, setError] = useState<ErrorType | null>(null);

  useEffect(() => {
    waitAtLeast(3000, () => {
      return complete({ email, token }).then(result => {
        if (result.error) {
          const errorType = result.error.graphQLErrors[0].message as ErrorType;
          setError(errorType);
        } else {
          const jwt: string = result.data.completeAuthentication.jwt;
          setJwt(jwt);
          onComplete();
        }
      });
    });
  }, []);

  return error ? <Error errorType={error} /> : <Processing />;
}
