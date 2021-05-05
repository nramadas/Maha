import cx from 'classnames';
import Link from 'next/link';
import React from 'react';

import { Route } from '@/lib/route';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

interface Props {
  className?: string;
}

export function Logo(props: Props) {
  return (
    <Link href={Route.Home}>
      <a className={cx(styles.container, props.className)}>
        <i18n.Translate>M</i18n.Translate>
      </a>
    </Link>
  );
}
