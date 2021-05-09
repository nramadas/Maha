import cx from 'classnames';
import Link from 'next/link';
import React from 'react';

import { Route } from '@/lib/route';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

interface Props {
  className?: string;
  showBrand?: boolean;
}

export function Logo(props: Props) {
  return (
    <Link href={Route.Home}>
      <a className={cx(styles.container, props.className)}>
        <div className={styles.box}>
          <i18n.Translate>M</i18n.Translate>
        </div>
        {props.showBrand && (
          <div className={styles.brand}>
            <i18n.Translate>Maha</i18n.Translate>
          </div>
        )}
      </a>
    </Link>
  );
}
