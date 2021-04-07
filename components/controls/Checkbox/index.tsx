import React from 'react';

import { Checkmark } from '@/components/icons/Checkmark';
import { Caption } from '@/components/typography/Caption';

import styles from './index.module.scss';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Optional label that is displayed next to the checkbox
   */
  label?: string;
  /**
   * Reference name for checkbox value
   */
  name: string;
}

/**
 * Custom checkbox
 */
export function Checkbox(props: Props) {
  const { label, ...rest } = props;

  return (
    <label className={styles.container}>
      <input {...rest} className={styles.input} type="checkbox" />
      <div className={styles.hover} />
      <div className={styles.box}>
        <Checkmark className={styles.check} />
      </div>
      <div className={styles.label}>
        <Caption>{label}</Caption>
      </div>
    </label>
  );
}
