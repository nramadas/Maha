import React from 'react';

import { Account } from '@/components/Account';
import { DomContainerProvider } from '@/contexts/DomContainer';
import { Breadcrumb } from '@/lib/breadcrumbsFromPages';
import { Organization } from '@/models/Organization';
import { OrganizationPage } from '@/models/OrganizationPage';

import { Breadcrumbs } from './Breadcrumbs';
import styles from './index.module.scss';
import { Navigation } from './Navigation';
import { Title } from './Title';

interface Props {
  breadcrumbs: Breadcrumb[];
  children?: React.ReactNode;
  organization: Pick<Organization, 'name'>;
  pages: OrganizationPage[];
  pathParts: string[];
}

export function Workspace(props: Props) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Breadcrumbs
          breadcrumbs={props.breadcrumbs}
          className={styles.breadcrumbs}
        />
        <Account />
      </header>
      <nav className={styles.nav}>
        <Title className={styles.title} organization={props.organization} />
        <Navigation
          breadcrumbs={props.breadcrumbs}
          className={styles.navList}
          pages={props.pages}
        />
      </nav>
      <article className={styles.content}>
        <DomContainerProvider>{props.children}</DomContainerProvider>
      </article>
    </div>
  );
}
