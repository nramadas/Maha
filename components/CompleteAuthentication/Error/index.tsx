import React from 'react';

import { Body1 } from '@/components/typography/Body1';
import { H1 } from '@/components/typography/H1';
import { H4 } from '@/components/typography/H4';
import { useTextToString } from '@/hooks/useTextToString';
import { getMessage } from '@/lib/errors/getMessage';
import { ErrorType } from '@/lib/errors/type';

import styles from './index.module.scss';

interface Props {
  errorType: ErrorType;
}

export function Error(props: Props) {
  const textToString = useTextToString();

  return (
    <div className={styles.container}>
      <H1 className={styles.title}>Oh no!</H1>
      <H4>{textToString(getMessage(props.errorType))}</H4>
      <Body1 className={styles.explanation}>
        We're terribly sorry for this inconvenience. Please try again later.
      </Body1>
    </div>
  );
}
