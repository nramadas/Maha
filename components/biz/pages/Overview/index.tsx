import cx from 'classnames';
import React from 'react';

import { InfoNumMembers } from '@/components/biz/widgets/InfoNumMembers';
import { InfoNumProperties } from '@/components/biz/widgets/InfoNumProperties';

import styles from './index.module.scss';

interface Props {
  className?: string;
}

export function Overview(props: Props) {
  return (
    <div className={cx(styles.container, props.className)}>
      <header className={styles.header}>
        <InfoNumProperties />
        <InfoNumMembers />
      </header>
    </div>
  );
}
