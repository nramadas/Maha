import cx from 'classnames';
import React from 'react';

import { Caption } from '@/components/typography/Caption';

import styles from './index.module.scss';

interface Props {
  className?: string;
  children: string;
}

export function ErrorText(props: Props) {
  return (
    <div className={cx(styles.error, props.className)}>
      <Caption>{props.children}</Caption>
    </div>
  );
}
