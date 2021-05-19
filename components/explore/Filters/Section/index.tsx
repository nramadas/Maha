import cx from 'classnames';
import React from 'react';

import { Body2 } from '@/components/typography/Body2';
import { useTextToString } from '@/hooks/useTextToString';
import { Text } from '@/models/Text';

import styles from './index.module.scss';

interface Props {
  children?: React.ReactNode;
  className?: string;
  title: Text;
}

export function Section(props: Props) {
  const textToString = useTextToString();

  return (
    <div className={cx(styles.container, props.className)}>
      <Body2 className={styles.label}>{textToString(props.title)}</Body2>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
}
