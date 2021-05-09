import cx from 'classnames';
import React from 'react';

import { DomContainerProvider } from '@/contexts/DomContainer';

import { Header } from './Header';
import styles from './index.module.scss';

interface Props {
  children?: React.ReactNode;
  className?: string;
  transparentHeader?: boolean;
}

export function General(props: Props) {
  return (
    <div className={cx(styles.container, props.className)}>
      <Header className={styles.header} />
      <div className={styles.content}>
        <DomContainerProvider>{props.children}</DomContainerProvider>
      </div>
    </div>
  );
}
