import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import { CompleteAuthorization } from '@/components/CompleteAuthentication';
import { Error } from '@/components/CompleteAuthentication/Error';
import { useGetFromStorage } from '@/hooks/useGetFromStorage';
import { ErrorType } from '@/lib/errors/type';

interface Props {
  email?: string;
  token?: string;
}

export default function Continue(props: Props) {
  const router = useRouter();
  const redirectUrl = useGetFromStorage<string>('redirectUrl') || '/';

  if (!(props.email && props.token)) {
    return <Error errorType={ErrorType.SomethingElse} />;
  }

  return (
    <CompleteAuthorization
      email={props.email}
      token={props.token}
      onComplete={() => router.push(redirectUrl)}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { email, token } = context.query;

  return {
    props: {
      email: typeof email === 'string' ? decodeURIComponent(email) : null,
      token: typeof token === 'string' ? decodeURIComponent(token) : null,
    },
  };
};
