import cx from 'classnames';
import React from 'react';

import styles from './index.module.scss';

interface Props
  extends Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange'> {
  /**
   * Starting value for the switch. One of `'on'` or `'off'`.
   */
  defaultValue?: 'on' | 'off';
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
   * `(value: 'on' | 'off') => void`
   */
  onChange?: (value: 'on' | 'off') => void;
}

/**
 * Switch, behaves like a checkbox
 */
export function Switch(props: Props) {
  const { className, disabled, defaultValue, onChange, ...rest } = props;

  return (
    <div className={styles.wrapper}>
      <label
        className={cx(styles.container, className, {
          [styles.disabled]: !!disabled,
        })}
      >
        <input
          className={styles.hidden}
          defaultChecked={defaultValue === 'on' ? true : undefined}
          disabled={disabled}
          type="checkbox"
          onChange={e => {
            if (onChange) {
              onChange(e.currentTarget.checked ? 'on' : 'off');
            }
          }}
          {...rest}
        />
        <div className={styles.bg} />
        <div className={styles.thumb} />
      </label>
    </div>
  );
}
