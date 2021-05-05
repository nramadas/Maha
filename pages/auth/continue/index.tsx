import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import { CompleteAuthorization } from '@/components/CompleteAuthentication';
import { Error } from '@/components/CompleteAuthentication/Error';
import { useGetFromStorage } from '@/hooks/useGetFromStorage';
import { emailActionToUrl } from '@/lib/emailActionToUrl';
import { ErrorType } from '@/lib/errors/type';
import { Route } from '@/lib/route';
import { EmailAction } from '@/models/EmailAction';

interface Props {
  action?: EmailAction;
  email?: string;
  orgName?: string;
  token?: string;
}

export default function Continue(props: Props) {
  const router = useRouter();
  const redirectUrl = useGetFromStorage<string>('redirectUrl') || Route.Home;
  const gotoUrl = (props.action && emailActionToUrl(props)) || redirectUrl;

  if (!(props.email && props.token)) {
    return <Error errorType={ErrorType.SomethingElse} />;
  }

  return (
    <CompleteAuthorization
      email={props.email}
      token={props.token}
      onComplete={() => router.push(gotoUrl)}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { action, email, orgName, token } = context.query;

  return {
    props: {
      action: typeof action === 'string' ? action : null,
      email: typeof email === 'string' ? decodeURIComponent(email) : null,
      orgName: typeof orgName === 'string' ? decodeURIComponent(orgName) : null,
      token: typeof token === 'string' ? decodeURIComponent(token) : null,
    },
  };
};
