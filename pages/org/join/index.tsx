import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import { JoinOrganization } from '@/components/JoinOrganization';
import { Route } from '@/lib/route';

import styles from './index.module.scss';

interface Props {
  orgName?: string;
}

export default function JoinOrganizationPage(props: Props) {
  const router = useRouter();

  if (!props.orgName) {
    router.push(Route.Home);
    return <div />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <JoinOrganization
          orgName={props.orgName}
          onComplete={() => {
            router.push(Route.BizLandingPage);
          }}
        />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { orgName } = context.query;

  return {
    props: {
      orgName: typeof orgName === 'string' ? decodeURIComponent(orgName) : null,
    },
  };
};
