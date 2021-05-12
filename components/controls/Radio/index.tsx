import isEqual from 'lodash/isEqual';
import React from 'react';

import { Caption } from '@/components/typography/Caption';
import { useForm } from '@/hooks/useForm';
import { useTextToString } from '@/hooks/useTextToString';
import { Text } from '@/models/Text';

import styles from './index.module.scss';

interface Value<V, E> {
  value: V;
  extraData?: E;
}

interface Props<V, E> {
  /**
   * Whether or not the radio button is disabled
   */
  disabled?: boolean;
  /**
   * Optional label that is displayed next to the radio
   */
  label?: Text;
  /**
   * Reference name for radio value
   */
  name: string;
  /**
   * Value of the radio button
   */
  value: Value<V, E>;
  /**
   * Callback for when this radio option is selected
   */
  onSelect?(value: Value<V, E>): void;
}

/**
 * Custom radio button
 */
export function Radio<V, E = any>(props: Props<V, E>) {
  const { disabled, label, name, value, onSelect } = props;
  const form = useForm();
  const textToString = useTextToString();

  const isSelected = isEqual(form.getValue(name)?.value, value.value);

  return (
    <label className={styles.container}>
      <input
        checked={isSelected}
        className={styles.input}
        disabled={disabled}
        name={name}
        type="radio"
        onChange={e => {
          if (e.currentTarget.checked) {
            form.setValue(name, value);
          }
          onSelect?.(value);
        }}
      />
      <div className={styles.hover} />
      <div className={styles.circle} />
      <div className={styles.dot} />
      {label && (
        <div className={styles.label}>
          <Caption>{textToString(label)}</Caption>
        </div>
      )}
    </label>
  );
}
