import cx from 'classnames';
import React from 'react';

import { breadcrumbsFromPages } from '@/lib/breadcrumbsFromPages';
import { OrganizationPage } from '@/models/OrganizationPage';

import styles from './index.module.scss';
import { Page } from './Page';

interface Props {
  breadcrumbs: ReturnType<typeof breadcrumbsFromPages>;
  className?: string;
  pages: OrganizationPage[];
}

export function Navigation(props: Props) {
  return (
    <div className={cx(styles.container, props.className)}>
      {props.pages.map(page => (
        <Page key={page.type} breadcrumbs={props.breadcrumbs} page={page} />
      ))}
    </div>
  );
}
