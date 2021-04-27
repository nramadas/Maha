import React from 'react';
import { useQuery } from 'urql';

import { Account } from '@/components/Account';
import { Organization } from '@/models/Organization';

import { Breadcrumbs } from './Breadcrumbs';
import styles from './index.module.scss';
import { Navigation, PageKey } from './Navigation';
import { Title } from './Title';

const orgById = `
  query ($orgId: String!) {
    organizationById (id: $orgId) {
      id
      name
    }
  }
`;

interface Props {
  breadcrumbs: PageKey[];
  orgId: Organization['id'];
  children?: React.ReactNode;
}

export function Workspace(props: Props) {
  const [result] = useQuery({
    query: orgById,
    variables: { orgId: props.orgId },
  });

  const organization = result.data?.organizationById;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Breadcrumbs
          breadcrumbs={props.breadcrumbs}
          className={styles.breadcrumbs}
          orgId={props.orgId}
        />
        <Account />
      </header>
      <nav className={styles.nav}>
        {organization && (
          <Title className={styles.title} organization={organization} />
        )}
        <Navigation
          className={styles.navList}
          breadcrumbs={props.breadcrumbs}
          orgId={props.orgId}
        />
      </nav>
      <article>{props.children}</article>
    </div>
  );
}
