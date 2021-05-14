import React from 'react';

import { H4 } from '@/components/typography/H4';
import { useTextToString } from '@/hooks/useTextToString';
import { Text } from '@/models/Text';

import styles from './index.module.scss';

interface Props {
  className?: string;
  title: Text;
}

export function Filters(props: Props) {
  const textToString = useTextToString();

  return (
    <div className={styles.container}>
      <H4 className={styles.header} title={textToString(props.title)}>
        {textToString(props.title)}
      </H4>
    </div>
  );
}
