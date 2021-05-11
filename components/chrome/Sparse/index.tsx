import cx from 'classnames';
import React from 'react';

import { Logo } from '@/components/Logo';

import styles from './index.module.scss';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

export function Sparse(props: Props) {
  return (
    <div className={cx(styles.container, props.className)}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Logo showBrand />
        </div>
      </header>
      {props.children}
    </div>
  );
}
