import cx from 'classnames';
import React from 'react';

import styles from './index.module.scss';

interface Props {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  style?: React.ButtonHTMLAttributes<HTMLButtonElement>['style'];
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  onClick?(): void;
}
/**
 * Primary button component
 */
export function Filled(props: Props) {
  return <button {...props} className={cx(styles.button, props.className)} />;
}
