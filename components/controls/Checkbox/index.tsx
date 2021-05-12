import isEqual from 'lodash/isEqual';
import React from 'react';

import { Checkmark } from '@/components/icons/Checkmark';
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
  __doNotWriteToForm?: boolean;
  /**
   * Whether or not the checkbox is disabled
   */
  disabled?: boolean;
  /**
   * Optional label that is displayed next to the checkbox
   */
  label?: Text;
  /**
   * Reference name for checkbox value
   */
  name: string;
  /**
   * Value of the checkbox option
   */
  value: Value<V, E>;
  /**
   * Callback for when this checkbox option is selected
   */
  onSelect?(value: Value<V, E>): void;
}

/**
 * Custom checkbox
 */
export function Checkbox<V, E = any>(props: Props<V, E>) {
  const { disabled, label, name, value, onSelect } = props;

  const form = useForm();
  const textToString = useTextToString();

  const currentSelections: Value<V, E>[] = form.getValue(name) || [];
  const isSelected = !!currentSelections.find(s =>
    isEqual(s.value, value.value),
  );

  return (
    <label className={styles.container}>
      <input
        checked={isSelected}
        className={styles.input}
        disabled={disabled}
        type="checkbox"
        onChange={e => {
          if (disabled) {
            return;
          }

          const currentlySelected: Value<V, E>[] = form.getValue(name) || [];
          const withoutSelected = currentlySelected.filter(
            s => !isEqual(s.value, value.value),
          );

          const newSelected = e.currentTarget.checked
            ? withoutSelected.concat(value)
            : withoutSelected;

          if (!props.__doNotWriteToForm) {
            form.setValue(name, newSelected);
          }

          onSelect?.(value);
        }}
      />
      <div className={styles.hover} />
      <div className={styles.box}>
        <Checkmark className={styles.check} />
      </div>
      <div className={styles.label}>
        <Caption>{label && textToString(label)}</Caption>
      </div>
    </label>
  );
}
