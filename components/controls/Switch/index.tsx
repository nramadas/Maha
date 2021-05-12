import cx from 'classnames';
import React from 'react';

import { useForm } from '@/hooks/useForm';

import styles from './index.module.scss';

interface Props {
  /**
   * Extra styling
   */
  className?: string;
  /**
   * When set to true, prevents the users for toggling teh Switch
   */
  disabled?: boolean;
  /**
   * Input name
   */
  name: string;
  /**
   * Callback, fired when the value changes. Signature is
   * `(value: boolean) => void`
   */
  onChange?: (value: boolean) => void;
}

/**
 * Switch, behaves like a checkbox
 */
export function Switch(props: Props) {
  const { className, disabled, name, onChange } = props;

  const form = useForm();
  const checked = form.getValue(name) || false;

  return (
    <div className={styles.wrapper}>
      <label
        className={cx(styles.container, className, {
          [styles.disabled]: !!disabled,
        })}
      >
        <input
          checked={checked}
          className={styles.hidden}
          disabled={disabled}
          type="checkbox"
          onChange={e => {
            const checked = e.currentTarget.checked;
            form.setValue(name, checked);
            onChange?.(e.currentTarget.checked);
          }}
        />
        <div className={styles.bg} />
        <div className={styles.thumb} />
      </label>
    </div>
  );
}
