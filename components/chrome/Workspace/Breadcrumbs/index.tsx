import cx from 'classnames';
import Link from 'next/link';
import React from 'react';

import { pageMap, PageKey } from '../Navigation';
import { Empty } from '@/components/controls/links/Empty';
import { ChevronRight } from '@/components/icons/ChevronRight';
import { useLanguagePack } from '@/hooks/useLanguagePack';
import { Organization } from '@/models/Organization';

import styles from './index.module.scss';

interface Props {
  breadcrumbs: PageKey[];
  orgId: Organization['id'];
  className?: string;
}

export function Breadcrumbs(props: Props) {
  const languagePack = useLanguagePack();
  const mapping = pageMap(props.orgId);

  return (
    <div className={cx(styles.container, props.className)}>
      {props.breadcrumbs.map((crumb, index) => {
        const { title, url } = mapping[crumb];
        const titleStr = title(languagePack);

        return (
          <React.Fragment key={titleStr}>
            <Link href={url}>
              <Empty className={styles.button}>{titleStr}</Empty>
            </Link>
            {index !== props.breadcrumbs.length - 1 && (
              <ChevronRight className={styles.icon} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
