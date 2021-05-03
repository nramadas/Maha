import cx from 'classnames';
import Link from 'next/link';
import React from 'react';

import { Empty } from '@/components/controls/links/Empty';
import { ChevronRight } from '@/components/icons/ChevronRight';
import { useTextToString } from '@/hooks/useTextToString';
import { Breadcrumb } from '@/lib/breadcrumbsFromPages';

import styles from './index.module.scss';

interface Props {
  breadcrumbs: Breadcrumb[];
  className?: string;
}

export function Breadcrumbs(props: Props) {
  const textToString = useTextToString();

  return (
    <div className={cx(styles.container, props.className)}>
      {props.breadcrumbs.map((crumb, index) => {
        return (
          <React.Fragment key={crumb.type}>
            <Link href={`/biz${crumb.url}`}>
              <Empty className={styles.button}>
                {textToString(crumb.name)}
              </Empty>
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
