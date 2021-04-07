import React from 'react';

import { Caption } from '@/components/typography/Caption';

import styles from './index.module.scss';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Optional label that is displayed next to the radio
   */
  label?: string;
  /**
   * Reference name for radio value
   */
  name: string;
}

/**
 * Custom radio button
 */
export function Radio(props: Props) {
  const { label, ...rest } = props;

  return (
    <label className={styles.container}>
      <input {...rest} className={styles.input} type="radio" />
      <div className={styles.hover} />
      <div className={styles.circle} />
      <div className={styles.dot} />
      <div className={styles.label}>
        <Caption>{label}</Caption>
      </div>
    </label>
  );
}
