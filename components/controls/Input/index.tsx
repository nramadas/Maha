import cx from 'classnames';
import React, { forwardRef } from 'react';

import { Caption } from '@/components/typography/Caption';
import { useForm } from '@/hooks/useForm';

import styles from './index.module.scss';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  __doNotWriteToForm?: boolean;
  /**
   * Additional styling
   */
  className?: string;
  /**
   * Whether or not the input is disabled
   */
  disabled?: boolean;
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
  /**
   * Inline styles
   */
  style?: React.InputHTMLAttributes<HTMLInputElement>['style'];
  /**
   * Which kind of input it is
   */
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
}

/**
 * Custom input
 */
export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  props: Props,
  ref,
) {
  const {
    __doNotWriteToForm,
    className,
    disabled,
    error,
    icon,
    label,
    name,
    style,
    type,
    ...rest
  } = props;
  const form = useForm();

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
          autoComplete="off"
          className={styles.input}
          disabled={disabled}
          placeholder="&nbsp;"
          name={name}
          ref={ref}
          style={style}
          type={type}
          onInput={e => {
            const value = e.currentTarget.value;
            if (!__doNotWriteToForm) {
              form.setValue(name, value);
            }
            rest.onInput?.(e);
          }}
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
