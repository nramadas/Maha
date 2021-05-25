import cx from 'classnames';
import React from 'react';

import { Body2 } from '@/components/typography/Body2';
import { Overline } from '@/components/typography/Overline';
import { useTextToString } from '@/hooks/useTextToString';
import { Text } from '@/models/Text';

import styles from './index.module.scss';

interface Props {
  className?: string;
  children?: Text | React.ReactNode;
  title: Text;
}

export function Section(props: Props) {
  const textToString = useTextToString();

  const title = textToString(props.title);
  const content =
    typeof props.children === 'function' ||
    typeof props.children === 'string' ? (
      <Body2>{textToString(props.children as Text)}</Body2>
    ) : (
      props.children
    );

  return (
    <div className={cx(styles.section, props.className)}>
      <Overline className={styles.label}>{title}</Overline>
      {content}
    </div>
  );
}
