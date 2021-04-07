import cx from 'classnames';
import React, { forwardRef } from 'react';

import { Caption } from '@/components/typography/Caption';

import styles from './index.module.scss';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  /**
   * Error text to display on the Input.
   */
  error?: string;
  /**
   * Display an icon on the right hand side of the input field
   */
  icon?: React.ReactElement;
  /**
   * Placeholder text to show inside the input
   */
  label: string;
  /**
   * Reference name for input value
   */
  name: string;
}

/**
 * Custom input
 */
export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  props: Props,
  ref,
) {
  const { className, error, icon, label, ...rest } = props;

  return (
    <div className={className}>
      <label
        className={cx(styles.container, {
          [styles.withError]: !!error,
          [styles.withIcon]: !!icon,
        })}
      >
        <input
          {...rest}
          className={cx(styles.input, rest.className)}
          placeholder="&nbsp;"
          ref={ref}
          type="text"
        />
        <div className={styles.label}>{label}</div>
        {icon &&
          React.cloneElement(icon, {
            className: cx(styles.icon, icon.props.className),
          })}
      </label>
      {error && (
        <div className={styles.error}>
          <Caption>{error}</Caption>
        </div>
      )}
    </div>
  );
});
