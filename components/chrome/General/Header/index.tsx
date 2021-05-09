import cx from 'classnames';
import React from 'react';

import { Account } from '@/components/Account';
import { Logo } from '@/components/Logo';

import styles from './index.module.scss';

interface Props {
  className?: string;
}

export function Header(props: Props) {
  return (
    <header className={cx(styles.container, props.className)}>
      <div className={styles.content}>
        <div className={styles.section}>
          <Logo showBrand />
        </div>
        <div className={styles.section}>
          <Account theme="dark" />
        </div>
      </div>
    </header>
  );
}
