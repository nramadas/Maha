import cx from 'classnames';
import React from 'react';

import { Shimmer } from '@/components/loading/Shimmer';
import { H1 } from '@/components/typography/H1';
import { H3 } from '@/components/typography/H3';

import styles from './index.module.scss';

interface LoadingProps {
  className?: string;
  loading: true;
}

interface LoadedProps {
  className?: string;
  count: number;
  loading: false;
  label: React.ReactNode;
}

type Props = LoadingProps | LoadedProps;

export function LargeCount(props: Props) {
  if (props.loading) {
    return (
      <div className={cx(props.className, styles.container)}>
        <Shimmer className={styles.loadingCount} />
        <Shimmer className={styles.loadingLabel} />
      </div>
    );
  }

  return (
    <div className={cx(props.className, styles.container)}>
      <H1>{props.count}</H1>
      <H3>{props.label}</H3>
    </div>
  );
}
