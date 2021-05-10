import isEqual from 'lodash/isEqual';
import React, { useRef } from 'react';

import { Checkmark } from '@/components/icons/Checkmark';
import { Caption } from '@/components/typography/Caption';
import { useForm } from '@/hooks/useForm';

import styles from './index.module.scss';

interface Value {
  text: string;
}

interface Props<V> {
  __doNotWriteToForm?: boolean;
  /**
   * Whether or not the checkbox is disabled
   */
  disabled?: boolean;
  /**
   * Optional label that is displayed next to the checkbox
   */
  label?: string;
  /**
   * Reference name for checkbox value
   */
  name: string;
  /**
   * Value of the checkbox option
   */
  value: V;
  /**
   * Callback for when this checkbox option is selected
   */
  onSelect?(value: V): void;
}

/**
 * Custom checkbox
 */
export function Checkbox<V extends Value>(props: Props<V>) {
  const { disabled, label, name, value, onSelect } = props;
  const form = useForm();
  const defaultSelections = useRef(form.getValue(name) || []);
  const defaultChecked = !!defaultSelections.current.find((s: V) =>
    isEqual(s, value),
  );

  return (
    <label className={styles.container}>
      <input
        className={styles.input}
        defaultChecked={defaultChecked}
        disabled={disabled}
        type="checkbox"
        onInput={e => {
          const currentlySelected = new Set<V>(form.getValue(name) || []);

          if (e.currentTarget.checked) {
            currentlySelected.add(value);
          } else {
            currentlySelected.delete(value);
          }

          if (!props.__doNotWriteToForm) {
            form.setValue(name, Array.from(currentlySelected.values()));
          }

          onSelect?.(value);
        }}
      />
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
