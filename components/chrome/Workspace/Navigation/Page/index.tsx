import cx from 'classnames';
import Link from 'next/link';
import React from 'react';

import { Empty } from '@/components/controls/links/Empty';
import { useTextToString } from '@/hooks/useTextToString';
import { breadcrumbsFromPages } from '@/lib/breadcrumbsFromPages';
import { toIcon } from '@/lib/organizationPageType/toIcon';
import { toName } from '@/lib/organizationPageType/toName';
import { OrganizationPage } from '@/models/OrganizationPage';

import styles from './index.module.scss';

interface Props {
  breadcrumbs: ReturnType<typeof breadcrumbsFromPages>;
  page: OrganizationPage;
}

export function Page(props: Props) {
  const textToString = useTextToString();
  const Icon = toIcon(props.page.type);
  const title = textToString(toName(props.page.type));
  const isSelected = !!props.breadcrumbs.find(
    crumb => crumb.type === props.page.type,
  );

  return (
    <React.Fragment key={title}>
      <div className={styles.item}>
        <Link href={`/biz${props.page.url}`}>
          <Empty
            className={cx(styles.link, {
              [styles.notSelected]: !isSelected,
            })}
            style={{
              textTransform: !Icon ? 'none' : undefined,
              paddingLeft: !Icon ? 18 : undefined,
            }}
          >
            {Icon && <Icon className={styles.icon} />}
            {title}
          </Empty>
        </Link>
      </div>
      {isSelected &&
        props.page.children &&
        props.page.children.map(page => (
          <Page key={page.type} breadcrumbs={props.breadcrumbs} page={page} />
        ))}
    </React.Fragment>
  );
}
