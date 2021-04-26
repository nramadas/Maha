import React from 'react';

import { Caption } from '@/components/typography/Caption';
import { useForm } from '@/hooks/useForm';

import styles from './index.module.scss';

interface Value {
  text: string;
}

interface Props<V> {
  /**
   * Whether or not the radio button is disabled
   */
  disabled?: boolean;
  /**
   * Optional label that is displayed next to the radio
   */
  label?: string;
  /**
   * Reference name for radio value
   */
  name: string;
  /**
   * Value of the radio button
   */
  value: V;
  /**
   * Callback for when this radio option is selected
   */
  onSelect?(value: V): void;
}

/**
 * Custom radio button
 */
export function Radio<V extends Value>(props: Props<V>) {
  const { disabled, label, name, value, onSelect } = props;
  const form = useForm();

  return (
    <label className={styles.container}>
      <input
        className={styles.input}
        disabled={disabled}
        name={name}
        type="radio"
        value={value.text}
        onInput={e => {
          if (e.currentTarget.checked) {
            form.setValue(name, value);
          }
          onSelect?.(value);
        }}
      />
      <div className={styles.hover} />
      <div className={styles.circle} />
      <div className={styles.dot} />
      <div className={styles.label}>
        <Caption>{label}</Caption>
      </div>
    </label>
  );
}
