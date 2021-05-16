import cx from 'classnames';
import React from 'react';

import { Overline } from '@/components/typography/Overline';
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
      <Overline>{textToString(props.title)}</Overline>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
}
